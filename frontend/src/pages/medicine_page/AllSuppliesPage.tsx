// src/pages/medicine_page/AllSuppliesPage.tsx

import React, { useState, useEffect } from 'react';
import { Input, Table, Button, Space, Select, DatePicker, Tag, Tooltip, message, Popconfirm } from 'antd';
import { SearchOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

// ข้อมูลตัวอย่างสำหรับตาราง
const initialDataSource = [
  { key: '1', code: 'MED001', name: 'ยาแก้ปวดพาราเซตามอล', category: 'ยาเม็ด', quantity: 1500, unit: 'เม็ด', importDate: '2025-07-01', expiryDate: '2026-07-01' },
  { key: '2', code: 'MED002', name: 'แอลกอฮอล์ล้างแผล', category: 'ของเหลว', quantity: 250, unit: 'ขวด', importDate: '2025-06-15', expiryDate: '2027-06-15' },
  { key: '3', code: 'MED003', name: 'พลาสเตอร์ปิดแผล', category: 'อุปกรณ์ทำแผล', quantity: 500, unit: 'แผ่น', importDate: '2025-07-10', expiryDate: '2028-07-10' },
  { key: '4', code: 'MED004', name: 'สำลี', category: 'อุปกรณ์ทำแผล', quantity: 1000, unit: 'ชิ้น', importDate: '2025-05-20', expiryDate: '2026-05-20' },
];

const AllSuppliesPage = () => {
  const [data, setData] = useState(initialDataSource);
  const [filteredData, setFilteredData] = useState(initialDataSource);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [importDateFilter, setImportDateFilter] = useState(null);
  const [expiryDateFilter, setExpiryDateFilter] = useState(null);

  useEffect(() => {
    let result = data;
    if (searchText) result = result.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
    if (categoryFilter !== 'all') result = result.filter(item => item.category === categoryFilter);
    if (importDateFilter) result = result.filter(item => dayjs(item.importDate).isSame(dayjs(importDateFilter), 'day'));
    if (expiryDateFilter) result = result.filter(item => dayjs(item.expiryDate).isSame(dayjs(expiryDateFilter), 'day'));
    setFilteredData(result);
  }, [searchText, categoryFilter, importDateFilter, expiryDateFilter, data]);

  const handleResetFilters = () => {
    setSearchText('');
    setCategoryFilter('all');
    setImportDateFilter(null);
    setExpiryDateFilter(null);
    setFilteredData(data);
  };

  

  // ฟังก์ชันสำหรับจัดการการแก้ไขข้อมูล
  const handleEdit = (record) => {
    // ในโปรเจกต์จริง คุณจะเปิด Modal หรือไปที่หน้าแก้ไข
    console.log('แก้ไขรายการ:', record);
    message.info(`กำลังแก้ไขรายการ: ${record.name}`);
  };

  // ฟังก์ชันสำหรับจัดการการลบข้อมูล
  const handleDelete = (key) => {
    // ในโปรเจกต์จริง คุณจะเรียก API เพื่อลบข้อมูลจากฐานข้อมูล
    const newData = data.filter(item => item.key !== key);
    setData(newData);
    setFilteredData(newData);
    message.success('ลบรายการสำเร็จ!');
  };

  const columns = [
    { title: 'รหัส', dataIndex: 'code', key: 'code' },
    { title: 'ชื่อเวชภัณฑ์', dataIndex: 'name', key: 'name' },
    {
      title: 'หมวดหมู่', dataIndex: 'category', key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    { title: 'จำนวน', dataIndex: 'quantity', key: 'quantity' },
    { title: 'หน่วย', dataIndex: 'unit', key: 'unit' },
    { title: 'วันที่นำเข้า', dataIndex: 'importDate', key: 'importDate' },
    { title: 'วันหมดอายุ', dataIndex: 'expiryDate', key: 'expiryDate' },
    {
      title: 'จัดการ',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="คุณต้องการลบรายการนี้ใช่ไหม?"
            onConfirm={() => handleDelete(record.key)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Tooltip title="ลบ">
              <Button
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        <Space size="middle">
          <Search
            placeholder="ค้นหาเวชภัณฑ์..."
            onChange={e => setSearchText(e.target.value)}
            value={searchText}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
          />
          <Select
            defaultValue="all"
            style={{ width: 180 }}
            onChange={value => setCategoryFilter(value)}
            value={categoryFilter}
          >
            <Option value="all">หมวดหมู่ทั้งหมด</Option>
            {[...new Set(data.map(item => item.category))].map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
          <DatePicker
            placeholder="วันที่นำเข้า"
            onChange={date => setImportDateFilter(date)}
            value={importDateFilter}
            style={{ width: 150 }}
          />
          <DatePicker
            placeholder="วันหมดอายุ"
            onChange={date => setExpiryDateFilter(date)}
            value={expiryDateFilter}
            style={{ width: 150 }}
          />
          <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>รีเซ็ต</Button>
        </Space>
        <Space style={{ marginLeft: 'auto' }}>
          <Button type="primary">ดูรายงานการเบิก/จ่าย</Button>
        </Space>
      </div>
      <Table dataSource={filteredData} columns={columns} bordered />
    </div>
  );
};

export default AllSuppliesPage;