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
    <Content style={{             
            margin: "30px",
            flexGrow: 1,
            background: "#ffffff",
            height: '100%',
            padding: 24,
            border: "0.5px solid #000000",
            borderRadius: 20,}}>
      {children}
    </Content>
  );
};

export default ContentLayout;
