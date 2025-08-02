import React from "react";
import { Layout, Menu } from "antd";
import logo from "../assets/logo.png";
import { menuItems } from "../components/menuItems";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  return (
    <Sider
      style={{
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
       
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "15px 0",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "50px",
            borderRadius: "50%",
            border: "2px solid #8E55D9",
            marginRight: "8px",
          }}
        />
        <span style={{ fontSize: "25px", fontWeight: "600" }}>TooThoot</span>
      </div>

      <hr
        style={{
          border: "none",
          height: "2px",
          backgroundColor: "#8E55D9",
          margin: "12px 16px 16px 16px",
        }}
      />

      <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]} items={menuItems} />
    </Sider>
  );
};

export default Sidebar;
