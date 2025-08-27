// src/pages/medicine_page/DispensePage.tsx

import React, { useState } from 'react';
import { Form, Input, Button, Select, InputNumber, Card, Row, Col, Table, message, Space } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const mockSupplies = [
  { code: 'MED001', name: 'ยาแก้ปวดพาราเซตามอล', category: 'ยาเม็ด' },
  { code: 'MED002', name: 'แอลกอฮอล์ล้างแผล', category: 'ของเหลว' },
  { code: 'MED003', name: 'พลาสเตอร์ปิดแผล', category: 'อุปกรณ์ทำแผล' },
];

const DispensePage = () => {
  const [form] = Form.useForm();
  const [dispenseList, setDispenseList] = useState<any[]>([]);

  const handleSupplyChange = (value: string) => {
    const selectedSupply = mockSupplies.find(item => item.code === value);
    if (selectedSupply) {
      form.setFieldsValue({
        supplyName: selectedSupply.name,
        supplyCategory: selectedSupply.category,
      });
    }
  };

  const handleAddToList = () => {
    form.validateFields(['caseCode', 'supplyCode', 'quantity'])
      .then(values => {
        const selectedSupply = mockSupplies.find(item => item.code === values.supplyCode);
        if (selectedSupply) {
          const newDispenseItem = {
            key: `${values.caseCode}-${values.supplyCode}-${dispenseList.length}`,
            caseCode: values.caseCode,
            supplyCode: selectedSupply.code,
            supplyName: selectedSupply.name,
            quantity: values.quantity,
          };
          setDispenseList(prevList => [...prevList, newDispenseItem]);
          message.success('เพิ่มรายการเบิกสำเร็จ!');
          form.resetFields(['supplyCode', 'supplyName', 'supplyCategory', 'quantity']);
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDeleteItem = (key: string) => {
    setDispenseList(dispenseList.filter(item => item.key !== key));
    message.success('ลบรายการสำเร็จ!');
  };
  
  const handleConfirmDispense = () => {
      console.log("รายการที่เบิกจ่ายทั้งหมด:", dispenseList);
      message.success("ยืนยันการเบิกจ่ายสำเร็จ!");
      setDispenseList([]);
      form.resetFields();
  };

  const handleCancelDispense = () => {
      setDispenseList([]);
      form.resetFields();
      message.info("ยกเลิกการเบิกจ่าย");
  };

  const columns = [
    { title: 'ชื่อเวชภัณฑ์', dataIndex: 'supplyName', key: 'supplyName' },
    { title: 'จำนวน', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'ลบ',
      key: 'action',
      width: 70,
      render: (_: any, record: any) => (
        <Button
          type="text"
          danger
          icon={<MinusCircleOutlined />}
          onClick={() => handleDeleteItem(record.key)}
        />
      ),
    },
  ];

  return (
    <Card title="การเบิก/จ่ายเวชภัณฑ์" bordered style={{ borderRadius: '12px' }}>
      <Row gutter={32}>
        {/* ส่วนฟอร์มด้านซ้าย */}
        <Col span={12}>
          <Form form={form} layout="vertical" name="dispense_form">
            <Form.Item
              name="caseCode"
              label="รหัสเคส"
              rules={[{ required: true, message: 'กรุณากรอกรหัสเคส!' }]}
            >
              <Input placeholder="รหัสเคส" />
            </Form.Item>

            <Form.Item
              name="supplyCode"
              label="รหัสเวชภัณฑ์"
              rules={[{ required: true, message: 'กรุณาเลือกรหัสเวชภัณฑ์!' }]}
            >
              <Select placeholder="เลือกรหัสเวชภัณฑ์" onChange={handleSupplyChange}>
                {mockSupplies.map(supply => (
                  <Option key={supply.code} value={supply.code}>
                    {supply.code}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="supplyName" label="ชื่อเวชภัณฑ์">
              <Input placeholder="ชื่อเวชภัณฑ์" disabled />
            </Form.Item>

            <Form.Item name="supplyCategory" label="ประเภท">
              <Input placeholder="ประเภท" disabled />
            </Form.Item>

            <Form.Item name="quantity" label="จำนวน" rules={[{ required: true, message: 'กรุณากรอกจำนวน!' }]}>
              <InputNumber min={1} style={{ width: '100%' }} placeholder="จำนวน" />
            </Form.Item>

            <Form.Item name="dispenser" label="ผู้เบิก / หน่วยงาน">
              <Input placeholder="ชื่อผู้เบิกหรือหน่วยงาน" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" onClick={handleAddToList}>เพิ่ม</Button>
                <Button onClick={() => form.resetFields()}>ล้างข้อมูล</Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>

        {/* ส่วนแสดงรายการที่เบิกด้านขวา */}
        <Col span={12}>
          <Card bordered style={{ borderRadius: '8px', minHeight: '400px' }}>
            <Table
              dataSource={dispenseList}
              columns={columns}
              pagination={false}
              locale={{ emptyText: 'No data' }}
              style={{ marginBottom: '16px' }}
            />
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" onClick={handleConfirmDispense}>ตกลง</Button>
                <Button onClick={handleCancelDispense}>ยกเลิก</Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default DispensePage;