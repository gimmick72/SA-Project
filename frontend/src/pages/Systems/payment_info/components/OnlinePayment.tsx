import React, { useState, useEffect } from "react";
import { Form, Input } from "antd";
import { OnlinePaymentProps } from "../types";
import PromptPayQR from "../../../../components/PromptPayQR";
import "./OnlinePayment.css";

const OnlinePayment: React.FC<OnlinePaymentProps> = ({ form }) => {
  const [amount, setAmount] = useState<number>(0);
  
  // PromptPay ID for clinic
  const promptPayId = "1399900130681"; // Clinic's PromptPay ID
  const clinicName = "คลินิกทันตกรรม ABC";

  // Watch for form field changes
  useEffect(() => {
    const updateAmount = () => {
      const formAmount = form.getFieldValue('amount');
      if (formAmount && formAmount > 0) {
        setAmount(formAmount);
      } else {
        setAmount(0);
      }
    };
    
    // Initial amount check
    updateAmount();

    // Set up form field listener using Form.useWatch would be better, 
    // but we'll use a simple interval to check for changes
    const interval = setInterval(updateAmount, 500);

    return () => {
      clearInterval(interval);
    };
  }, [form]);

  return (
    <div>
      {/* Dynamic PromptPay QR Component */}
      <PromptPayQR
        phoneNumber={promptPayId}
        amount={amount > 0 ? amount : undefined}
        clinicName={clinicName}
      />

      {/* Phone Number Field (hidden, for form validation) */}
      <Form.Item
        name="phoneNumber"
        hidden
        initialValue={promptPayId}
      >
        <Input />
      </Form.Item>

      {/* Verification Field */}
      <Form.Item
        label="หมายเลขอ้างอิงการโอนเงิน (ถ้ามี)"
        name="transactionRef"
        className="transaction-ref-field"
      >
        <Input placeholder="เช่น TXN123456789" />
      </Form.Item>
    </div>
  );
};

export default OnlinePayment;
