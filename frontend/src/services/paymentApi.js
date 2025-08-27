var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
// API base URL - adjust based on your backend port
const API_BASE_URL = 'http://localhost:8080/api';
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
    processPayment: (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const response = yield apiClient.post('/payments', paymentData);
            return response.data;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Payment processing failed');
            }
            throw new Error('Network error occurred');
        }
    }),
    // Get transaction by ID
    getTransaction: (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const response = yield apiClient.get(`/payments/${transactionId}`);
            return response.data.transaction;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Failed to fetch transaction');
            }
            throw new Error('Network error occurred');
        }
    }),
    // List transactions with pagination
    listTransactions: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
        var _a, _b;
        try {
            const response = yield apiClient.get('/payments', {
                params: { page, limit }
            });
            return response.data;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Failed to fetch transactions');
            }
            throw new Error('Network error occurred');
        }
    }),
    // Update transaction status (for PromptPay confirmations)
    updateTransactionStatus: (transactionId, status, reference) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const response = yield apiClient.put(`/payments/${transactionId}/status`, {
                status,
                reference
            });
            return response.data.transaction;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Failed to update transaction status');
            }
            throw new Error('Network error occurred');
        }
    })
};
// Health check function
export const healthCheck = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
        return response.data.ok === true;
    }
    catch (error) {
        return false;
    }
});
