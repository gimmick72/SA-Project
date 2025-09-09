import axios from 'axios';

// API base URL - adjust based on your backend port
const API_BASE_URL = 'http://localhost:8080/api';

// Payment request interface
export interface PaymentRequest {
  amount: number;
  paymentMethod: 'cash' | 'promptpay' | 'credit_card';
  reference?: string;
  
  // Cash payment specific
  cashReceived?: number;
  
  // Credit card specific
  cardNumber?: string;
  cardType?: string;
  expiryDate?: string;
  cvv?: string;
  
  // PromptPay specific
  phoneNumber?: string;
  
  // Optional patient ID
  patientId?: number;
}

// Payment response interface
export interface PaymentResponse {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  paymentMethod: string;
  timestamp: string;
  reference?: string;
  change?: number;
  message: string;
}

// Transaction interface
export interface Transaction {
  id: number;
  transactionId: string;
  timestamp: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Payment API functions
export const paymentApi = {
  // Process payment
  processPayment: async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    try {
      const response = await apiClient.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Payment processing failed');
      }
      throw new Error('Network error occurred');
    }
  },

  // Get transaction by ID
  getTransaction: async (transactionId: string): Promise<Transaction> => {
    try {
      const response = await apiClient.get(`/payments/${transactionId}`);
      return response.data.transaction;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to fetch transaction');
      }
      throw new Error('Network error occurred');
    }
  },

  // List transactions with pagination
  listTransactions: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await apiClient.get('/payments', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to fetch transactions');
      }
      throw new Error('Network error occurred');
    }
  },

  // Update transaction status (for PromptPay confirmations)
  updateTransactionStatus: async (
    transactionId: string, 
    status: 'completed' | 'failed' | 'cancelled',
    reference?: string
  ): Promise<Transaction> => {
    try {
      const response = await apiClient.put(`/payments/${transactionId}/status`, {
        status,
        reference
      });
      return response.data.transaction;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to update transaction status');
      }
      throw new Error('Network error occurred');
    }
  }
};

// Health check function
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.data.ok === true;
  } catch (error) {
    return false;
  }
};
