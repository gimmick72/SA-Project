import React from "react";
import { Layout, theme } from "antd";

const { Content } = Layout;

interface ContentLayoutProps {
  children: React.ReactNode;
}

const ContentLayout: React.FC<ContentLayoutProps> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (

    <Content style={{ margin: "30px", flexGrow: 1, }}>
      <div style={{
          padding: 24,
          height: "100%",
          background: "#FFFFFF",
          borderRadius: 20,
          border: "0.5px solid #000000",
          display: "block", 
        }}>
        {children}
      </div>

    </Content>
  );
};

export default ContentLayout;
