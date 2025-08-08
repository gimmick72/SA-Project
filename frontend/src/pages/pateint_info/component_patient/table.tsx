import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from 'react-router-dom'; // อย่าลืม import Link ด้วย!

interface DataType {
  key: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'รหัส',
    dataIndex: 'patient_id',
    key: 'patient_id',
    width: 100,
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'ชื่อ',
    dataIndex: 'first_name',
    key: 'first_name',
    width: 150,
  },
  {
    title: 'นามสกุล',
    dataIndex: 'last_name',
    key: 'last_name',
    width: 150,
  },
  {
    title: 'เบอร์โทรศัพท์',
    dataIndex: 'phone_number',
    key: 'phone_number',
    width: 180,
  },
  {
    title: 'Action',
    key: 'action',
    width: 280,
    render: (_, record) => (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Link to="/patient/initial">
          <button
            type="button"
            style={{
              backgroundColor: '#BBE6F9',
              color: 'black',
              border: 'none',
              borderRadius: '13px',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            บันทึกบริการ
          </button>
        </Link>

        <button
          type="button"
          style={{
            backgroundColor: '#F9F9BB',
            color: 'black',
            border: 'none',
            borderRadius: '13px',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          ดูรายละเอียด
        </button>
        <FaRegEdit style={{ color: 'black', cursor: 'pointer' }} />
        <MdDeleteOutline style={{ color: 'red', cursor: 'pointer' }} />
      </div>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    patient_id: 'P001',
    first_name: 'John',
    last_name: 'Brown',
    phone_number: '0812345678',
  },
  {
    key: '2',
    patient_id: 'P002',
    first_name: 'Jim',
    last_name: 'Green',
    phone_number: '0898765432',
  },
  {
    key: '3',
    patient_id: 'P003',
    first_name: 'Joe',
    last_name: 'Black',
    phone_number: '0888888888',
  },
  {
    key: '4',
    patient_id: 'P004',
    first_name: 'Jane',
    last_name: 'Doe',
    phone_number: '0876543210',
  },
];

const CustomTable: React.FC = () => (
  <div
    style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      overflowX: 'auto',
    }}
  >
    <Table
      columns={columns}
      dataSource={data}
      scroll={{ x: 'max-content' }}
      pagination={false}
      bordered
    />
  </div>
);

export default CustomTable;
