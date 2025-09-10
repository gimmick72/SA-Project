import React, { useState } from 'react';
import { Form, Input, Button, Table, Card, Row, Col, DatePicker, Select, Space, Modal, Typography, Divider } from 'antd';
import { PrinterOutlined, EyeOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './ReceiptSystem.css';

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface Receipt {
  id: string;
  receiptNumber: string;
  customerName: string;
  customerPhone: string;
  issueDate: string;
  totalAmount: number;
  paymentMethod: string;
  status: 'issued' | 'cancelled' | 'refunded';
  items: ReceiptItem[];
}

interface ReceiptItem {
  treatmentCode: string;
  treatmentName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const ReceiptSystem: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([
    {
      id: '1',
      receiptNumber: 'RCP2025010001',
      customerName: 'นายสมชาย ใจดี',
      customerPhone: '081-234-5678',
      issueDate: '2025-01-09',
      totalAmount: 2000,
      paymentMethod: 'เงินสด',
      status: 'issued',
      items: [
        { treatmentCode: 'T001', treatmentName: 'ขูดหินปูน', quantity: 1, unitPrice: 800, totalPrice: 800 },
        { treatmentCode: 'T002', treatmentName: 'อุดฟัน', quantity: 1, unitPrice: 1200, totalPrice: 1200 },
      ]
    },
    {
      id: '2',
      receiptNumber: 'RCP2025010002',
      customerName: 'นางสาวสมหญิง รักสะอาด',
      customerPhone: '082-345-6789',
      issueDate: '2025-01-08',
      totalAmount: 8000,
      paymentMethod: 'พร้อมเพย์',
      status: 'issued',
      items: [
        { treatmentCode: 'T006', treatmentName: 'ฟอกสีฟัน', quantity: 1, unitPrice: 8000, totalPrice: 8000 },
      ]
    }
  ]);

  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [searchForm] = Form.useForm();

  const handleSearch = (values: any) => {
    // Mock search functionality
    console.log('Search values:', values);
  };

  const handlePreview = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setPreviewVisible(true);
  };

  const handlePrint = (receipt: Receipt) => {
    // Mock print functionality
    console.log('Printing receipt:', receipt.receiptNumber);
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued': return '#52c41a';
      case 'cancelled': return '#ff4d4f';
      case 'refunded': return '#faad14';
      default: return '#d9d9d9';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'issued': return 'ออกแล้ว';
      case 'cancelled': return 'ยกเลิก';
      case 'refunded': return 'คืนเงิน';
      default: return status;
    }
  };

  const columns = [
    {
      title: 'เลขที่ใบเสร็จ',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      width: 150,
    },
    {
      title: 'ชื่อลูกค้า',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
    },
    {
      title: 'เบอร์โทร',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
      width: 120,
    },
    {
      title: 'วันที่ออกใบเสร็จ',
      dataIndex: 'issueDate',
      key: 'issueDate',
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'จำนวนเงิน',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => `฿${amount.toLocaleString()}`,
    },
    {
      title: 'วิธีชำระ',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <span className="receipt-status" style={{ color: getStatusColor(status) }}>
          {getStatusText(status)}
        </span>
      ),
    },
    {
      title: 'จัดการ',
      key: 'actions',
      width: 120,
      render: (_: any, record: Receipt) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
            size="small"
            title="ดูใบเสร็จ"
          />
          <Button
            type="text"
            icon={<PrinterOutlined />}
            onClick={() => handlePrint(record)}
            size="small"
            title="พิมพ์ใบเสร็จ"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="receipt-system-container">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="ค้นหาใบเสร็จ" size="small">
            <Form
              form={searchForm}
              layout="inline"
              onFinish={handleSearch}
            >
              <Form.Item name="receiptNumber">
                <Input placeholder="เลขที่ใบเสร็จ" prefix={<FileTextOutlined />} />
              </Form.Item>
              <Form.Item name="customerName">
                <Input placeholder="ชื่อลูกค้า" />
              </Form.Item>
              <Form.Item name="dateRange">
                <RangePicker placeholder={['วันที่เริ่ม', 'วันที่สิ้นสุด']} />
              </Form.Item>
              <Form.Item name="status">
                <Select placeholder="สถานะ" className="status-select" allowClear>
                  <Option value="issued">ออกแล้ว</Option>
                  <Option value="cancelled">ยกเลิก</Option>
                  <Option value="refunded">คืนเงิน</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  ค้นหา
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="รายการใบเสร็จทั้งหมด" size="small">
            <Table
              columns={columns}
              dataSource={receipts}
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

      {/* Receipt Preview Modal */}
      <Modal
        title="ตัวอย่างใบเสร็จ"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => handlePrint(selectedReceipt!)}>
            พิมพ์
          </Button>,
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            ปิด
          </Button>,
        ]}
        width={600}
      >
        {selectedReceipt && (
          <div className="receipt-preview">
            <div className="receipt-header">
              <Title level={3} className="receipt-title">คลินิกทันตกรรม TooThoot</Title>
              <Text>123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110</Text><br />
              <Text>โทร: 02-123-4567</Text>
            </div>
            
            <Divider />
            
            <Row gutter={16} className="receipt-info-row">
              <Col span={12}>
                <Text strong>เลขที่ใบเสร็จ: </Text>
                <Text>{selectedReceipt.receiptNumber}</Text>
              </Col>
              <Col span={12} className="receipt-date-col">
                <Text strong>วันที่: </Text>
                <Text>{dayjs(selectedReceipt.issueDate).format('DD/MM/YYYY')}</Text>
              </Col>
            </Row>
            
            <Row gutter={16} className="receipt-customer-row">
              <Col span={24}>
                <Text strong>ลูกค้า: </Text>
                <Text>{selectedReceipt.customerName}</Text><br />
                <Text strong>เบอร์โทร: </Text>
                <Text>{selectedReceipt.customerPhone}</Text>
              </Col>
            </Row>

            <Table
              columns={[
                { title: 'รายการ', dataIndex: 'treatmentName', key: 'treatmentName' },
                { title: 'จำนวน', dataIndex: 'quantity', key: 'quantity', align: 'center', width: 80 },
                { title: 'ราคา/หน่วย', dataIndex: 'unitPrice', key: 'unitPrice', align: 'right', width: 100, render: (price: number) => `฿${price.toLocaleString()}` },
                { title: 'รวม', dataIndex: 'totalPrice', key: 'totalPrice', align: 'right', width: 100, render: (price: number) => `฿${price.toLocaleString()}` },
              ]}
              dataSource={selectedReceipt.items}
              rowKey="treatmentCode"
              pagination={false}
              size="small"
              className="receipt-table"
            />

            <div className="receipt-total">
              <Text strong>รวมทั้งสิ้น: ฿{selectedReceipt.totalAmount.toLocaleString()}</Text><br />
              <Text>วิธีชำระ: {selectedReceipt.paymentMethod}</Text>
            </div>

            <Divider />
            
            <div className="receipt-footer">
              <Text type="secondary">ขอบคุณที่ใช้บริการ</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReceiptSystem;
