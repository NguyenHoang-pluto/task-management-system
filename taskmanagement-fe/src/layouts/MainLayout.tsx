import { Layout, Menu, Avatar, Space } from "antd";
import {
  DashboardOutlined,
  ProjectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider width={220} theme="dark">
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 600,
            color: "#fff",
          }}
        >
          Task Manager
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: "/",
              icon: <DashboardOutlined />,
              label: "Dashboard",
              onClick: () => navigate("/"),
            },
            {
              key: "/projects",
              icon: <ProjectOutlined />,
              label: "Projects",
              onClick: () => navigate("/projects"),
            },
          ]}
        />
      </Sider>

      {/* MAIN AREA */}
      <Layout>
        {/* HEADER */}
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 500 }}>
            Project Management
          </span>

          <Space>
            <Avatar icon={<UserOutlined />} />
            <span>Admin</span>
          </Space>
        </Header>

        {/* CONTENT */}
        <Content
          style={{
            padding: 24,
            background: "#f5f7fa",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
