import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Button, message } from 'antd';
import { QrcodeOutlined, CopyOutlined, ReloadOutlined, CheckOutlined } from '@ant-design/icons';
import promptpay from 'promptpay-qr';
import QRCode from 'qrcode';
import './PromptPayQR.css';

const { Text, Title } = Typography;

interface PromptPayQRProps {
  phoneNumber: string;
  amount?: number;
  clinicName?: string;
  onPaymentComplete?: () => void;
}

const PromptPayQR: React.FC<PromptPayQRProps> = ({
  phoneNumber,
  amount,
  clinicName = "คลินิกทันตกรรม ABC",
  onPaymentComplete
}) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [phoneNumber, amount]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      
      // Validate inputs
      if (!phoneNumber) {
        throw new Error('Phone number is required');
      }
      
      // Generate PromptPay payload
      console.log('Generating payload for:', phoneNumber, 'amount:', amount);
      const payload = promptpay(phoneNumber, amount ? { amount } : {});
      console.log('Generated payload:', payload);
      
      // Generate QR code from payload
      const qrCodeURL = await QRCode.toDataURL(payload, {
        width: 256,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeDataURL(qrCodeURL);
      console.log('QR Code generated successfully');
    } catch (error: any) {
      console.error('Error generating QR code:', error);
      message.error(`เกิดข้อผิดพลาดในการสร้าง QR Code: ${error?.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const copyPromptPayId = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      message.success('คัดลอกหมายเลขพร้อมเพย์แล้ว');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      message.error('ไม่สามารถคัดลอกได้');
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 10) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
  };

  return (
    <Card 
      title={
        <Space>
          <QrcodeOutlined />
          การชำระเงินด้วยพร้อมเพย์
        </Space>
      } 
      size="small" 
      className="promptpay-card"
    >
      {/* QR Code Section */}
      <div className="qr-section">
        {/* Bank Header */}
        <div className="bank-header">
          <Title level={4} className="bank-header-title">
            🏦 THAI QR PAYMENT
          </Title>
        </div>
        
        {/* QR Code Display */}
        <div className="qr-display">
          <QrcodeOutlined className="qr-icon" />
          <Text className="qr-text">
            PROMPTPAY QR CODE
          </Text>
        </div>

        {/* PromptPay Logo */}
        <div className="promptpay-logo">
          <div className="promptpay-logo-text">
            Prompt<span className="promptpay-logo-pay">Pay</span>
          </div>
        </div>

        {/* Dynamic QR Code */}
        <div className="qr-code-container">
          {loading ? (
            <div>กำลังสร้าง QR Code...</div>
          ) : qrCodeDataURL ? (
            <img 
              src={qrCodeDataURL} 
              alt="PromptPay QR Code" 
              className="qr-code-image"
            />
          ) : (
            <div>ไม่สามารถสร้าง QR Code ได้</div>
          )}
        </div>

        {/* Payment Details */}
        <div className="payment-details">
          <div className="payment-detail-row">
            <Text strong>PAY TO PROMPTPAY</Text>
            <Text>{formatPhoneNumber(phoneNumber)}</Text>
          </div>
          
          <div className="payment-detail-row">
            <Text strong>RECIPIENT</Text>
            <Text>{clinicName}</Text>
          </div>
          
          <div className="payment-divider" />
          
          <div className="amount-row">
            <Text strong>AMOUNT</Text>
            <Text className="amount-text">
              {amount ? `฿${amount.toLocaleString()}` : '___'}
            </Text>
          </div>
          
          {!amount && (
            <Text type="secondary" className="amount-note">
              * Payer to specify amount
            </Text>
          )}
        </div>

        {/* Footer */}
        <div className="footer-bar" />
      </div>

      {/* Manual Payment Option */}
      <div className="manual-payment">
        <Text strong>หรือโอนเงินด้วยตนเอง:</Text>
        <div className="manual-payment-box">
          <div className="manual-payment-content">
            <div>
              <Text strong>หมายเลขพร้อมเพย์:</Text>
              <br />
              <Text copyable={{ text: phoneNumber }}>{phoneNumber}</Text>
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
          {amount && (
            <div className="manual-payment-amount">
              <Text strong className="amount-highlight">
                จำนวนเงิน: ฿{amount.toLocaleString()}
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="instructions">
        <Text strong className="instructions-title">
          📱 วิธีการชำระเงิน:
        </Text>
        <ul className="instructions-list">
          <li>เปิดแอปธนาคารหรือแอป PromptPay</li>
          <li>เลือก "สแกน QR" หรือ "โอนเงิน"</li>
          <li>สแกน QR Code ด้านบน</li>
          <li>ตรวจสอบจำนวนเงินและยืนยันการโอน</li>
          <li>เก็บหลักฐานการโอนเงิน (สลิป)</li>
          <li>แจ้งเจ้าหน้าที่เมื่อโอนเงินเรียบร้อย</li>
        </ul>
      </div>

    </Card>
  );
};

export default PromptPayQR;
