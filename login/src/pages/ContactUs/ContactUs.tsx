import React from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Space,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FacebookFilled,
  MessageOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const ContactPage: React.FC = () => {
  return (
    <Layout style={{ backgroundColor: "#F5F2F9", minHeight: "100vh" }}>
      <Content style={{ padding: "80px 20px" }}>
        <Row justify="center">
          <Col xs={24} md={20} lg={16}>
            <Card
              bordered={false}
              style={{
                borderRadius: 24,
                padding: 32,
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <Title
                level={2}
                style={{ color: "#722ED1", textAlign: "center", marginBottom: 24}}
              >
                ติดต่อเรา
              </Title>

              <Row gutter={[32, 32]}>
                {/* Left: Contact Info */}
                <Col xs={24} md={12}>
                  <Title level={4}>ข้อมูลติดต่อ</Title>

                  <Paragraph>
                    <EnvironmentOutlined style={{ color: "#722ED1", marginRight: 8 }} />
                    ดาวนาเม็ก
                  </Paragraph>

                  <Paragraph>
                    <PhoneOutlined style={{ color: "#722ED1", marginRight: 8 }} />
                    099-999-9999
                  </Paragraph>

                  <Paragraph>
                    <MailOutlined style={{ color: "#722ED1", marginRight: 8 }} />
                    contact@toothootclinic.com
                  </Paragraph>

                  <Paragraph>
                    <ClockCircleOutlined style={{ color: "#722ED1", marginRight: 8 }} />
                    เปิดบริการทุกวัน 00:00 - 23:59 น.
                  </Paragraph>

                  <Space direction="horizontal" style={{ marginTop: 16 }}>
                    <Button
                      icon={<FacebookFilled />}
                      href="https://facebook.com"
                      target="_blank"
                      style={{ backgroundColor: "#3b5998", color: "#fff" }}
                    >
                      Facebook
                    </Button>
                    <Button
                      icon={<MessageOutlined />}
                      href="https://line.me"
                      target="_blank"
                      style={{ backgroundColor: "#00C300", color: "#fff" }}
                    >
                      LINE
                    </Button>
                  </Space>
                </Col>

                {/* Right: Contact Form */}
                <Col xs={24} md={12}>
                  <Title level={4}>ส่งข้อความหาเรา</Title>
                  <Form layout="vertical">
                    <Form.Item label="ชื่อของคุณ" name="name">
                      <Input placeholder="ชื่อ-นามสกุล" />
                    </Form.Item>
                    <Form.Item label="อีเมล" name="email">
                      <Input placeholder="example@email.com" />
                    </Form.Item>
                    <Form.Item label="ข้อความ" name="message">
                      <Input.TextArea rows={4} placeholder="พิมพ์ข้อความของคุณที่นี่" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" style={{ backgroundColor: "#722ED1" }}>
                        ส่งข้อความ
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ContactPage;
