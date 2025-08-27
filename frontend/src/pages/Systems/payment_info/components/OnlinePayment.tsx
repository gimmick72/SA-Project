import React, { useState } from "react";
import { Card, Form, Input, Typography, Divider, Space, Button } from "antd";
import { QrcodeOutlined, CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { OnlinePaymentProps } from "../types";

const { Text, Title } = Typography;

const OnlinePayment: React.FC<OnlinePaymentProps> = ({ form }) => {
  const [copied, setCopied] = useState(false);
  
  // PromptPay ID for clinic
  const promptPayId = "0643070129"; // Clinic's PromptPay ID
  const clinicName = "คลินิกทันตกรรม ABC";

  const copyPromptPayId = async () => {
    try {
      await navigator.clipboard.writeText(promptPayId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Card title="การชำระเงินด้วยพร้อมเพย์" size="small" style={{ marginBottom: '16px' }}>
      {/* QR Code Section */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {/* Bank Header */}
        <div style={{ 
          backgroundColor: '#6B46C1', 
          color: 'white', 
          padding: '12px', 
          borderRadius: '8px 8px 0 0',
          marginBottom: '0'
        }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            🏦 SCB
          </Title>
        </div>
        
        {/* QR Code Display */}
        <div style={{ 
          backgroundColor: '#1E40AF', 
          color: 'white', 
          padding: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '12px'
        }}>
          <QrcodeOutlined style={{ fontSize: '24px' }} />
          <Text style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
            THAI QR PAYMENT
          </Text>
        </div>

        {/* PromptPay Logo */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '12px', 
          borderBottom: '1px solid #e0e0e0' 
        }}>
          <div style={{ 
            border: '2px solid #1E40AF', 
            borderRadius: '4px', 
            padding: '8px 16px', 
            display: 'inline-block',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1E40AF'
          }}>
            Prompt<span style={{ color: '#10B981' }}>Pay</span>
          </div>
        </div>

        {/* QR Code */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          display: 'flex', 
          justifyContent: 'center' 
        }}>
          <img 
            src="/promtpayqrcode.jpeg" 
            alt="PromptPay QR Code" 
            style={{ maxWidth: '200px', height: 'auto' }}
          />
        </div>

        {/* Payment Details */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '16px',
          border: '1px solid #d9d9d9',
          borderTop: 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Text strong>PAY TO PROMPTPAY</Text>
            <Text>{promptPayId.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</Text>
          </div>
          
          <Divider style={{ margin: '12px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>AMOUNT</Text>
            <Text style={{ fontSize: '18px' }}>___</Text>
          </div>
          
          <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
            * Payer to specify amount
          </Text>
        </div>

        {/* Footer */}
        <div style={{ 
          backgroundColor: '#6B46C1', 
          height: '20px',
          borderRadius: '0 0 8px 8px'
        }} />
      </div>

      <Divider />

      {/* Manual Payment Option */}
      <div style={{ marginTop: '16px' }}>
        <Text strong>หรือโอนเงินด้วยตนเอง:</Text>
        <div style={{ 
          backgroundColor: '#f6f6f6', 
          padding: '12px', 
          borderRadius: '6px',
          marginTop: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>หมายเลขพร้อมเพย์:</Text>
              <br />
              <Text copyable={{ text: promptPayId }}>{promptPayId}</Text>
            </div>
            <Button 
              icon={copied ? <CheckOutlined /> : <CopyOutlined />}
              onClick={copyPromptPayId}
              type={copied ? "primary" : "default"}
              size="small"
            >
              {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
            </Button>
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ชื่อบัญชี: {clinicName}
          </Text>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ 
        marginTop: '16px',
        padding: '12px', 
        backgroundColor: '#e6f7ff', 
        border: '1px solid #91d5ff', 
        borderRadius: '6px' 
      }}>
        <Text strong style={{ display: 'block', marginBottom: '8px' }}>
          📱 วิธีการชำระเงิน:
        </Text>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
          <li>เปิดแอปธนาคารหรือแอป PromptPay</li>
          <li>เลือก "สแกน QR" หรือ "โอนเงิน"</li>
          <li>สแกน QR Code หรือใส่หมายเลขพร้อมเพย์</li>
          <li>ระบุจำนวนเงินและยืนยันการโอน</li>
          <li>เก็บหลักฐานการโอนเงิน</li>
        </ul>
      </div>

      {/* Verification Field */}
      <Form.Item
        label="หมายเลขอ้างอิงการโอนเงิน (ถ้ามี)"
        name="transactionRef"
        style={{ marginTop: '16px' }}
      >
        <Input placeholder="เช่น TXN123456789" />
      </Form.Item>
    </Card>
  );
};

export default OnlinePayment;
