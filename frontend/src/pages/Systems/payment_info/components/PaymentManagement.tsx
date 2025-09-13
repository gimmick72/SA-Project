import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  DatePicker, 
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  DollarOutlined,
  CreditCardOutlined,
  MobileOutlined,
  BankOutlined
} from '@ant-design/icons';
import { paymentAPI, Payment } from '../../../../services/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load payments
  const loadPayments = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await paymentAPI.getPayments({
        page,
        page_size: pageSize,
      });
      setPayments(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.pagination?.total || 0,
      });
    } catch (error) {
      message.error('Failed to load payments');
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // Handle create/update payment
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingPayment) {
        await paymentAPI.updatePayment(editingPayment.id, values);
        message.success('Payment updated successfully');
      } else {
        await paymentAPI.createPayment({
          ...values,
          patient_id: 1, // Default patient ID
          staff_id: 1,   // Default staff ID
          service_id: 1, // Default service ID
        });
        message.success('Payment created successfully');
      }
      setModalVisible(false);
      setEditingPayment(null);
      form.resetFields();
      loadPayments();
    } catch (error) {
      message.error(editingPayment ? 'Failed to update payment' : 'Failed to create payment');
      console.error('Error saving payment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete payment
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await paymentAPI.deletePayment(id);
      message.success('Payment deleted successfully');
      loadPayments();
    } catch (error) {
      message.error('Failed to delete payment');
      console.error('Error deleting payment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for create/edit
  const openModal = (payment?: Payment) => {
    if (payment) {
      setEditingPayment(payment);
      form.setFieldsValue({
        ...payment,
        payment_date: payment.payment_date ? dayjs(payment.payment_date) : null,
      });
    } else {
      setEditingPayment(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <DollarOutlined />;
      case 'credit_card':
        return <CreditCardOutlined />;
      case 'promptpay':
        return <MobileOutlined />;
      case 'bank_transfer':
        return <BankOutlined />;
      default:
        return <DollarOutlined />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  // Calculate statistics
  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    totalAmount: payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
  };

  const columns = [
    {
      title: 'Transaction Number',
      dataIndex: 'transaction_number',
      key: 'transaction_number',
      render: (text: string) => <code>{text}</code>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `฿${amount.toLocaleString()}`,
      sorter: (a: Payment, b: Payment) => a.amount - b.amount,
    },
    {
      title: 'Payment Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method: string) => (
        <Space>
          {getPaymentMethodIcon(method)}
          {method.replace('_', ' ').toUpperCase()}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Service',
      dataIndex: 'service_name',
      key: 'service_name',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Staff',
      dataIndex: 'staff_name',
      key: 'staff_name',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Payment Date',
      dataIndex: 'payment_date',
      key: 'payment_date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a: Payment, b: Payment) => 
        dayjs(a.payment_date).unix() - dayjs(b.payment_date).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Payment) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              Modal.info({
                title: 'Payment Details',
                content: (
                  <div>
                    <p><strong>Transaction:</strong> {record.transaction_number}</p>
                    <p><strong>Amount:</strong> ฿{record.amount.toLocaleString()}</p>
                    <p><strong>Method:</strong> {record.payment_method}</p>
                    <p><strong>Status:</strong> {record.status}</p>
                    <p><strong>Description:</strong> {record.description}</p>
                    {record.receipt_number && (
                      <p><strong>Receipt:</strong> {record.receipt_number}</p>
                    )}
                  </div>
                ),
              });
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this payment?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Payments"
              value={stats.total}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed"
              value={stats.completed}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.totalAmount}
              prefix="฿"
              precision={2}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Title level={4}>Payment Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            Add Payment
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={payments}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} payments`,
            onChange: (page, pageSize) => {
              loadPayments(page, pageSize);
            },
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingPayment ? 'Edit Payment' : 'Create Payment'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingPayment(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="Amount"
                rules={[
                  { required: true, message: 'Please enter amount' },
                  { type: 'number', min: 0, message: 'Amount must be positive' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  prefix="฿"
                  placeholder="0.00"
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="payment_method"
                label="Payment Method"
                rules={[{ required: true, message: 'Please select payment method' }]}
              >
                <Select placeholder="Select payment method">
                  <Option value="cash">Cash</Option>
                  <Option value="credit_card">Credit Card</Option>
                  <Option value="promptpay">PromptPay</Option>
                  <Option value="bank_transfer">Bank Transfer</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="pending">Pending</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="failed">Failed</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="payment_date"
                label="Payment Date"
                rules={[{ required: true, message: 'Please select payment date' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  format="DD/MM/YYYY HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter payment description"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingPayment ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentManagement;
