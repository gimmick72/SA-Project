import React, { useState } from 'react';
import { Form, Card, Typography, Button, Radio, message, Input, Divider, Space, Tabs } from 'antd';
import { DollarOutlined, MobileOutlined, CreditCardOutlined, FileTextOutlined, FileDoneOutlined, HistoryOutlined, FormOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CashPayment from './components/CashPayment';
import OnlinePayment from './components/OnlinePayment';
import CreditCardPayment from './components/CreditCardPayment';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentError from './components/PaymentError';
import TreatmentEntry from './components/TreatmentEntry';
import ReceiptSystem from './components/ReceiptSystem';
import TransactionRecords from './components/TransactionRecords';
import { PaymentFormData, PaymentMethod, PaymentStatus, PaymentResult } from './types';
import { paymentApi, PaymentRequest } from '../../../services/paymentApi';
import './index.css';

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
      } else if (values.paymentMethod === 'promptpay') {
        paymentRequest.phoneNumber = values.phoneNumber;
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

  // Payment form component
  const PaymentForm = () => (
    <div className="payment-form-container">
      <Card className="payment-card">
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
              type="text"
              prefix="฿"
              placeholder="0"
              size="large"
              className="amount-input"
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '');
                const formatted = value ? parseInt(value).toLocaleString() : '';
                e.target.value = formatted;
              }}
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
              <Space direction="vertical" className="payment-methods-space">
                <Radio value="cash" className="payment-method-radio">
                  <Space>
                    <DollarOutlined className="cash-icon" />
                    <span>เงินสด</span>
                  </Space>
                </Radio>
                <Radio value="promptpay" className="payment-method-radio">
                  <Space>
                    <MobileOutlined className="promptpay-icon" />
                    <span>พร้อมเพย์ (PromptPay)</span>
                  </Space>
                </Radio>
                <Radio value="credit_card" className="payment-method-radio">
                  <Space>
                    <CreditCardOutlined className="credit-card-icon" />
                    <span>บัตรเครดิต</span>
                  </Space>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {/* Conditional Payment Details */}
          {paymentMethod === 'cash' && (
            <Form.Item
              label="จำนวนเงินที่รับ"
              name="cashReceived"
              rules={[
                { required: true, message: 'กรุณาระบุจำนวนเงินที่รับ' },
                { type: 'number', min: 0, message: 'จำนวนเงินต้องไม่น้อยกว่า 0' }
              ]}
            >
              <Input
                type="text"
                prefix="฿"
                placeholder="0"
                size="large"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  const formatted = value ? parseInt(value).toLocaleString() : '';
                  e.target.value = formatted;
                }}
              />
            </Form.Item>
          )}

          {paymentMethod === 'promptpay' && (
            <OnlinePayment form={form} />
          )}

          {paymentMethod === 'credit_card' && (
            <>
              <Form.Item
                label="หมายเลขบัตร"
                name="cardNumber"
                rules={[{ required: true, message: 'กรุณาระบุหมายเลขบัตร' }]}
              >
                <Input placeholder="1234 5678 9012 3456" maxLength={19} />
              </Form.Item>
              
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item
                  label="วันหมดอายุ"
                  name="expiryDate"
                  style={{ width: '50%' }}
                  rules={[{ required: true, message: 'กรุณาระบุวันหมดอายุ' }]}
                >
                  <Input placeholder="MM/YY" maxLength={5} />
                </Form.Item>
                <Form.Item
                  label="CVV"
                  name="cvv"
                  style={{ width: '50%' }}
                  rules={[{ required: true, message: 'กรุณาระบุ CVV' }]}
                >
                  <Input placeholder="123" maxLength={4} />
                </Form.Item>
              </Space.Compact>
            </>
          )}

          <Form.Item
            label="หมายเหตุ (ไม่บังคับ)"
            name="reference"
          >
            <Input.TextArea 
              placeholder="หมายเหตุเพิ่มเติม..."
              rows={3}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              className="submit-button"
            >
              {loading ? 'กำลังดำเนินการ...' : `ชำระเงินด้วย${getPaymentMethodName(paymentMethod)}`}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );

  // Main component with tabs
  return (
    <div className="payment-container">
      <div className="page-header">
        <Title level={2}>ระบบชำระเงิน</Title>
      </div>
      
      <div className="payment-tabs">
        <Tabs
          defaultActiveKey="payment"
          items={[
            {
              key: 'payment',
              label: (
                <span>
                  <DollarOutlined />
                  ชำระเงิน
                </span>
              ),
              children: <PaymentForm />,
            },
            {
              key: 'treatment',
              label: (
                <span>
                  <FormOutlined />
                  กรอกรายการรักษา
                </span>
              ),
              children: <TreatmentEntry />,
            },
            {
              key: 'receipt',
              label: (
                <span>
                  <FileDoneOutlined />
                  ทำระบบใบเสร็จ
                </span>
              ),
              children: <ReceiptSystem />,
            },
            {
              key: 'records',
              label: (
                <span>
                  <HistoryOutlined />
                  บันทึกการทำรายการ
                </span>
              ),
              children: <TransactionRecords />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default PaymentInfoPage;
