import React from "react";

// Base payment form data interface
export interface PaymentFormData {
  paymentMethod: PaymentMethod;
  amount: number;
  reference?: string;
  // Cash payment
  receivedAmount?: number;
  cashReceived?: number;
  // Credit Card payment
  cardNumber?: string;
  cardHolder?: string;
  cardType?: string;
  expiryDate?: string;
  cvv?: string;
  // PromptPay payment
  phoneNumber?: string;
  // Transaction data
  transactionId?: string;
  timestamp?: string;
  change?: number;
}

// Cash payment specific interface
export interface CashPaymentData {
  amount: number;
  receivedAmount: number;
  change?: number;
}

// Credit card payment specific interface
export interface CreditCardData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

// Online payment specific interface
export interface OnlinePaymentData {
  phoneNumber: string;
  qrCode?: string;
}

// Payment status types
export type PaymentStatus = 'form' | 'success' | 'error';

// Payment method types
export type PaymentMethod = 'cash' | 'promptpay' | 'credit_card';

// Error information interface
export interface PaymentError {
  message: string;
  code: string;
  timestamp?: Date;
}

// Transaction result interface
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  timestamp: Date;
  error?: PaymentError;
}
