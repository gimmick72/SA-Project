import { Link } from "react-router-dom";
import Card from "antd/es/card";
const { Meta } = Card;
import { Outlet } from "react-router-dom";
import { Header } from "antd/es/layout/layout";
import Layout from "antd/es/layout";
import { Avatar } from "antd";
import Title from "antd/es/skeleton/Title";
import Menu from "antd/es/menu/menu";


const Booking = () => {
  return (
    <>
    </>
    // <Layout style={{ minHeight: "100vh", fontFamily: "sans-serif", backgroundColor: "#F5F2F9" }}>
    //   <Header
    //     style={{
    //       backgroundColor: "#E7DDF6",
    //       display: "flex",
    //       justifyContent: "space-between",
    //       alignItems: "center",
    //       padding: "0 40px",
    //       minWidth: "1000px",
    //     }}
    //   >
    //     {/* Logo */}
    //     <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    //       <Avatar src="src\assets\logo.png" shape="circle" size="large" style={{ border: "solid 2px #8E55D9" }} />
    //       <Title level={3} style={{ margin: 0, color: "#722ED1" }}>
    //         TooThoot
    //       </Title>
    //     </div>

    //     {/* Menu */}
    //     <Menu
    //       mode="horizontal"
    //       style={{
    //         backgroundColor: "#E7DDF6",
    //         borderBottom: "none",
    //         display: "flex",
    //         justifyContent: "center",
    //         flex: 1,
    //       }}
    //     >
    //       <Menu.Item key="home">
    //         <a href="#home">หน้าแรก</a>
    //       </Menu.Item>
    //       <Menu.Item key="dentists">
    //         <a href="#dentists">ทันตแพทย์ของเรา</a>
    //       </Menu.Item>
    //       <Menu.Item key="services">
    //         <a href="#services">บริการ</a>
    //       </Menu.Item>
    //       <Menu.Item key="contact">
    //         <a href="#contact">ติดต่อเรา</a>
    //       </Menu.Item>
    //       <Menu.Item key="booking">
    //         <Link to="booking">จองคิว</Link>
    //       </Menu.Item>
    //     </Menu>

    //     {/* Sign In */}
    //     <div style={{ color: "#722ED1", fontWeight: 600, cursor: "pointer" }}>
    //       <UserOutlined style={{ marginRight: 6 }} />
    //       ลงชื่อเข้าใช้
    //     </div>
    //   </Header>



 
  );
};
export default Booking;