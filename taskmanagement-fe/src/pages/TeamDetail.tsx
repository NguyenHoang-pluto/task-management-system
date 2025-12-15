import { useParams } from "react-router-dom";
import { Card, List, Tag, Typography, Pagination } from "antd";
import { teams } from "../mock/teams";
import { members } from "../mock/members";
import { tasks } from "../mock/tasks";
import { useState } from "react";

const { Title, Text } = Typography;

const PAGE_SIZE = 3;

const TeamDetail = () => {
  const { id } = useParams();
  const teamId = Number(id);

  const team = teams.find(t => t.id === teamId);
  const teamMembers = members.filter(m => m.teamId === teamId);
  const teamTasks = tasks.filter(t => t.teamId === teamId);

  const [page, setPage] = useState(1);
  const pagedTasks = teamTasks.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (!team) return <Text>Team không tồn tại</Text>;

  return (
    <>
      <Title level={3}>👥 {team.name}</Title>

      {/* MEMBERS */}
      <Card title="Thành viên" style={{ marginBottom: 24 }}>
        <List
          dataSource={teamMembers}
          renderItem={(m) => <List.Item>{m.name}</List.Item>}
        />
      </Card>

      {/* TASKS */}
      <Card title="Công việc của team">
        <List
          dataSource={pagedTasks}
          renderItem={(t) => (
            <List.Item>
              <Text>{t.title}</Text>
              <Tag>{t.status}</Tag>
            </List.Item>
          )}
        />

        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={teamTasks.length}
          onChange={setPage}
          style={{ marginTop: 16, textAlign: "right" }}
        />
      </Card>
    </>
  );
};

export default TeamDetail;
