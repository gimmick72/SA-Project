import React from "react";
import { Card, Button, Result, Typography } from "antd";
import { CloseCircleOutlined, ReloadOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PaymentErrorProps } from "../types";

const { Text } = Typography;

const PaymentError: React.FC<PaymentErrorProps> = ({ 
  errorMessage = "เกิดข้อผิดพลาดในการชำระเงิน กรุณาลองใหม่อีกครั้ง",
  errorCode = "ERR_PAYMENT_FAILED",
  onRetry
}) => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ maxWidth: 600, width: '100%' }}>
        <Result
          icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
          status="error"
          title="การชำระเงินไม่สำเร็จ"
          subTitle={
            <div>
              <Text>{errorMessage}</Text>
              <br />
              <Text type="secondary">รหัสข้อผิดพลาด: {errorCode}</Text>
            </div>
          }
          extra={[
            <div key="suggestions" style={{ marginBottom: '20px' }}>
              <Card size="small" style={{ backgroundColor: '#fff2f0' }}>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  แนวทางแก้ไข:
                </Text>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>ตรวจสอบข้อมูลการชำระเงินให้ถูกต้อง</li>
                  <li>ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
                  <li>ลองใช้วิธีการชำระเงินอื่น</li>
                  <li>ติดต่อเจ้าหน้าที่หากปัญหายังคงอยู่</li>
                </ul>
              </Card>
            </div>,
            <Button 
              key="retry" 
              type="primary" 
              icon={<ReloadOutlined />}
              onClick={onRetry || (() => window.location.reload())}
              size="large"
            >
              ลองใหม่
            </Button>,
            <Button 
              key="home" 
              icon={<HomeOutlined />}
              onClick={() => navigate('/admin')}
              size="large"
            >
              กลับหน้าหลัก
            </Button>
          ]}
        />
      </Card>
    </div>
  );
};

export default PaymentError;
