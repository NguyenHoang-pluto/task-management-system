import {
  Row,
  Col,
  Card,
  Typography,
  Progress,
  Tag,
  DatePicker,
  Divider,
  Tabs,
  Segmented,
  Pagination,
  Space,
} from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined,
  FireOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Pie } from "@ant-design/plots";
import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;


type Team = {
  id: number;
  name: string;
  totalTasks: number;
  doneTasks: number;
  overdueTasks: number;
};

type ProjectStatus = "DONE" | "IN_PROGRESS" | "OVERDUE";

type Project = {
  id: number;
  name: string;
  status: ProjectStatus;
};

type Task = {
  id: number;
  title: string;
  team: string;
  deadline: Dayjs;
};

/* ================= MOCK DATA (GIẢ LẬP DỮ LIỆU NHIỀU) ================= */

const teams: Team[] = Array.from({ length: 14 }).map((_, i) => ({
  id: i + 1,
  name: `Team ${i + 1}`,
  totalTasks: 20 + (i % 7) * 3,
  doneTasks: 10 + (i % 7) * 2,
  overdueTasks: i % 4,
}));

const projects: Project[] = Array.from({ length: 13 }).map((_, i) => ({
  id: i + 1,
  name: `Project ${i + 1}`,
  status: i % 5 === 0 ? "OVERDUE" : i % 3 === 0 ? "IN_PROGRESS" : "DONE",
}));

const tasks: Task[] = Array.from({ length: 25 }).map((_, i) => ({
  id: i + 1,
  title: `Task ${i + 1} - Implement feature`,
  team: `Team ${(i % 5) + 1}`,
  deadline: dayjs().add((i + 1) * 6, "hour"),
}));

/* ================= MOCK STATISTIC (TASK STATUS) ================= */
const statisticResult = {
  taskDone: 60,
  taskPending: 25,
  taskOverdue: 10,
};

/* ================= CONFIG ================= */
const PAGE_SIZE = 6;
const RANK_PAGE_SIZE = 4;
const UPCOMING_PAGE_SIZE = 4;

