import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Button, Input, Select, DatePicker, Typography, message, Row, Col, Statistic, Modal } from 'antd';
import { SearchOutlined, EyeOutlined, PrinterOutlined, DownloadOutlined, DollarOutlined, MobileOutlined, CreditCardOutlined, FileTextOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { paymentAPI, Payment } from '../../../../services/api';
import './TransactionRecords.css';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

interface Transaction {
  id: string;
  transactionId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  amount: number;
  paymentMethod: 'cash' | 'promptpay' | 'credit_card' | 'bank_transfer';
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  receiptNumber?: string;
  treatments: string[];
  staff: string;
  notes?: string;
}

const TransactionRecords: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // Load transactions from backend
  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await paymentAPI.getPayments({ page: 1, page_size: 100 });
      setPayments(response.data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      message.error('ไม่สามารถโหลดข้อมูลการทำรายการได้');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Convert Payment to Transaction format for display
  const convertToTransaction = (payment: Payment): Transaction => ({
    id: payment.id.toString(),
    transactionId: payment.transaction_number,
    customerName: 'ไม่ระบุ', // Will be populated from patient data
    customerPhone: 'ไม่ระบุ', // Will be populated from patient data
    date: payment.payment_date.split('T')[0],
    time: payment.payment_date.split('T')[1]?.slice(0, 5) || '00:00',
    amount: payment.amount,
    paymentMethod: payment.payment_method as 'cash' | 'promptpay' | 'credit_card' | 'bank_transfer',
    status: payment.status === 'cancelled' ? 'cancelled' : payment.status as 'completed' | 'pending' | 'failed',
    receiptNumber: `RCP${payment.id}`,
    treatments: ['การรักษา'], // Default since we don't have treatment details
    staff: 'ไม่ระบุ', // Will be populated from staff data
    notes: payment.description || ''
  });

  // Convert payments to transactions for display
  const transactions = payments.map(convertToTransaction);

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return <DollarOutlined className="payment-method-cash" />;
      case 'promptpay': return <MobileOutlined className="payment-method-promptpay" />;
      case 'credit_card': return <CreditCardOutlined className="payment-method-credit-card" />;
      default: return null;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash': return 'เงินสด';
      case 'promptpay': return 'พร้อมเพย์';
      case 'credit_card': return 'บัตรเครดิต';
      default: return method;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'processing';
      case 'failed': return 'error';
      case 'refunded': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'สำเร็จ';
      case 'pending': return 'รอดำเนินการ';
      case 'failed': return 'ไม่สำเร็จ';
      case 'refunded': return 'คืนเงิน';
      default: return status;
    }
  };

  const handleViewDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailVisible(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    Modal.confirm({
      title: 'ยืนยันการลบ',
      icon: <ExclamationCircleOutlined />,
      content: 'คุณแน่ใจหรือไม่ที่จะลบรายการชำระเงินนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้',
      okText: 'ลบ',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk: async () => {
        try {
          await paymentAPI.deletePayment(transactionId);
          message.success('ลบรายการชำระเงินเรียบร้อยแล้ว');
          loadTransactions(); // Reload the list
        } catch (error) {
          console.error('Error deleting payment:', error);
          message.error('ไม่สามารถลบรายการชำระเงินได้');
        }
      },
    });
  };

  // Filter transactions based on search criteria
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchText || 
      transaction.transactionId.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.customerName.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || transaction.paymentMethod === paymentMethodFilter;
    
    const matchesDateRange = !dateRange || (
      dayjs(transaction.date).isAfter(dateRange[0].subtract(1, 'day')) &&
      dayjs(transaction.date).isBefore(dateRange[1].add(1, 'day'))
    );
    
    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDateRange;
  });

  const handleSearch = () => {
    // Trigger re-render with current filters
    console.log('Searching with filters:', { searchText, statusFilter, paymentMethodFilter, dateRange });
  };

  const handleReset = () => {
    setSearchText('');
    setStatusFilter('all');
    setPaymentMethodFilter('all');
    setDateRange(null);
  };

  // Calculate statistics from filtered transactions
  const totalTransactions = filteredTransactions.length;
  const completedTransactions = filteredTransactions.filter(t => t.status === 'completed').length;
  const totalRevenue = filteredTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const todayTransactions = filteredTransactions.filter(t => t.date === dayjs().format('YYYY-MM-DD')).length;

  const columns = [
    {
      title: 'รหัสรายการ',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 130,
    },
    {
      title: 'ผู้ป่วย',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: 'วันที่/เวลา',
      key: 'datetime',
      width: 130,
      render: (_: any, record: Transaction) => (
        <div>
          <div>{dayjs(record.date).format('DD/MM/YYYY')}</div>
          <Text type="secondary" className="transaction-time">{record.time}</Text>
        </div>
      ),
    },
    {
      title: 'จำนวนเงิน',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => `฿${amount.toLocaleString()}`,
    },
    {
      title: 'วิธีชำระ',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 120,
      render: (method: string) => (
        <Space>
          {getPaymentMethodIcon(method)}
          {getPaymentMethodText(method)}
        </Space>
      ),
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'เลขที่ใบเสร็จ',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      width: 130,
      render: (receiptNumber: string) => receiptNumber || '-',
    },
    {
      title: 'เจ้าหน้าที่',
      dataIndex: 'staff',
      key: 'staff',
      width: 150,
      render: (staff: string) => staff || 'Admin',
    },
    {
      title: 'จัดการ',
      key: 'actions',
      width: 120,
      render: (_: any, record: Transaction) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            size="small"
            title="ดูรายละเอียด"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTransaction(record.transactionId)}
            size="small"
            title="ลบรายการ"
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="transaction-records-container">
      <Row gutter={[24, 24]}>
        {/* Statistics Cards */}
        <Col span={6}>
          <Card>
            <Statistic
              title="รายการทั้งหมด"
              value={totalTransactions}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="สำเร็จแล้ว"
              value={completedTransactions}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="รายได้รวม"
              value={totalRevenue}
              precision={0}
              prefix="฿"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="วันนี้"
              value={todayTransactions}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        {/* Search and Filter */}
        <Col span={24}>
          <Card title="ค้นหาและกรองข้อมูล" size="small">
            <Row gutter={16}>
              <Col span={5}>
                <Input 
                  placeholder="รหัสรายการ/ชื่อผู้ป่วย" 
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
              <Col span={5}>
                <Select 
                  placeholder="สถานะ" 
                  value={statusFilter}
                  onChange={setStatusFilter}
                  allowClear
                >
                  <Option value="all">ทั้งหมด</Option>
                  <Option value="completed">สำเร็จ</Option>
                  <Option value="pending">รอดำเนินการ</Option>
                  <Option value="failed">ไม่สำเร็จ</Option>
                  <Option value="cancelled">ยกเลิก</Option>
                </Select>
              </Col>
              <Col span={5}>
                <Select 
                  placeholder="วิธีชำระ" 
                  value={paymentMethodFilter}
                  onChange={setPaymentMethodFilter}
                  allowClear
                >
                  <Option value="all">ทั้งหมด</Option>
                  <Option value="cash">เงินสด</Option>
                  <Option value="promptpay">พร้อมเพย์</Option>
                  <Option value="credit_card">บัตรเครดิต</Option>
                  <Option value="bank_transfer">โอนธนาคาร</Option>
                </Select>
              </Col>
              <Col span={6}>
                <RangePicker 
                  placeholder={['วันที่เริ่ม', 'วันที่สิ้นสุด']} 
                  value={dateRange}
                  onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                  className="date-range-picker" 
                />
              </Col>
              <Col span={3}>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  ค้นหา
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Transaction Table */}
        <Col span={24}>
          <Card title="บันทึกการทำรายการ" size="small">
            <Table
              columns={columns}
              dataSource={filteredTransactions}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ`,
              }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Transaction Detail Modal */}
      <Modal
        title="รายละเอียดการทำรายการ"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            ปิด
          </Button>,
        ]}
        width={600}
      >
        {selectedTransaction && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>รหัสรายการ: </Text>
                <Text>{selectedTransaction.transactionId}</Text>
              </Col>
              <Col span={12}>
                <Text strong>วันที่/เวลา: </Text>
                <Text>{dayjs(selectedTransaction.date).format('DD/MM/YYYY')} {selectedTransaction.time}</Text>
              </Col>
              <Col span={12}>
                <Text strong>ลูกค้า: </Text>
                <Text>{selectedTransaction.customerName}</Text>
              </Col>
              <Col span={12}>
                <Text strong>เบอร์โทร: </Text>
                <Text>{selectedTransaction.customerPhone}</Text>
              </Col>
              <Col span={12}>
                <Text strong>จำนวนเงิน: </Text>
                <Text className="transaction-amount">
                  ฿{selectedTransaction.amount.toLocaleString()}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>วิธีชำระ: </Text>
                <Space>
                  {getPaymentMethodIcon(selectedTransaction.paymentMethod)}
                  {getPaymentMethodText(selectedTransaction.paymentMethod)}
                </Space>
              </Col>
              <Col span={12}>
                <Text strong>สถานะ: </Text>
                <Tag color={getStatusColor(selectedTransaction.status)}>
                  {getStatusText(selectedTransaction.status)}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>เลขที่ใบเสร็จ: </Text>
                <Text>{selectedTransaction.receiptNumber || '-'}</Text>
              </Col>
              <Col span={24}>
                <Text strong>รายการรักษา: </Text>
                <div className="treatment-list">
                  {selectedTransaction.treatments.map((treatment, index) => (
                    <Tag key={index} className="treatment-tag">
                      {treatment}
                    </Tag>
                  ))}
                </div>
              </Col>
              <Col span={24}>
                <Text strong>เจ้าหน้าที่: </Text>
                <Text>{selectedTransaction.staff}</Text>
              </Col>
              {selectedTransaction.notes && (
                <Col span={24}>
                  <Text strong>หมายเหตุ: </Text>
                  <Text>{selectedTransaction.notes}</Text>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TransactionRecords;
