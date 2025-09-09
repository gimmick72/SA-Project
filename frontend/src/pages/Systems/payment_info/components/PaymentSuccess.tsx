import React from "react";
import { Card, Button, Result, Typography } from "antd";
import { CheckCircleOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PaymentSuccessProps, PaymentMethod } from "../types";
import "./PaymentSuccess.css";

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
    <div className="payment-success-container">
      <Card className="payment-success-card">
        <Result
          icon={<CheckCircleOutlined className="payment-success-icon" />}
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
            <div key="details" className="payment-success-details">
              <Card size="small" className="payment-success-details-card">
                <div className="payment-success-row">
                  <Text strong>วิธีการชำระ:</Text>
                  <Text>{getPaymentMethodName(paymentMethod)}</Text>
                </div>
                <div className="payment-success-row">
                  <Text strong>จำนวนเงิน:</Text>
                  <Text strong className="payment-success-amount">฿{amount.toFixed(2)}</Text>
                </div>
                <div className="payment-success-row">
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