const Dashboard = () => {
  const navigate = useNavigate();

  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const [teamPage, setTeamPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);
  const [rankPage, setRankPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [statsView, setStatsView] = useState<'projects' | 'tasks'>('projects');
  const [overviewOption, setOverviewOption] = useState<'all' | 'week' | 'month' | 'year'>('month');

  const applyOverviewOption = (opt: 'all' | 'week' | 'month' | 'year') => {
    setOverviewOption(opt);

    if (opt === 'week') {
      setRange([dayjs().startOf('week'), dayjs().endOf('week')]);
    } else if (opt === 'month') {
      setRange([dayjs().startOf('month'), dayjs().endOf('month')]);
    } else if (opt === 'year') {
      setRange([dayjs().startOf('year'), dayjs().endOf('year')]);
    } else if (opt === 'all') {
      // expand range to cover all task deadlines
      if (tasks.length) {
        const min = dayjs(Math.min(...tasks.map((t) => t.deadline.valueOf()))).startOf('day');
        const max = dayjs(Math.max(...tasks.map((t) => t.deadline.valueOf()))).endOf('day');
        setRange([min, max]);
      }
    }
  };

  /* ================= CALCULATE (KHÔNG THỪA BIẾN) ================= */

  // TEAM/TASK OVERVIEW
  const totalTeams = teams.length;

  const totalTasks = useMemo(
    () => teams.reduce((s, t) => s + t.totalTasks, 0),
    []
  );
  const doneTasks = useMemo(
    () => teams.reduce((s, t) => s + t.doneTasks, 0),
    []
  );
  const overdueTasks = useMemo(
    () => teams.reduce((s, t) => s + t.overdueTasks, 0),
    []
  );

  const avgTeamProgress = useMemo(() => {
    if (!teams.length) return 0;
    const totalPercent = teams.reduce((s, t) => s + (t.doneTasks / (t.totalTasks || 1)) * 100, 0);
    return Math.round(totalPercent / teams.length);
  }, []);

  const StatCard = ({
    title,
    value,
    prefix,
    description,
    extra,
    color = '#1890ff',
    statusColor,
    onClick,
  }: {
    title: string;
    value: React.ReactNode;
    prefix?: React.ReactNode;
    description?: React.ReactNode;
    extra?: React.ReactNode;
    color?: string;
    statusColor?: string;
    onClick?: () => void;
  }) => (
    <Card
      hoverable
      onClick={onClick}
      style={{ overflow: 'hidden', borderRadius: 12, boxShadow: '0 8px 28px rgba(0,0,0,0.06)', cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* status bar */}
      {statusColor ? (
        <div style={{ height: 6, background: statusColor, width: '100%' }} />
      ) : null}

      <div style={{ padding: 12, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16, color }}>
          {prefix}
        </div>

        <div style={{ flex: 1 }}>
          <Text type="secondary">{title}</Text>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
            {extra}
          </div>
          {description && <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>{description}</div>}
        </div>
      </div>
    </Card>
  );

  // Tasks within selected range (used for overview granularity)
  const tasksInRange = useMemo(() => {
    const start = range[0].valueOf();
    const end = range[1].valueOf();
    return tasks.filter((t) => t.deadline.valueOf() >= start && t.deadline.valueOf() <= end);
  }, [range]);

  const overdueInRange = useMemo(() => tasksInRange.filter((t) => t.deadline.isBefore(dayjs())).length, [tasksInRange]);
  const upcomingInRange = useMemo(() => tasksInRange.filter((t) => t.deadline.isAfter(dayjs())).length, [tasksInRange]);


  // PROJECT OVERVIEW
  const totalProjects = projects.length;
  const doneProjects = useMemo(
    () => projects.filter((p) => p.status === "DONE").length,
    []
  );
  const overdueProjects = useMemo(
    () => projects.filter((p) => p.status === "OVERDUE").length,
    []
  );

  const inProgressProjects = useMemo(
    () => projects.filter((p) => p.status === "IN_PROGRESS").length,
    []
  );

  // RANKING
  const rankedTeams = useMemo(
    () => [...teams].sort((a, b) => b.doneTasks - a.doneTasks),
    []
  );

  // UPCOMING TASKS (SẮP ĐẾN HẠN)
  const upcomingTasks = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => a.deadline.valueOf() - b.deadline.valueOf()),
    []
  );
  

  

  // PAGINATION DATA
  const pagedTeams = useMemo(
    () => teams.slice((teamPage - 1) * PAGE_SIZE, teamPage * PAGE_SIZE),
    [teamPage]
  );
  const pagedProjects = useMemo(
    () =>
      projects.slice((projectPage - 1) * PAGE_SIZE, projectPage * PAGE_SIZE),
    [projectPage]
  );
  const pagedTasks = useMemo(
    () => tasks.slice((taskPage - 1) * PAGE_SIZE, taskPage * PAGE_SIZE),
    [taskPage]
  );

  const pagedRankedTeams = useMemo(
    () => rankedTeams.slice((rankPage - 1) * RANK_PAGE_SIZE, rankPage * RANK_PAGE_SIZE),
    [rankPage, rankedTeams]
  );

  const pagedUpcomingTasks = useMemo(
    () => upcomingTasks.slice((upcomingPage - 1) * UPCOMING_PAGE_SIZE, upcomingPage * UPCOMING_PAGE_SIZE),
    [upcomingPage, upcomingTasks]
  );

  /* ================= PIE (TASK STATUS) ================= */

  const pieConfig = {
    data: [
      { type: "Hoàn thành", value: statisticResult.taskDone },
      { type: "Chưa hoàn thành", value: statisticResult.taskPending },
      { type: "Quá hạn", value: statisticResult.taskOverdue },
    ],
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.65,
    label: { type: "inner", content: "{value}" },
    legend: { position: "bottom" },
    interactions: [{ type: "element-active" }],
  };

  const projectPieConfig = {
    data: [
      { type: "Hoàn thành", value: doneProjects },
      { type: "Đang tiến hành", value: Math.max(0, totalProjects - doneProjects - overdueProjects) },
      { type: "Quá hạn", value: overdueProjects },
    ],
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.65,
    label: { type: "inner", content: "{value}" },
    legend: { position: "bottom" },
    interactions: [{ type: "element-active" }],
  };

  const projectStatusTag = (status: ProjectStatus) => {
    if (status === "DONE") return <Tag color="green">DONE</Tag>;
    if (status === "OVERDUE") return <Tag color="red">OVERDUE</Tag>;
    return <Tag color="blue">IN_PROGRESS</Tag>;
  };

  return (
    <>
      {/* ================= OVERVIEW ================= */}
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Title level={4} style={{ marginBottom: 0 }}>📊 Tổng quan hệ thống</Title>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Segmented
              options={[
                { label: 'Tất cả', value: 'all' },
                { label: 'Tuần', value: 'week' },
                { label: 'Tháng', value: 'month' },
                { label: 'Năm', value: 'year' },
              ]}
              value={overviewOption}
              onChange={(v) => applyOverviewOption(v as 'all' | 'week' | 'month' | 'year')}
            />

            <Text type="secondary" style={{ whiteSpace: 'nowrap' }}>
              {range[0].format('DD/MM/YYYY')} – {range[1].format('DD/MM/YYYY')}
            </Text>
          </div>
        </Row>

        <Row gutter={[16, 16]}>
          {[
            {
              key: 'team',
              title: 'Team',
              value: totalTeams,
              prefix: <TeamOutlined style={{ fontSize: 20 }} />,
              description: <span>Trung bình tiến độ: <b>{avgTeamProgress}%</b></span>,
              color: '#1890ff',
              statusColor: '#1890ff',
            },
            {
              key: 'project',
              title: `Project (${overviewOption === 'all' ? 'Tất cả' : overviewOption})`,
              value: totalProjects,
              prefix: <ProjectOutlined style={{ fontSize: 20 }} />,
              description: (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#888' }}>Trong kỳ</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{totalProjects}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>Hoàn thành: <Text strong>{doneProjects}</Text></div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#888' }}>Đang tiến</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{inProgressProjects}</div>
                    <div style={{ fontSize: 12, marginTop: 6 }}><Text type="danger">Quá hạn: {overdueProjects}</Text></div>
                  </div>
                </div>
              ),
              color: '#fa8c16',
              statusColor: '#1890ff',
            },

            {
              key: 'risk',
              title: 'Rủi ro (quá hạn)',
              value: overdueInRange,
              prefix: <FireOutlined style={{ fontSize: 20 }} />,
              description: 'Xem chi tiết phần Rủi ro bên dưới',
              color: '#ff4d4f',
            },
            {
              key: 'task',
              title: `Task (${overviewOption === 'all' ? 'Tất cả' : overviewOption})`,
              value: totalTasks,
              prefix: <CheckCircleOutlined style={{ fontSize: 20 }} />,
              description: (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ fontSize: 12, color: '#666' }}>Trong kỳ<br/><b>{tasksInRange.length}</b></div>
                  <div style={{ fontSize: 12, color: '#666' }}>Sắp đến<br/><b>{upcomingInRange}</b></div>
                  <div style={{ fontSize: 12, color: '#ff4d4f' }}>Quá hạn<br/><b>{overdueInRange}</b></div>
                </div>
              ),
              color: '#13c2c2',
              statusColor: '#1890ff',
            },
          ].map((c) => (
            <Col xs={24} sm={12} md={6} lg={6} key={c.key}>
              <StatCard title={c.title} value={c.value} prefix={c.prefix} description={c.description} color={c.color} />
            </Col>
          ))}
        </Row>
      </Card>

      {/* ================= LISTS (TEAM / PROJECT / TASK) ================= */}
      <Card>
        <Tabs
          defaultActiveKey="teams"
          items={[
            {
              key: "teams",
              label: "👥 Danh sách team",
              children: (
                <>
                  <Row gutter={[16, 16]}>
                    {pagedTeams.map((team) => {
                      const percent = Math.round(
                        (team.doneTasks / team.totalTasks) * 100
                      );

                      return (
                        <Col span={8} key={team.id}>
                          <Card
                            hoverable
                            onClick={() => navigate(`/teams/${team.id}`)}
                          >
                            <Title level={5} style={{ marginBottom: 8 }}>
                              {team.name}
                            </Title>
                            <Progress percent={percent} />

                            <Space wrap>
                              <Tag color="blue">{team.totalTasks} task</Tag>
                              <Tag color="green">{team.doneTasks} xong</Tag>
                              <Tag color="red">{team.overdueTasks} quá hạn</Tag>
                            </Space>

                            <div style={{ marginTop: 8 }}>
                              <Text type="secondary">
                                Click để xem chi tiết
                              </Text>
                            </div>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>

                  <Divider />
                  <Pagination
                    current={teamPage}
                    pageSize={PAGE_SIZE}
                    total={teams.length}
                    onChange={setTeamPage}
                    align="center"
                    showSizeChanger={false}
                  />
                </>
              ),
            },
            {
              key: "projects",
              label: "📦 Danh sách project",
              children: (
                <>
                  <Row gutter={[16, 16]}>
                    {pagedProjects.map((project) => (
                      <Col span={8} key={project.id}>
                        <Card
                          hoverable
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          <Title level={5} style={{ marginBottom: 8 }}>
                            {project.name}
                          </Title>
                          {projectStatusTag(project.status)}
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                              Click để xem chi tiết
                            </Text>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  <Divider />
                  <Pagination
                    current={projectPage}
                    pageSize={PAGE_SIZE}
                    total={projects.length}
                    onChange={setProjectPage}
                    align="center"
                    showSizeChanger={false}
                  />
                </>
              ),
            },
            {
              key: "tasks",
              label: "✅ Danh sách task",
              children: (
                <>
                  <Row gutter={[16, 16]}>
                    {pagedTasks.map((task) => {
                      const hoursLeft = task.deadline.diff(dayjs(), "hour");
                      const urgency =
                        hoursLeft <= 12
                          ? { label: "GẤP", tag: "red" as const }
                          : hoursLeft <= 48
                          ? { label: "SẮP ĐẾN", tag: "orange" as const }
                          : { label: "BÌNH THƯỜNG", tag: "green" as const };

                      return (
                        <Col span={8} key={task.id}>
                          <Card hoverable>
                            <Title level={5} style={{ marginBottom: 8 }}>
                              {task.title}
                            </Title>

                            <Text type="secondary">{task.team}</Text>
                            <Divider style={{ margin: "10px 0" }} />

                            <Space wrap>
                              <Tag color={urgency.tag}>{urgency.label}</Tag>
                              <Tag color={hoursLeft <= 24 ? "red" : "orange"}>
                                Còn {hoursLeft} giờ
                              </Tag>
                              <Tag>{task.deadline.format("DD/MM HH:mm")}</Tag>
                            </Space>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>

                  <Divider />
                  <Pagination
                    current={taskPage}
                    pageSize={PAGE_SIZE}
                    total={tasks.length}
                    onChange={setTaskPage}
                    align="center"
                    showSizeChanger={false}
                  />
                </>
              ),
            },
          ]}
        />
      </Card>

      {/* ================= STATS + ACTION ================= */}
      <Card style={{ marginTop: 32 }}>
        <Row justify="space-between" align="middle">
          <Title level={4} style={{ marginBottom: 0 }}>
            📈 Thống kê & hành động
          </Title>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Segmented
              options={[
                { label: 'Tất cả', value: 'all' },
                { label: 'Tuần', value: 'week' },
                { label: 'Tháng', value: 'month' },
                { label: 'Năm', value: 'year' },
              ]}
              value={overviewOption}
              onChange={(v) => applyOverviewOption(v as 'all' | 'week' | 'month' | 'year')}
            />

            <RangePicker
              value={range}
              onChange={(v) => v && setRange(v as [Dayjs, Dayjs])}
              format="DD/MM/YYYY"
            />
          </div>
        </Row>

        <Row gutter={24} style={{ marginTop: 16 }}>
          {/* LEFT – SWITCHABLE PIE (PROJECT / TASK) + SUMMARY */}
          <Col span={12}>
            <Segmented
              options={[{ label: "Dự án", value: "projects" }, { label: "Task", value: "tasks" }]}
              value={statsView}
              onChange={(v) => setStatsView(v as "projects" | "tasks")}
              style={{ marginBottom: 12 }}
            />

            {statsView === "projects" ? (
              <>
                <Title level={5}>📦 Thống kê theo dự án</Title>
                <Pie {...projectPieConfig} />
              </>
            ) : (
              <>
                <Title level={5}>📝 Thống kê theo task</Title>
                <Pie {...pieConfig} />
              </>
            )}

            <Divider />

            <Text>
              📅 <b>Khoảng thời gian:</b>{" "}
              {range[0].format("DD/MM/YYYY")} – {range[1].format("DD/MM/YYYY")}
            </Text>

            <div style={{ marginTop: 10 }}>
              {statsView === "projects" ? (
                <Text>
                  • Project: {doneProjects}/{totalProjects} hoàn thành –{" "}
                  <Text type="danger">{overdueProjects} quá hạn</Text>
                </Text>
              ) : (
                <Text>
                  • Task: {doneTasks}/{totalTasks} hoàn thành –{" "}
                  <Text type="danger">{overdueTasks} quá hạn</Text>
                </Text>
              )}
            </div>
          </Col>

          {/* RIGHT – RANKING + UPCOMING */}
          <Col span={12}>
            <Title level={5} style={{ marginTop: 0 }}>
              🏆 Top team hiệu suất
            </Title>  

            {pagedRankedTeams.map((team, indexInPage) => {
              const index = (rankPage - 1) * RANK_PAGE_SIZE + indexInPage;
              const percent = Math.round((team.doneTasks / team.totalTasks) * 100);
              const medal =
                index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "⭐";

              return (
                <Card key={team.id} size="small" style={{ marginBottom: 8 }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong>
                        {medal} {team.name}
                      </Text>
                      <br />
                      <Text type="secondary">
                        {team.doneTasks}/{team.totalTasks} task
                      </Text>
                    </Col>
                    <Col span={8}>
                      <Progress percent={percent} size="small" />
                    </Col>
                  </Row>
                </Card>
              );
            })}

            <Pagination
              current={rankPage}
              pageSize={RANK_PAGE_SIZE}
              total={rankedTeams.length}
              onChange={setRankPage}
              align="center"
              showSizeChanger={false}
            />

            <Divider />
            <Title level={5} style={{ marginTop: 0 }}>
              ⏰ Task sắp đến hạn
            </Title>

            {pagedUpcomingTasks.map((task) => {
              const hoursLeft = task.deadline.diff(dayjs(), "hour");
              const color =
                hoursLeft <= 12 ? "#ff4d4f" : hoursLeft <= 48 ? "#fa8c16" : "#52c41a";
              const label = hoursLeft <= 12 ? "GẤP" : hoursLeft <= 48 ? "SẮP ĐẾN" : "BÌNH THƯỜNG";

              return (
                <Card
                  key={task.id}
                  size="small"
                  style={{ marginBottom: 8, borderLeft: `4px solid ${color}` }}
                >
                  <Row justify="space-between">
                    <Col>
                      <Text strong>{task.title}</Text>
                      <br />
                      <Text type="secondary">{task.team}</Text>
                    </Col>
                    <Col style={{ textAlign: "right" }}>
                      <Tag color={label === "GẤP" ? "red" : label === "SẮP ĐẾN" ? "orange" : "green"}>
                        {label}
                      </Tag>
                      <br />
                      <Text type={label === "GẤP" ? "danger" : "secondary"}>
                        Còn {hoursLeft} giờ
                      </Text>
                    </Col>
                  </Row>
                </Card>
              );
            })}

            <Pagination
              current={upcomingPage}
              pageSize={UPCOMING_PAGE_SIZE}
              total={upcomingTasks.length}
              onChange={setUpcomingPage}
              align="center"
              showSizeChanger={false}
            />
          </Col>
        </Row>
      </Card>

      {/* ================= FOOTER ================= */}
      <Divider />
      <Text type="secondary" style={{ textAlign: "center", display: "block" }}>
        © {new Date().getFullYear()} HoangNguyen-pluto – Fullstack Developer
        <br />
        Mini Jira – Task & Project Management System
      </Text>
    </>
  );
};

export default Dashboard;
