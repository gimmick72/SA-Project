import React from "react";
import { Card, Form, Input, Typography } from "antd";
import { CashPaymentProps } from "../types";
import "./CashPayment.css";

const { Text } = Typography;

const CashPayment: React.FC<CashPaymentProps> = ({ form }) => {
  return (
    <Card title="รายละเอียดการชำระด้วยเงินสด" size="small" className="cash-payment-card">
      <Form.Item
        label="จำนวนเงินที่รับมา"
        name="receivedAmount"
        rules={[
          { required: true, message: 'กรุณาระบุจำนวนเงินที่รับมา' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              const amount = getFieldValue('amount');
              if (!value || value >= amount) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('จำนวนเงินที่รับมาต้องมากกว่าหรือเท่ากับยอดที่ต้องชำระ'));
            },
          }),
        ]}
      >
        <Input type="number" prefix="฿" placeholder="0.00" />
      </Form.Item>
      
      <Form.Item dependencies={['amount', 'receivedAmount']}>
        {({ getFieldValue }) => {
          const amount = getFieldValue('amount') || 0;
          const received = getFieldValue('receivedAmount') || 0;
          const change = received - amount;
          
          return change > 0 ? (
            <div className="change-display">
              <Text strong className="change-amount">
                เงินทอน: ฿{change.toFixed(2)}
              </Text>
            </div>
          ) : null;
        }}
      </Form.Item>
    </Card>
  );
};

export default CashPayment;
