import React, { useState } from 'react';
import { Form, Card, Typography, Button, Radio, message, Input, Divider, Space } from 'antd';
import { DollarOutlined, MobileOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CashPayment from './components/CashPayment';
import OnlinePayment from './components/OnlinePayment';
import CreditCardPayment from './components/CreditCardPayment';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentError from './components/PaymentError';
import { PaymentFormData, PaymentMethod, PaymentStatus, PaymentResult } from './types';
import { paymentApi, PaymentRequest } from '../../../services/paymentApi';

const { Title, Text } = Typography;

const PaymentInfoPage = () => {
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('form');
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);
  const [errorInfo, setErrorInfo] = useState<{message: string, code: string} | null>(null);

  const onFinish = async (values: PaymentFormData) => {
    setLoading(true);
    try {
      // Prepare payment request based on payment method
      const paymentRequest: PaymentRequest = {
        amount: values.amount,
        paymentMethod: values.paymentMethod,
        reference: values.reference,
      };

      // Add method-specific data
      if (values.paymentMethod === 'cash') {
        paymentRequest.cashReceived = values.cashReceived || values.amount;
      } else if (values.paymentMethod === 'credit_card') {
        paymentRequest.cardNumber = values.cardNumber;
        paymentRequest.cardType = values.cardType;
        paymentRequest.expiryDate = values.expiryDate;
        paymentRequest.cvv = values.cvv;
      }

      // Process payment through API
      const response = await paymentApi.processPayment(paymentRequest);
      
      if (response.status === 'completed' || response.status === 'pending') {
        setPaymentStatus('success');
        setPaymentData({
          ...values,
          transactionId: response.transactionId,
          timestamp: response.timestamp,
          change: response.change,
        });
        message.success(response.message);
      } else {
        throw new Error(response.message || 'Payment failed');
      }
    } catch (error) {
      setErrorInfo({
        message: "เกิดข้อผิดพลาดในระบบ กรุณาติดต่อเจ้าหน้าที่",
        code: "ERR_SYSTEM_ERROR"
      });
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setPaymentStatus('form');
    setErrorInfo(null);
    setPaymentData(null);
  };

  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method) {
      case 'cash': return 'เงินสด';
      case 'promptpay': return 'พร้อมเพย์';
      case 'credit_card': return 'บัตรเครดิต';
      default: return method;
    }
  };

  // Show success page
  if (paymentStatus === 'success' && paymentData) {
    return (
      <PaymentSuccess
        paymentMethod={paymentData.paymentMethod as PaymentMethod}
        amount={paymentData.amount}
      />
    );
  }

  // Show error page
  if (paymentStatus === 'error' && errorInfo) {
    return (
      <PaymentError
        errorMessage={errorInfo.message}
        errorCode={errorInfo.code}
        onRetry={handleRetry}
      />
    );
  }

  // Show payment form
  return (
    <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column',border: "1px solid #6ddfdb", }}>
      <Title level={2} style={{ fontWeight: 'bold', marginBottom: '20px', marginTop: '0px' }}>ชำระเงิน</Title>
      
      <Card style={{ backgroundColor: '##FFF', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto',overflowX: 'auto',border: "1px solid #6ddfdb"}}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ paymentMethod: 'cash', amount: 0 }}
        >
          {/* Amount Section */}
          <Form.Item
            label="จำนวนเงินที่ต้องชำระ"
            name="amount"
            rules={[
              { required: true, message: 'กรุณาระบุจำนวนเงิน' },
              { type: 'number', min: 1, message: 'จำนวนเงินต้องมากกว่า 0' }
            ]}
          >
            <Input
              type="number"
              prefix="฿"
              placeholder="0.00"
              size="large"
              style={{ fontSize: '18px', fontWeight: 'bold' }}
            />
          </Form.Item>

          <Divider />

          {/* Payment Method Selection */}
          <Form.Item
            label="เลือกวิธีการชำระเงิน"
            name="paymentMethod"
            rules={[{ required: true, message: 'กรุณาเลือกวิธีการชำระเงิน' }]}
          >
            <Radio.Group 
              onChange={(e) => setPaymentMethod(e.target.value)}
              size="large"
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value="cash" style={{ padding: '12px', border: '1px solid #d9d9d9', borderRadius: '8px', width: '100%' }}>
                  <Space>
                    <DollarOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                    <div>
                      <Text strong>เงินสด (Cash)</Text>
                      <br />
                      <Text type="secondary">ชำระด้วยเงินสดโดยตรง</Text>
                    </div>
                  </Space>
                </Radio>
                
                <Radio value="promptpay" style={{ padding: '12px', border: '1px solid #d9d9d9', borderRadius: '8px', width: '100%' }}>
                  <Space>
                    <MobileOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                    <div>
                      <Text strong>พร้อมเพย์ (PromptPay)</Text>
                      <br />
                      <Text type="secondary">ชำระผ่านระบบพร้อมเพย์</Text>
                    </div>
                  </Space>
                </Radio>
                
                <Radio value="credit_card" style={{ padding: '12px', border: '1px solid #d9d9d9', borderRadius: '8px', width: '100%' }}>
                  <Space>
                    <CreditCardOutlined style={{ fontSize: '20px', color: '#722ed1' }} />
                    <div>
                      <Text strong>บัตรเครดิต (Credit Card)</Text>
                      <br />
                      <Text type="secondary">VISA, MasterCard, และอื่นๆ</Text>
                    </div>
                  </Space>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {/* Payment Method Details */}
          {paymentMethod === 'cash' && <CashPayment form={form} />}
          {paymentMethod === 'promptpay' && <OnlinePayment form={form} />}
          {paymentMethod === 'credit_card' && <CreditCardPayment form={form} />}

          {/* Submit Button */}
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              style={{ width: '100%', height: '50px', fontSize: '18px' }}
            >
              {loading ? 'กำลังดำเนินการ...' : `ชำระเงินด้วย${getPaymentMethodName(paymentMethod)}`}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PaymentInfoPage;
