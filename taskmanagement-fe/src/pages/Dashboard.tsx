import {
  Row,
  Col,
  Card,
  Typography,
  Statistic,
  Progress,
  Tag,
  DatePicker,
  Divider,
  Tabs,
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

const Dashboard = () => {
  const navigate = useNavigate();

  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const [teamPage, setTeamPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);

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

  // RANKING
  const rankedTeams = useMemo(
    () => [...teams].sort((a, b) => b.doneTasks - a.doneTasks).slice(0, 8),
    []
  );

  // UPCOMING TASKS (SẮP ĐẾN HẠN)
  const upcomingTasks = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => a.deadline.valueOf() - b.deadline.valueOf())
        .slice(0, 6),
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

  const projectStatusTag = (status: ProjectStatus) => {
    if (status === "DONE") return <Tag color="green">DONE</Tag>;
    if (status === "OVERDUE") return <Tag color="red">OVERDUE</Tag>;
    return <Tag color="blue">IN_PROGRESS</Tag>;
  };

  return (
    <>
      {/* ================= OVERVIEW ================= */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>📊 Tổng quan hệ thống</Title>

        <Row gutter={16}>
          <Col span={4}>
            <Statistic
              title="Team"
              value={totalTeams}
              prefix={<TeamOutlined />}
            />
          </Col>

          <Col span={4}>
            <Statistic
              title="Project"
              value={totalProjects}
              prefix={<ProjectOutlined />}
            />
          </Col>

          <Col span={4}>
            <Statistic
              title="Project hoàn thành"
              value={doneProjects}
              valueStyle={{ color: "#52c41a" }}
            />
          </Col>

          <Col span={4}>
            <Statistic
              title="Project quá hạn"
              value={overdueProjects}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Col>

          <Col span={4}>
            <Statistic title="Tổng task" value={totalTasks} />
          </Col>

          <Col span={4}>
            <Statistic
              title="Task hoàn thành"
              value={doneTasks}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Col>

          <Col span={4}>
            <Statistic
              title="Task quá hạn"
              value={overdueTasks}
              valueStyle={{ color: "#ff4d4f" }}
              prefix={<FireOutlined />}
            />
          </Col>
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

          <RangePicker
            value={range}
            onChange={(v) => v && setRange(v as [Dayjs, Dayjs])}
            format="DD/MM/YYYY"
          />
        </Row>

        <Row gutter={24} style={{ marginTop: 16 }}>
          {/* LEFT – PIE + SUMMARY */}
          <Col span={12}>
            <Pie {...pieConfig} />

            <Divider />

            <Text>
              📅 <b>Khoảng thời gian:</b>{" "}
              {range[0].format("DD/MM/YYYY")} – {range[1].format("DD/MM/YYYY")}
            </Text>

            <div style={{ marginTop: 10 }}>
              <Text>
                • Project: {doneProjects}/{totalProjects} hoàn thành –{" "}
                <Text type="danger">{overdueProjects} quá hạn</Text>
              </Text>
              <br />
              <Text>
                • Task: {doneTasks}/{totalTasks} hoàn thành –{" "}
                <Text type="danger">{overdueTasks} quá hạn</Text>
              </Text>
            </div>
          </Col>

          {/* RIGHT – RANKING + UPCOMING */}
          <Col span={12}>
            <Title level={5} style={{ marginTop: 0 }}>
              🏆 Top team hiệu suất
            </Title>

            {rankedTeams.slice(0, 4).map((team, index) => {
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

            <Divider />
            <Title level={5} style={{ marginTop: 0 }}>
              ⏰ Task sắp đến hạn
            </Title>

            {upcomingTasks.slice(0, 4).map((task) => {
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
