import { Outlet } from "react-router-dom";
import React from "react";
import Layout from "antd/es/layout";
import Navbar from "../Container/index_page/navbar";
import "./IndexLayout.css";

const IndexLayout = () => {
  return (
    <Layout className="index-layout">
      <Navbar />
      <Layout.Content className="index-layout-content">
        <div className="index-content-wrapper">
          <Outlet />
        </div>
      </Layout.Content>
    </Layout>
  )
}
export default IndexLayout