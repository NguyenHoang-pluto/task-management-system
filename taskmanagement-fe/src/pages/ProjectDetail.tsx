import { useParams } from "react-router-dom";
import KanbanBoard from "../components/Kanban/KanbanBoard";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h2>Project Detail {id && `#${id}`}</h2>
      <KanbanBoard />
    </div>
  );
};

export default ProjectDetail;
