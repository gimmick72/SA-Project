import React from "react";
import {
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
import Pop from "../Motion/Pop";
import "./ContactUs.css";

const { Title, Paragraph } = Typography;

const ContactPage: React.FC = () => {
  return (
    <Pop>
      <div className="contact-content">
        <Title level={2} className="contact-title">
          ติดต่อเรา
        </Title>

        <Row gutter={[32, 32]} className="contact-row">
          {/* Left: Contact Info */}
          <Col xs={24} md={12}>
            <Card className="contact-info-card">
              <Title level={4} className="contact-section-title">ข้อมูลติดต่อ</Title>

              <Paragraph className="contact-item">
                <EnvironmentOutlined className="contact-icon" />
                ดาวนาเม็ก
              </Paragraph>

              <Paragraph className="contact-item">
                <PhoneOutlined className="contact-icon" />
                099-999-9999
              </Paragraph>

              <Paragraph className="contact-item">
                <MailOutlined className="contact-icon" />
                contact@toothootclinic.com
              </Paragraph>

              <Paragraph className="contact-item">
                <ClockCircleOutlined className="contact-icon" />
                เปิดบริการทุกวัน 00:00 - 23:59 น.
              </Paragraph>

              <Space direction="horizontal" className="social-buttons">
                <Button
                  icon={<FacebookFilled />}
                  href="https://facebook.com"
                  target="_blank"
                  className="facebook-btn"
                >
                  Facebook
                </Button>
                <Button
                  icon={<MessageOutlined />}
                  href="https://line.me"
                  target="_blank"
                  className="line-btn"
                >
                  LINE
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Right: Contact Form */}
          <Col xs={24} md={12}>
            <Card className="contact-form-card">
              <Title level={4} className="contact-section-title">ส่งข้อความหาเรา</Title>
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
                  <Button type="primary" className="submit-btn">
                    ส่งข้อความ
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </Pop>
  );
};

export default ContactPage;
