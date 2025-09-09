// src/layouts/FullLayout.tsx
import React from "react";
import Layout from "antd/es/layout";
import { Outlet } from "react-router-dom";
import Sidebar from "../Container/sidebar";
import NavbarTop from "../Container/navbartop";
import Content from "../Container/content";

interface FullLayoutProps {
  children?: React.ReactNode;
}

const FullLayout: React.FC<FullLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ height: "100vh",  overflow: "hidden" }}>
      <Sidebar />
      <Layout style={{ display: "flex", flexDirection: "column" }}>
        <NavbarTop />
        <Content>
          {children || <Outlet />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default FullLayout;

