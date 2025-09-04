// src/layouts/FullLayout.tsx
import React from "react";
import Layout from "antd/es/layout";
import { Outlet } from "react-router-dom";
import Sidebar from "../Container/sidebar";
import NavbarTop from "../Container/navbartop";
import ContentLayout from "../Container/content.js";
interface FullLayoutProps {
  children?: React.ReactNode;
}

const FullLayout: React.FC<FullLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ height: "100vh",  overflow: "hidden" }}>
      <Sidebar />
      <Layout style={{ display: "flex", flexDirection: "column" }}>
        <NavbarTop />
        <ContentLayout>
          {children || <Outlet />}
        </ContentLayout>
      </Layout>
    </Layout>
  );
};

export default FullLayout;

