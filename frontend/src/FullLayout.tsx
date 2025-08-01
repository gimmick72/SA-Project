import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import logo from "./assets/logo.png"; // Adjust the path according to your project structure
import { menuItems } from "./components/menuItems";

const { Header, Content, Sider } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    // menubar
    <Layout style={{ height: "100%", width: "100%" }}>
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

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
        />
      </Sider>

      <Layout style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Header
          // className="text-xl ml-auto mr-8 bg-[#CBC6FF] text-[#8E55D9] font-semibold flex items-center justify-between"
          style={{ padding: 0, background: "#CBC6FF", maxHeight: "6vh", textAlign: "right", color: "black", fontSize: "17px", fontWeight: "500" }}
        >username</Header>
        <Header
          style={{
            padding: 0,
            backgroundColor: "#FFFFFF",
            boxShadow: "0 2px 4px #E6E6E6",
            maxHeight: "5vh",
          }}
        ></Header>

        <Content style={{ margin: "30px", flexGrow: 1 }}>
          <div
            style={{
              padding: 24,
              height: "100%",
              background: colorBgContainer,
              borderRadius: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #E6E6E6",
            }}
          >
            content
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
