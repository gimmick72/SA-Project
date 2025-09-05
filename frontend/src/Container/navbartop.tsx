// src/layout/NavbarTop.tsx
import React from "react";
import { Layout, Space, Dropdown, Modal, type MenuProps } from "antd";
import { SettingOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const NavbarTop: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

  const handleLogout = () => {
    Modal.confirm({
      title: "ยืนยันการออกจากระบบ",
      content: "คุณต้องการออกจากระบบใช่หรือไม่?",
      okText: "ออกจากระบบ",
      cancelText: "ยกเลิก",
      onOk: () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userRole");
        localStorage.removeItem("username");
        window.location.href = "/auth/login";
      },
    });
  };

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "settings") {
      navigate("/settings"); // ปรับ path ได้ตามที่โปรเจ็กต์คุณใช้
    }
    if (key === "logout") {
      handleLogout();
    }
  };

  const items: MenuProps["items"] = [
    { key: "settings", icon: <SettingOutlined />, label: "ตั้งค่า" },
    { type: "divider" },
    { key: "logout", icon: <LogoutOutlined />, label: "ออกจากระบบ", danger: true },
  ];

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
        <Dropdown
          menu={{ items, onClick: onMenuClick }}
          trigger={["click"]}
          placement="bottomRight"
          getPopupContainer={(t) => t.parentElement!}
        >
          <button
            type="button"
            style={{
              border: "1px none #d9d9d9",
              borderRadius: 10,
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
              width: 220,
              justifyContent: "space-between",
              background: "none",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FaRegUserCircle style={{ width: 20, height: 20, color: "#5b5b5b" }} />
              <span style={{ color: "#1f1f1f", fontSize: 16, fontWeight: 500 }}>
                {username}
              </span>
            </span>
            <DownOutlined style={{ fontSize: 12, color: "#8c8c8c" }} />
          </button>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default NavbarTop;
