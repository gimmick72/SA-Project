import React from "react";
import { Card, Button, Result, Typography } from "antd";
import { CheckCircleOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PaymentSuccessProps, PaymentMethod } from "../types";

const { Text } = Typography;

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ 
  paymentMethod, 
  amount, 
  transactionId = `TXN${Date.now()}` 
}) => {
  const navigate = useNavigate();

  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method) {
      case 'cash': return 'เงินสด';
      case 'promptpay': return 'พร้อมเพย์';
      case 'credit_card': return 'บัตรเครดิต';
      default: return method;
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ maxWidth: 600, width: '100%' }}>
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          status="success"
          title="ชำระเงินสำเร็จ!"
          subTitle={
            <div>
              <Text>การชำระเงินของคุณได้รับการดำเนินการเรียบร้อยแล้ว</Text>
              <br />
              <Text type="secondary">รหัสธุรกรรม: {transactionId}</Text>
            </div>
          }
          extra={[
            <div key="details" style={{ marginBottom: '20px' }}>
              <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text strong>วิธีการชำระ:</Text>
                  <Text>{getPaymentMethodName(paymentMethod)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text strong>จำนวนเงิน:</Text>
                  <Text strong style={{ color: '#52c41a' }}>฿{amount.toFixed(2)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>วันที่:</Text>
                  <Text>{new Date().toLocaleDateString('th-TH')}</Text>
                </div>
              </Card>
            </div>,
            <Button 
              key="home" 
              type="primary" 
              icon={<HomeOutlined />}
              onClick={() => navigate('/admin')}
              size="large"
            >
              กลับหน้าหลัก
            </Button>,
            <Button 
              key="new" 
              onClick={() => window.location.reload()}
              size="large"
            >
              ชำระเงินใหม่
            </Button>
          ]}
        />
      </Card>
    </div>
  );
};

export default PaymentSuccess;
