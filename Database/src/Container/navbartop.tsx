import React from "react";
import { Layout, Space } from "antd";
import { FaRegUserCircle } from "react-icons/fa";
import LogoutButton from "../components/LogoutButton";

const { Header } = Layout;

const NavbarTop: React.FC = () => {
  return (
    <Header
      style={{
        padding: 0,
        background: "#CBC6FF",
        maxHeight: "6vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingRight: "4%",
      }}
    >
      <Space align="center" size="middle">
        <FaRegUserCircle style={{ marginRight: "8px", marginTop: "2px", width: "20px", height: "auto" }} />
        <span
          style={{
            color: "black",
            fontSize: "17px",
            fontWeight: "500",
          }}
        >
          {localStorage.getItem('username') || 'Admin'}
        </span>
        <LogoutButton />
      </Space>
    </Header>
  );
};

export default NavbarTop;
