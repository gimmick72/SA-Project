import React, { useState } from 'react';
import { Table, Card, Row, Col, DatePicker, Select, Input, Button, Space, Tag, Statistic, Modal, Typography } from 'antd';
import { SearchOutlined, EyeOutlined, DollarOutlined, CreditCardOutlined, MobileOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
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
  paymentMethod: 'cash' | 'promptpay' | 'credit_card';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  receiptNumber?: string;
  treatments: string[];
  staff: string;
  notes?: string;
}

const TransactionRecords: React.FC = () => {
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      transactionId: 'TXN2025010001',
      customerName: 'นายสมชาย ใจดี',
      customerPhone: '081-234-5678',
      date: '2025-01-09',
      time: '14:30',
      amount: 2000,
      paymentMethod: 'cash',
      status: 'completed',
      receiptNumber: 'RCP2025010001',
      treatments: ['ขูดหินปูน', 'อุดฟัน'],
      staff: 'ทพ.สมหญิง จันทร์เพ็ญ',
      notes: 'ชำระเงินสดครบถ้วน'
    },
    {
      id: '2',
      transactionId: 'TXN2025010002',
      customerName: 'นางสาวสมหญิง รักสะอาด',
      customerPhone: '082-345-6789',
      date: '2025-01-08',
      time: '16:15',
      amount: 8000,
      paymentMethod: 'promptpay',
      status: 'completed',
      receiptNumber: 'RCP2025010002',
      treatments: ['ฟอกสีฟัน'],
      staff: 'ทพ.สมชาย ยิ้มแย้ม',
      notes: 'โอนเงินผ่านพร้อมเพย์'
    },
    {
      id: '3',
      transactionId: 'TXN2025010003',
      customerName: 'นายวิชัย มั่งคั่ง',
      customerPhone: '083-456-7890',
      date: '2025-01-07',
      time: '10:45',
      amount: 25000,
      paymentMethod: 'credit_card',
      status: 'completed',
      receiptNumber: 'RCP2025010003',
      treatments: ['จัดฟัน'],
      staff: 'ทพ.สมหญิง จันทร์เพ็ญ',
      notes: 'ชำระด้วยบัตรเครดิต Visa'
    },
    {
      id: '4',
      transactionId: 'TXN2025010004',
      customerName: 'นางสาววิภา สวยงาม',
      customerPhone: '084-567-8901',
      date: '2025-01-06',
      time: '13:20',
      amount: 1500,
      paymentMethod: 'promptpay',
      status: 'failed',
      treatments: ['ถอนฟัน'],
      staff: 'ทพ.สมชาย ยิ้มแย้ม',
      notes: 'การโอนเงินไม่สำเร็จ'
    }
  ]);

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

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

  // Calculate statistics
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;
  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const todayTransactions = transactions.filter(t => t.date === dayjs().format('YYYY-MM-DD')).length;

  const columns = [
    {
      title: 'รหัสรายการ',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 130,
    },
    {
      title: 'ลูกค้า',
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
    },
    {
      title: 'จัดการ',
      key: 'actions',
      width: 80,
      render: (_: any, record: Transaction) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
          size="small"
          title="ดูรายละเอียด"
        />
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
              <Col span={6}>
                <Input placeholder="รหัสรายการ" prefix={<SearchOutlined />} />
              </Col>
              <Col span={6}>
                <Input placeholder="ชื่อลูกค้า" />
              </Col>
              <Col span={6}>
                <RangePicker placeholder={['วันที่เริ่ม', 'วันที่สิ้นสุด']} className="date-range-picker" />
              </Col>
              <Col span={3}>
                <Select placeholder="วิธีชำระ" className="payment-method-select" allowClear>
                  <Option value="cash">เงินสด</Option>
                  <Option value="promptpay">พร้อมเพย์</Option>
                  <Option value="credit_card">บัตรเครดิต</Option>
                </Select>
              </Col>
              <Col span={3}>
                <Button type="primary" icon={<SearchOutlined />} className="search-button">
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
              dataSource={transactions}
              rowKey="id"
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
