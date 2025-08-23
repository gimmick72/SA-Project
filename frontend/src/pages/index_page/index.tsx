import React from "react";
import Layout from "antd/es/layout";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Card from "antd/es/card";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Weight } from "lucide-react";
import IndexLayout from "../../layout/IndexLayout";

const { Content } = Layout;

const IndexPage: React.FC = () => {
  return (

    <div>
      {/* Content */}
      <Content style={{ padding: "60px 20px", minHeight: "100vh" }}>
        <Row justify="center">
          <Col xs={24} md={20} lg={18}>
            <Card
              bordered={false}
              style={{
                borderRadius: 24,
                padding: 24,
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                width: "100%",
                height: "100%", // ✅ ใช้ตัวเล็ก
                minHeight: 500, // 👉 กันการยุบ
              }}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  {/* <ClinicPromo /> */}
                </Col>
                <Col xs={24} md={12}>
                  {/* <PhotoPromo /> */}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </div>
   
  );
};

export default IndexPage;
