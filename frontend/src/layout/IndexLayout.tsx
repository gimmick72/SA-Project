import { Outlet } from "react-router-dom";
import React from "react";
import Layout from "antd/es/layout";
import Navbar from "../Container/index_page/navbar";
import "./IndexLayout.css";

const IndexLayout = () => {
  return (
    <div>
      <Navbar />
      <Layout className="index-layout">
        <Layout.Content className="index-layout-content">
          <Outlet />
        </Layout.Content>
      </Layout>
    </div>
  )
}
export default IndexLayout