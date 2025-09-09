import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Form } from 'antd';
import PaymentLayout from './PaymentLayout';
import PaymentDashboard from './pages/PaymentDashboard';
import CashPayment from './components/CashPayment';
import OnlinePayment from './components/OnlinePayment';
import CreditCardPayment from './components/CreditCardPayment';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentError from './components/PaymentError';
import TreatmentEntry from './components/TreatmentEntry';
import ReceiptSystem from './components/ReceiptSystem';
import TransactionRecords from './components/TransactionRecords';

const PaymentRoutes: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <Routes>
      <Route path="/*" element={<PaymentLayout />}>
        {/* Main payment dashboard */}
        <Route index element={<PaymentDashboard />} />
        
        {/* Payment method routes */}
        <Route path="cash" element={<CashPayment form={form} />} />
        <Route path="online" element={<OnlinePayment form={form} />} />
        <Route path="credit-card" element={<CreditCardPayment form={form} />} />
        
        {/* Payment status routes */}
        <Route path="success" element={<PaymentSuccess paymentMethod="cash" amount={0} />} />
        <Route path="error" element={<PaymentError errorMessage="" errorCode="" onRetry={() => {}} />} />
        
        {/* Management routes */}
        <Route path="treatment-entry" element={<TreatmentEntry />} />
        <Route path="receipt" element={<ReceiptSystem />} />
        <Route path="transactions" element={<TransactionRecords />} />
        
        {/* Redirect unknown routes to main page */}
        <Route path="*" element={<Navigate to="/admin/payment" replace />} />
      </Route>
    </Routes>
  );
};

export default PaymentRoutes;
