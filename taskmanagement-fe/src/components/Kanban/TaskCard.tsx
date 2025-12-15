import { Tag } from "antd";
import type { Task } from "../../types/task";
import Card from "../ui/AntdCard";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  const color =
    task.priority === "HIGH"
      ? "red"
      : task.priority === "MEDIUM"
      ? "orange"
      : "green";

  return (
    <Card size="small" style={{ marginBottom: 8 }}>
      <b>{task.title}</b>
      <div style={{ marginTop: 8 }}>
        <Tag color={color}>{task.priority}</Tag>
        <Tag>{task.assignee}</Tag>
      </div>
    </Card>
  );
};

export default TaskCard;
