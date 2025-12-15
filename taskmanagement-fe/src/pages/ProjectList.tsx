import Card from "../components/ui/AntdCard";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { projects } from "../mock/projects";

const ProjectList = () => {
  const navigate = useNavigate();

  return (
    <>
      <h2>Projects</h2>

      <Row gutter={16}>
        {projects.map((p) => (
          <Col span={6} key={p.id}>
            <Card
              hoverable
              title={p.name}
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              {p.description}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ProjectList;
