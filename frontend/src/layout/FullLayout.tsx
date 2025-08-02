// src/layouts/FullLayout.tsx
import React from "react";
import { Layout } from "antd";
import Sidebar from "../container/sidebar";
import NavbarTop from "../container/navbartop";
import Content from "../container/content";

interface FullLayoutProps {
  children: React.ReactNode;
}

const FullLayout: React.FC<FullLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ height: "100vh",  overflow: "hidden" }}>
      <Sidebar />
      <Layout style={{ display: "flex", flexDirection: "column" }}>
        <NavbarTop />
        <Content> {children}</Content>
      </Layout>
    </Layout>
  );
};

export default FullLayout;

