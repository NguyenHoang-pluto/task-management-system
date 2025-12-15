import Card from "../ui/AntdCard";
import type { Task, TaskStatus } from "../../types/task";
import TaskCard from "./TaskCard";

type Props = {
  title: TaskStatus;
  tasks: Task[];
};

const TaskColumn = ({ title, tasks }: Props) => {
  return (
    <Card title={title} style={{ width: 300 }}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </Card>
  );
};

export default TaskColumn;
