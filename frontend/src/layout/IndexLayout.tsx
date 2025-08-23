import { Outlet } from "react-router-dom";
import React from "react";
import Layout from "antd/es/layout";
import Navbar from "../Container/index_page/navbar";

interface IndexLayoutProps {
  children?: React.ReactNode;
}

const IndexLayout: React.FC<IndexLayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Layout style={{ minHeight: "100vh" }}>
        <Layout.Content style={{ padding: "20px" }}>
          {children || <Outlet />}
        </Layout.Content>
      </Layout>
    </div>
  )
}
export default IndexLayout