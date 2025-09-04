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
    <Content style={{ margin: "30px", flexGrow: 1, backgroundColor: '#000000' }}>
      {children}
    </Content>
  );
};

export default ContentLayout;
