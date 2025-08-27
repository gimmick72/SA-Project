import { FormInstance } from "antd";
import { PaymentMethod, PaymentError } from "./PaymentTypes";

// Common component props
export interface BasePaymentProps {
  form: FormInstance;
}

// Cash payment component props
export interface CashPaymentProps extends BasePaymentProps {}

// Online payment component props
export interface OnlinePaymentProps extends BasePaymentProps {}

// Credit card payment component props
export interface CreditCardPaymentProps extends BasePaymentProps {}

// Payment success component props
export interface PaymentSuccessProps {
  paymentMethod: PaymentMethod;
  amount: number;
  transactionId?: string;
}

// Payment error component props
export interface PaymentErrorProps {
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}
