import React, { useState, useEffect } from "react";
import { Card, Input, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getTodayInitialSymptomps, InitialSymtoms } from "../../../../services/Dashboard/dashboardStaff";

interface PaymentPatient {
  id: number;
  firstName: string;
  lastName: string;
  service: string;
  cost: number;
  status: string;
}

const Payment: React.FC = () => {
  const [data, setData] = useState<PaymentPatient[]>([]);
  const [filteredData, setFilteredData] = useState<PaymentPatient[]>([]);

  const fetchData = async () => {
    try {
      const res = await getTodayInitialSymptomps();
      const items: PaymentPatient[] = res.symptomps
        .filter(s => s.Status?.Name === "รอชำระเงิน") // เฉพาะที่ต้องชำระเงิน
        .map(s => ({
          id: s.ID,
          firstName: s.Patient?.FirstName || "",
          lastName: s.Patient?.LastName || "",
          service: s.Service?.Name || "",
          cost: (s.Service as any)?.Cost || 0, // สมมติ cost อยู่ใน Service
          status: s.Status?.Name || "",
        }));
      setData(items);
      setFilteredData(items);
    } catch (err) {
      console.error("❌ Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (value: string) => {
    const v = value.toLowerCase();
    setFilteredData(
      data.filter(
        p =>
          p.firstName.toLowerCase().includes(v) ||
          p.lastName.toLowerCase().includes(v) ||
          p.service.toLowerCase().includes(v)
      )
    );
  };

  const columns: ColumnsType<PaymentPatient> = [
    { title: "No.", width: "10%", render: (_v, _r, i) => i + 1 },
    { title: "ชื่อ - นามสกุล", width: "35%", render: (_v, r) => `${r.firstName} ${r.lastName}` },
    { title: "บริการ", dataIndex: "service", width: "35%" },
    { title: "ราคา", dataIndex: "cost", width: "20%", render: (v) => `${v} บาท` },
  ];

  return (
    <Card
      size="small"
      title={
        <Input.Search
          placeholder="ค้นหาชื่อ/บริการ"
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
      }
      bodyStyle={{ padding: 0 }}
    >
      <Table<PaymentPatient>
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        scroll={{ y: 400, x: 500 }}
        size="middle"
      />
    </Card>
  );
};

export default Payment;
