import React from "react";
import { Layout } from "antd";
import { FaRegUserCircle } from "react-icons/fa";

const { Header } = Layout;

const NavbarTop: React.FC = () => {
  return (
    <>
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
        <FaRegUserCircle style={{ marginRight: "18px", marginTop: "2px", width: "20px", height: "auto" }} />
        <span
          style={{
            color: "black",
            fontSize: "17px",
            fontWeight: "500",
          }}
        >
          Username
        </span>
      </Header>

      <Header
        style={{
          padding: 0,
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 4px #E6E6E6",
          maxHeight: "5vh",
        }}
      >
        {/* BreadcrumbCom ใส่ได้ในอนาคต */}
      </Header>
    </>
  );
};

export default NavbarTop;
