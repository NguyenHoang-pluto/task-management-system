import { Row, Col } from "antd";
import TaskColumn from "./TaskColumn";
import { tasks } from "../../mock/tasks";

const KanbanBoard = () => {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <TaskColumn
          title="TODO"
          tasks={tasks.filter((t) => t.status === "TODO")}
        />
      </Col>

      <Col span={8}>
        <TaskColumn
          title="IN_PROGRESS"
          tasks={tasks.filter((t) => t.status === "IN_PROGRESS")}
        />
      </Col>

      <Col span={8}>
        <TaskColumn
          title="DONE"
          tasks={tasks.filter((t) => t.status === "DONE")}
        />
      </Col>
    </Row>
  );
};

export default KanbanBoard;
