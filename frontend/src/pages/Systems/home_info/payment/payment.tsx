import React, { useState, useEffect } from "react";
import { Card, Input, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Person } from "../types";

interface PaymentTabProps {
  rows: Person[];
  onPaid: (id: number) => void;
  onVoid: (id: number) => void;
}

const PaymentTab: React.FC<PaymentTabProps> = ({ rows, onPaid, onVoid }) => {
  const [filteredData, setFilteredData] = useState<Person[]>(rows);

  useEffect(() => {
    setFilteredData(rows.filter(person => !person.paid));
  }, [rows]);

  const handleSearch = (value: string) => {
    const filtered = rows.filter(person => 
      `${person.firstName} ${person.lastName}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const columns: ColumnsType<Person> = [
    {
      title: "ชื่อ-นามสกุล",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "บริการ",
      dataIndex: "service",
    },
    {
      title: "จำนวนเงิน",
      dataIndex: "amount",
      render: (amount) => `${amount || 0} บาท`,
    },
    {
      title: "การดำเนินการ",
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onPaid(record.id)}>ชำระแล้ว</button>
          <button onClick={() => onVoid(record.id)}>ยกเลิก</button>
        </div>
      ),
    },
  ];

  return (
    <Card
      size="small"
      title="ชำระเงิน"
      extra={
        <Input.Search
          placeholder="ค้นหาผู้ป่วย..."
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      }
      bodyStyle={{ padding: 0 }}
    >
      <Table<Person>
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        scroll={{ y: 400, x: 500 }}
      />
    </Card>
  );
};

export default PaymentTab;
