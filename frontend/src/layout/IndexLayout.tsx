import { Outlet } from "react-router-dom";
import React from "react";
import Layout from "antd/es/layout";
import Navbar from "../Container/index_page/navbar";

const IndexLayout = () => {
  return (
    <div>
      <Navbar />
      <Layout style={{ minHeight: "100vh" }}>
        <Layout.Content style={{ padding: "20px" }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </div>
  )
}
export default IndexLayout