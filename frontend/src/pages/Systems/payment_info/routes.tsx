import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Form } from 'antd';
import ModernPaymentLayout from './components/ModernPaymentLayout';
import TreatmentPaymentFlow from './components/TreatmentPaymentFlow';
import TransactionRecords from './components/TransactionRecords';

const PaymentRoutes: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <Routes>
      <Route path="/*" element={<ModernPaymentLayout />}>
        {/* Default to treatment payment flow */}
        <Route index element={<TreatmentPaymentFlow />} />
        
        {/* Add payment form */}
        <Route path="add" element={<TreatmentPaymentFlow />} />
        
        {/* Transaction history */}
        <Route path="transactions" element={<TransactionRecords />} />
        
        {/* Redirect unknown routes to main page */}
        <Route path="*" element={<Navigate to="/admin/payment" replace />} />
      </Route>
    </Routes>
  );
};

export default PaymentRoutes;
