import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, InputNumber, Steps, Typography, Space, Divider, message, Row, Col, Table, Tag } from 'antd';
import { DollarOutlined, MobileOutlined, FileTextOutlined, CheckCircleOutlined, PrinterOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import PromptPayQR from '../third-party/PromptPayQR';
import { paymentAPI, Payment } from '../../../../services/api';
import './TreatmentPaymentFlow.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

interface TreatmentItem {
  type: string;
  price: number;
  description?: string;
}

interface TreatmentData {
  patientName: string;
  patientId: string;
  treatments: TreatmentItem[];
  dentistName: string;
  amount: number;
  paymentMethod: 'cash' | 'online';
  receivedAmount?: number;
  transactionRef?: string;
}

const TreatmentPaymentFlow: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [treatmentData, setTreatmentData] = useState<Partial<TreatmentData>>({ treatments: [] });
  const [loading, setLoading] = useState(false);
  const [selectedTreatments, setSelectedTreatments] = useState<TreatmentItem[]>([]);

  const treatmentTypes = [
    { name: 'ทำความสะอาดฟัน', price: 800 },
    { name: 'อุดฟัน', price: 1200 },
    { name: 'ถอนฟัน', price: 500 },
    { name: 'รักษารากฟัน', price: 3500 },
    { name: 'จัดฟัน', price: 25000 },
    { name: 'ใส่ฟันปลอม', price: 8000 },
    { name: 'ฟอกสีฟัน', price: 2500 },
    { name: 'ผ่าตัดช่องปาก', price: 5000 },
    { name: 'ตรวจสุขภาพช่องปาก', price: 300 },
    { name: 'ขูดหินปูน', price: 600 }
  ];

  const doctors = [
    'ทพ. สมชาย ใจดี',
    'ทพ. สุดา รักษ์ดี', 
    'ทพ. วิชัย เก่งมาก',
    'ทพ. นิดา ใส่ใจ',
    'ทพ. ประยุทธ์ ชำนาญ',
    'ทพ. สมหญิง ดีเลิศ'
  ];

  const steps = [
    {
      title: 'ข้อมูลการรักษา',
      icon: <FileTextOutlined />
    },
    {
      title: 'จำนวนเงิน',
      icon: <DollarOutlined />
    },
    {
      title: 'วิธีชำระเงิน',
      icon: <MobileOutlined />
    },
    {
      title: 'ตรวจสอบ',
      icon: <CheckCircleOutlined />
    },
    {
      title: 'ใบเสร็จ',
      icon: <PrinterOutlined />
    }
  ];

  const addTreatment = (treatmentType: string) => {
    const treatment = treatmentTypes.find(t => t.name === treatmentType);
    if (treatment && !selectedTreatments.find(t => t.type === treatment.name)) {
      const newTreatment: TreatmentItem = {
        type: treatment.name,
        price: treatment.price,
        description: ''
      };
      setSelectedTreatments([...selectedTreatments, newTreatment]);
      form.setFieldValue('treatmentType', undefined);
    }
  };

  const removeTreatment = (index: number) => {
    const newTreatments = selectedTreatments.filter((_, i) => i !== index);
    setSelectedTreatments(newTreatments);
  };

  const updateTreatmentDescription = (index: number, description: string) => {
    const newTreatments = [...selectedTreatments];
    newTreatments[index].description = description;
    setSelectedTreatments(newTreatments);
  };

  const calculateTotal = () => {
    return selectedTreatments.reduce((total, treatment) => total + treatment.price, 0);
  };

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      
      if (currentStep === 0) {
        if (selectedTreatments.length === 0) {
          message.error('กรุณาเลือกการรักษาอย่างน้อย 1 รายการ');
          return;
        }
        const totalAmount = calculateTotal();
        setTreatmentData(prev => ({ 
          ...prev, 
          ...values, 
          treatments: selectedTreatments,
          amount: totalAmount
        }));
      } else {
        setTreatmentData(prev => ({ ...prev, ...values }));
      }
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Mock API call to save treatment and payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success('บันทึกข้อมูลการรักษาและการชำระเงินเรียบร้อยแล้ว');
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    message.success('กำลังพิมพ์ใบเสร็จ...');
    // Reset form
    form.resetFields();
    setTreatmentData({});
    setCurrentStep(0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // ข้อมูลการรักษา
        return (
          <div>
            <Title level={4}>ข้อมูลการรักษา</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="ชื่อผู้ป่วย"
                  name="patientName"
                  rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ป่วย' }]}
                >
                  <Input placeholder="กรอกชื่อผู้ป่วย" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="รหัสผู้ป่วย"
                  name="patientId"
                  rules={[{ required: true, message: 'กรุณากรอกรหัสผู้ป่วย' }]}
                >
                  <Input placeholder="กรอกรหัสผู้ป่วย" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="ทันตแพทย์ผู้รักษา"
              name="dentistName"
              rules={[{ required: true, message: 'กรุณาเลือกทันตแพทย์' }]}
            >
              <Select placeholder="เลือกทันตแพทย์ผู้รักษา">
                {doctors.map(doctor => (
                  <Option key={doctor} value={doctor}>{doctor}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Divider />
            
            <div className="treatment-selection-section">
              <Title level={5} className="treatment-selection-title">เพิ่มการรักษา</Title>
              <Row gutter={16}>
                <Col span={18}>
                  <Form.Item name="treatmentType">
                    <Select 
                      placeholder="เลือกประเภทการรักษา"
                      onChange={addTreatment}
                      value={undefined}
                    >
                      {treatmentTypes.map(type => (
                        <Option key={type.name} value={type.name}>
                          {type.name} - ฿{type.price.toLocaleString()}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                      const treatmentType = form.getFieldValue('treatmentType');
                      if (treatmentType) {
                        addTreatment(treatmentType);
                      }
                    }}
                  >
                    เพิ่ม
                  </Button>
                </Col>
              </Row>
            </div>

            {selectedTreatments.length > 0 && (
              <div>
                <Title level={5}>รายการรักษาที่เลือก</Title>
                <Table
                  dataSource={selectedTreatments.map((treatment, index) => ({
                    key: index,
                    ...treatment,
                    index
                  }))}
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: 'การรักษา',
                      dataIndex: 'type',
                      key: 'type',
                    },
                    {
                      title: 'ราคา',
                      dataIndex: 'price',
                      key: 'price',
                      render: (price: number) => `฿${price.toLocaleString()}`,
                      width: 120,
                    },
                    {
                      title: 'หมายเหตุ',
                      dataIndex: 'description',
                      key: 'description',
                      render: (description: string, record: any) => (
                        <Input
                          placeholder="หมายเหตุ (ถ้ามี)"
                          value={description}
                          onChange={(e) => updateTreatmentDescription(record.index, e.target.value)}
                        />
                      ),
                    },
                    {
                      title: 'ลบ',
                      key: 'action',
                      width: 60,
                      render: (_, record: any) => (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeTreatment(record.index)}
                        />
                      ),
                    },
                  ]}
                />
                
                <div className="treatment-total-section">
                  <Text strong style={{ fontSize: '16px' }}>
                    ยอดรวม: ฿{calculateTotal().toLocaleString()}
                  </Text>
                </div>
              </div>
            )}
          </div>
        );

      case 1: // จำนวนเงิน
        return (
          <div>
            <Title level={4}>จำนวนเงิน</Title>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Text type="secondary">ยอดรวมค่ารักษาทั้งหมด</Text>
            </div>
            
            {treatmentData.treatments && treatmentData.treatments.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <Title level={5}>รายการรักษา</Title>
                <Table
                  dataSource={treatmentData.treatments.map((treatment, index) => ({
                    key: index,
                    ...treatment
                  }))}
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: 'การรักษา',
                      dataIndex: 'type',
                      key: 'type',
                    },
                    {
                      title: 'ราคา',
                      dataIndex: 'price',
                      key: 'price',
                      render: (price: number) => `฿${price.toLocaleString()}`,
                      align: 'right' as const,
                    },
                  ]}
                  summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>
                        <Text strong>รวมทั้งหมด</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <Text strong className="treatment-total-amount">
                          ฿{treatmentData.amount?.toLocaleString()}
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />
              </div>
            )}

            <Form.Item
              label="จำนวนเงิน (สามารถแก้ไขได้)"
              name="amount"
              initialValue={treatmentData.amount}
              rules={[
                { required: true, message: 'กรุณากรอกจำนวนเงิน' },
                { type: 'number', min: 0.01, message: 'จำนวนเงินต้องมากกว่า 0' }
              ]}
            >
              <InputNumber
                prefix="฿"
                placeholder="0.00"
                style={{ width: '100%', fontSize: '24px', height: '60px' }}
                min={0}
                step={0.01}
              />
            </Form.Item>
          </div>
        );

      case 2: // วิธีชำระเงิน
        return (
          <div>
            <Title level={4}>วิธีชำระเงิน</Title>
            
            <Form.Item
              label="เลือกวิธีชำระเงิน"
              name="paymentMethod"
              rules={[{ required: true, message: 'กรุณาเลือกวิธีชำระเงิน' }]}
            >
              <Select placeholder="เลือกวิธีชำระเงิน" onChange={(value) => setTreatmentData(prev => ({ ...prev, paymentMethod: value }))}>
                <Option value="cash">
                  <Space>
                    <DollarOutlined />
                    เงินสด
                  </Space>
                </Option>
                <Option value="online">
                  <Space>
                    <MobileOutlined />
                    PromptPay / QR Code
                  </Space>
                </Option>
              </Select>
            </Form.Item>

            {treatmentData.paymentMethod === 'cash' && (
              <Form.Item
                label="จำนวนเงินที่รับมา"
                name="receivedAmount"
                rules={[
                  { required: true, message: 'กรุณากรอกจำนวนเงินที่รับมา' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const amount = getFieldValue('amount') || treatmentData.amount;
                      if (!value || value >= amount) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('จำนวนเงินที่รับมาต้องมากกว่าหรือเท่ากับยอดที่ต้องชำระ'));
                    },
                  }),
                ]}
              >
                <InputNumber
                  prefix="฿"
                  placeholder="0.00"
                  style={{ width: '100%' }}
                  min={0}
                  step={0.01}
                />
              </Form.Item>
            )}

            {treatmentData.paymentMethod === 'online' && treatmentData.amount && (
              <div>
                <PromptPayQR
                  phoneNumber="0643070129"
                  amount={treatmentData.amount}
                  clinicName="ABC Dental Clinic"
                />
                <Form.Item
                  label="หมายเลขอ้างอิงการโอนเงิน"
                  name="transactionRef"
                >
                  <Input placeholder="กรอกหมายเลขอ้างอิง (ถ้ามี)" />
                </Form.Item>
              </div>
            )}
          </div>
        );

      case 3: // ตรวจสอบ
        return (
          <div>
            <Title level={4}>ตรวจสอบข้อมูล</Title>
            
            <Card title="ข้อมูลผู้ป่วย" style={{ marginBottom: '16px' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>ผู้ป่วย: </Text>
                  <Text>{treatmentData.patientName}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>รหัสผู้ป่วย: </Text>
                  <Text>{treatmentData.patientId}</Text>
                </Col>
              </Row>
              <Divider />
              <Text strong>ทันตแพทย์ผู้รักษา: </Text>
              <Text>{treatmentData.dentistName}</Text>
            </Card>

            <Card title="รายการรักษา" style={{ marginBottom: '16px' }}>
              {treatmentData.treatments && treatmentData.treatments.length > 0 ? (
                <Table
                  dataSource={treatmentData.treatments.map((treatment, index) => ({
                    key: index,
                    ...treatment
                  }))}
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: 'การรักษา',
                      dataIndex: 'type',
                      key: 'type',
                    },
                    {
                      title: 'หมายเหตุ',
                      dataIndex: 'description',
                      key: 'description',
                      render: (description: string) => description || '-',
                    },
                    {
                      title: 'ราคา',
                      dataIndex: 'price',
                      key: 'price',
                      render: (price: number) => `฿${price.toLocaleString()}`,
                      align: 'right' as const,
                    },
                  ]}
                  summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>
                        <Text strong>รวมทั้งหมด</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="right">
                        <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                          ฿{treatmentData.amount?.toLocaleString()}
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />
              ) : (
                <Text type="secondary">ไม่มีรายการรักษา</Text>
              )}
            </Card>

            <Card title="ข้อมูลการชำระเงิน">
              <Text strong style={{ fontSize: '18px' }}>ยอดรวม: ฿{treatmentData.amount?.toFixed(2)}</Text>
              <br />
              <Text strong>วิธีชำระ: </Text>
              <Text>{treatmentData.paymentMethod === 'cash' ? 'เงินสด' : 'PromptPay'}</Text>
              
              {treatmentData.paymentMethod === 'cash' && treatmentData.receivedAmount && (
                <>
                  <br />
                  <Text strong>เงินที่รับมา: </Text>
                  <Text>฿{treatmentData.receivedAmount.toFixed(2)}</Text>
                  <br />
                  <Text strong style={{ color: '#52c41a' }}>เงินทอน: </Text>
                  <Text style={{ color: '#52c41a' }}>฿{(treatmentData.receivedAmount - (treatmentData.amount || 0)).toFixed(2)}</Text>
                </>
              )}
            </Card>
          </div>
        );

      case 4: // ใบเสร็จ
        return (
          <div>
            <div className="success-section">
              <CheckCircleOutlined className="success-icon" />
              <Title level={3} className="success-title">บันทึกข้อมูลเรียบร้อยแล้ว</Title>
              <Text className="success-message">ข้อมูลการรักษาและการชำระเงินได้ถูกบันทึกลงในระบบแล้ว</Text>
            </div>
            
            <Card style={{ marginTop: '24px', textAlign: 'left' }} title="ใบเสร็จรับเงิน">
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <Text strong style={{ fontSize: '18px' }}>คลินิกทันตกรรม ABC</Text>
                <br />
                <Text>วันที่: {new Date().toLocaleDateString('th-TH')}</Text>
              </div>
              <Divider />
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>ผู้ป่วย: </Text><Text>{treatmentData.patientName}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>รหัสผู้ป่วย: </Text><Text>{treatmentData.patientId}</Text>
                </Col>
              </Row>
              <br />
              <Text strong>ทันตแพทย์ผู้รักษา: </Text><Text>{treatmentData.dentistName}</Text>
              <Divider />
              
              {treatmentData.treatments && treatmentData.treatments.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>รายการรักษา:</Text>
                  <Table
                    dataSource={treatmentData.treatments.map((treatment, index) => ({
                      key: index,
                      ...treatment
                    }))}
                    pagination={false}
                    size="small"
                    showHeader={false}
                    columns={[
                      {
                        dataIndex: 'type',
                        key: 'type',
                      },
                      {
                        dataIndex: 'price',
                        key: 'price',
                        render: (price: number) => `฿${price.toLocaleString()}`,
                        align: 'right' as const,
                        width: 100,
                      },
                    ]}
                  />
                </div>
              )}
              
              <Divider />
              <div style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: '18px' }}>ยอดรวม: ฿{treatmentData.amount?.toLocaleString()}</Text>
                <br />
                <Text>วิธีชำระ: {treatmentData.paymentMethod === 'cash' ? 'เงินสด' : 'PromptPay'}</Text>
                {treatmentData.paymentMethod === 'cash' && treatmentData.receivedAmount && (
                  <>
                    <br />
                    <Text>เงินทอน: ฿{(treatmentData.receivedAmount - (treatmentData.amount || 0)).toFixed(2)}</Text>
                  </>
                )}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="treatment-payment-container">
      <Steps
        current={currentStep}
        className="treatment-payment-steps"
        items={steps}
      >
        {steps.map((step, index) => (
          <Step key={index} title={step.title} icon={step.icon} />
        ))}
      </Steps>

      <Card style={{ minHeight: '500px' }}>
        <Form form={form} layout="vertical">
          {renderStepContent()}
        </Form>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          {currentStep > 0 && currentStep < 4 && (
            <Button style={{ marginRight: '8px' }} onClick={handlePrevious}>
              ย้อนกลับ
            </Button>
          )}
          
          {currentStep < 3 && (
            <Button type="primary" onClick={handleNext}>
              ถัดไป
            </Button>
          )}
          
          {currentStep === 3 && (
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              บันทึกข้อมูล
            </Button>
          )}
          
          {currentStep === 4 && (
            <Space>
              <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrintReceipt}>
                พิมพ์ใบเสร็จ
              </Button>
              <Button onClick={() => {
                form.resetFields();
                setTreatmentData({});
                setCurrentStep(0);
              }}>
                เริ่มใหม่
              </Button>
            </Space>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TreatmentPaymentFlow;
