import React from "react";
import { Card, Form, Input, Space, Typography } from "antd";
import { CreditCardPaymentProps } from "../types";

const { Text } = Typography;

const CreditCardPayment: React.FC<CreditCardPaymentProps> = ({ form }) => {
  return (
    <Card title="รายละเอียดบัตรเครดิต" size="small" style={{ marginBottom: '16px' }}>
      <Form.Item
        label="หมายเลขบัตร"
        name="cardNumber"
        rules={[
          { required: true, message: 'กรุณาระบุหมายเลขบัตร' },
          { pattern: /^[0-9]{16}$/, message: 'หมายเลขบัตรต้องเป็นตัวเลข 16 หลัก' }
        ]}
      >
        <Input placeholder="1234 5678 9012 3456" maxLength={16} />
      </Form.Item>
      
      <Form.Item
        label="ชื่อผู้ถือบัตร"
        name="cardHolder"
        rules={[{ required: true, message: 'กรุณาระบุชื่อผู้ถือบัตร' }]}
      >
        <Input placeholder="JOHN DOE" style={{ textTransform: 'uppercase' }} />
      </Form.Item>
      
      <Space.Compact style={{ width: '100%' }}>
        <Form.Item
          label="วันหมดอายุ"
          name="expiryDate"
          style={{ width: '50%' }}
          rules={[
            { required: true, message: 'กรุณาระบุวันหมดอายุ' },
            { pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/, message: 'รูปแบบ: MM/YY' }
          ]}
        >
          <Input placeholder="MM/YY" maxLength={5} />
        </Form.Item>
        
        <Form.Item
          label="CVV"
          name="cvv"
          style={{ width: '50%' }}
          rules={[
            { required: true, message: 'กรุณาระบุ CVV' },
            { pattern: /^[0-9]{3,4}$/, message: 'CVV ต้องเป็นตัวเลข 3-4 หลัก' }
          ]}
        >
          <Input placeholder="123" maxLength={4} />
        </Form.Item>
      </Space.Compact>
      
      <div style={{ padding: '12px', backgroundColor: '#fff2e8', border: '1px solid #ffcc99', borderRadius: '6px' }}>
        <Text type="secondary">
          🔒 ข้อมูลบัตรของคุณจะถูกเข้ารหัสและปลอดภัย
        </Text>
      </div>
    </Card>
  );
};

export default CreditCardPayment;
