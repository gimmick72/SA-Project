import React from "react";
import { Row, Col, Card } from "antd";
import "./HomePage.css";

const HomePage: React.FC = () => {
  return (
    <div className="homepage-content">
      <div className="hero-section">
        <h1>ยินดีต้อนรับสู่คลินิกทันตกรรม TooThoot</h1>
        <p>บริการทันตกรรมครบครัน ด้วยทีมแพทย์ผู้เชี่ยวชาญและเทคโนโลยีทันสมัย</p>
      </div>
      
      <Row gutter={[24, 24]} className="content-grid">
        <Col xs={24} md={12}>
          <Card className="info-card">
            <h2>เกี่ยวกับเรา</h2>
            <p>คลินิกทันตกรรม TooThoot ให้บริการทันตกรรมครบครันด้วยทีมแพทย์ผู้เชี่ยวชาญ</p>
            
            <h3>บริการของเรา</h3>
            <ul>
              <li>การตรวจและทำความสะอาดฟัน</li>
              <li>การอุดฟัน</li>
              <li>การถอนฟัน</li>
              <li>การจัดฟัน</li>
              <li>การใส่ฟันปลอม</li>
            </ul>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card className="contact-card">
            <h3>ติดต่อเรา</h3>
            <div className="contact-info">
              <p><strong>โทรศัพท์:</strong> 02-123-4567</p>
              <p><strong>อีเมล:</strong> info@toothoot.com</p>
              <p><strong>ที่อยู่:</strong> 123 ถนนสุขุมวิท กรุงเทพฯ 10110</p>
            </div>
            
            <div className="hours-info">
              <h4>เวลาทำการ</h4>
              <p>จันทร์ - ศุกร์: 09:00 - 18:00</p>
              <p>เสาร์ - อาทิตย์: 09:00 - 16:00</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
