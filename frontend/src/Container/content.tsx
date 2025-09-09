import React from "react";
import { Layout, theme } from "antd";
import "./content.css";

const { Content } = Layout;

interface ContentLayoutProps {
  children: React.ReactNode;
}

const ContentLayout: React.FC<ContentLayoutProps> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Content className="content-layout">
      {children}
    </Content>
  );
};

export default ContentLayout;
