import React, { useState } from 'react';
import { Card, Table } from 'antd';
import type { TableColumnsType } from 'antd';

interface DataType {
  key: React.Key;
  visitDate: string;
  service: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'วันที่เข้ารับบริการ',
    dataIndex: 'visitDate',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'บริการ',
    dataIndex: 'service',
  },
];

const data: DataType[] = [
  {
    key: '1',
    visitDate: '2023-07-01',
    service: 'ตรวจสุขภาพ',
  },
  {
    key: '2',
    visitDate: '2023-07-05',
    service: 'ฉีดวัคซีน',
  },
  {
    key: '3',
    visitDate: '2023-07-10',
    service: 'พบแพทย์',
  },
];

const App: React.FC = () => {
  return (
    <div>
      <Card style={{ width: 500, margin:"0" }}>
        <Table<DataType>
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default App;
