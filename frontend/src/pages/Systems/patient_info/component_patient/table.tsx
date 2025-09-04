import React, { useEffect, useState } from "react";
import { Table, message, Space, Popconfirm, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PatientAPI } from "../../../../services/patient/patientApi";
import { PatientRow } from "../../../../interface/patient";
// ดึง array ออกมาจากรูปแบบ response ต่าง ๆ + map field ให้ตรงคอลัมน์
const toRows = (resp: any): PatientRow[] => {
  // console.log("getAll() raw:", resp); // เปิดดีบักได้ถ้าจำเป็น
  const raw =
    (Array.isArray(resp) && resp) ||
    (Array.isArray(resp?.data) && resp.data) ||
    (Array.isArray(resp?.data?.patients) && resp.data.patients) ||
    (Array.isArray(resp?.patients) && resp.patients) ||
    (Array.isArray(resp?.items) && resp.items) ||
    [];

  return raw.map((p: any, i: number) => ({
    id: p.ID ?? p.id ?? i,                            // GORM ส่ง ID (พิมพ์ใหญ่)
    firstname: p.firstname ?? p.first_name ?? "",
    lastname: p.lastname ?? p.last_name ?? "",
    phonenumber: p.phonenumber ?? p.phone_number ?? "",
  }));
};

const PatienTable: React.FC = () => {
  const [data, setData] = useState<PatientRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await PatientAPI.getAll(); 
      setData(toRows(resp));                 
    } catch (error) {
      console.error("Error fetching patients:", error);
      messageApi.error("โหลดข้อมูลไม่สำเร็จ");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await PatientAPI.delete(Number(id)); // endpoint มักรับเลข
      messageApi.success("ลบข้อมูลสำเร็จ");
      fetchData();
    } catch (error) {
      console.error("Error deleting patient:", error);
      messageApi.error("ลบข้อมูลไม่สำเร็จ");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnsType<PatientRow> = [
    { title: "รหัส", dataIndex: "id", key: "id", width: 120 },
    { title: "ชื่อ", dataIndex: "firstname", key: "firstname" },
    { title: "นามสกุล", dataIndex: "lastname", key: "lastname" },
    // ใช้ "phonenumber" ให้ตรง payload จริง (ไม่ใช่ phone_number)
    { title: "เบอร์โทรศัพท์", dataIndex: "phonenumber", key: "phonenumber" },
    {
      title: "Action",
      key: "action",
      width: 140,
      // ลำดับพารามิเตอร์ที่ถูกต้อง: (text, record, index)
      render: (_text, record) => (
        <Space>
          <Popconfirm
            title="ยืนยันการลบ?"
            okText="ลบ"
            cancelText="ยกเลิก"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger size="small">ลบ</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        rowKey={(record, index) => String(record.id ?? index)} // กันเคส id หาย
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default PatienTable;
