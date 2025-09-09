// src/layouts/FullLayout.tsx
import React from "react";
import Layout from "antd/es/layout";
import { Outlet } from "react-router-dom";
import Sidebar from "../Container/sidebar";
import NavbarTop from "../Container/navbartop";
import Content from "../Container/content";
import "./FullLayout.css";

interface FullLayoutProps {
  children?: React.ReactNode;
}

const FullLayout: React.FC<FullLayoutProps> = ({ children }) => {
  return (
    <Layout className="full-layout">
      <Sidebar />
      <Layout className="full-layout-inner">
        <NavbarTop />
        <Content>
          {children || <Outlet />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default FullLayout;

