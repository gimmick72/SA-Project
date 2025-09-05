import React, { useEffect, useState } from "react";
import { Table, message, Space, Popconfirm, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PatientAPI } from "../../../../services/patient/patientApi";
import { PatientRow } from "../../../../interface/patient";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // ✅ ใช้ useNavigate

const toRows = (resp: any): PatientRow[] => {
  const raw =
    (Array.isArray(resp) && resp) ||
    (Array.isArray(resp?.data) && resp.data) ||
    (Array.isArray(resp?.data?.patients) && resp.data.patients) ||
    (Array.isArray(resp?.patients) && resp.patients) ||
    (Array.isArray(resp?.items) && resp.items) ||
    [];

  return raw.map((p: any, i: number) => ({
    id: p.ID ?? p.id ?? `row-${i}`, // ✅ มีค่าเสมอ
    firstname: p.firstname ?? p.first_name ?? "",
    lastname: p.lastname ?? p.last_name ?? "",
    phonenumber: p.phonenumber ?? p.phone_number ?? "",
  }));
};

const PatienTable: React.FC = () => {
  const [data, setData] = useState<PatientRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate(); // ✅

  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await PatientAPI.getAll();
      setData(toRows(resp));
    } catch (error: any) {
      console.error("Error fetching patients:", error);
      messageApi.error(error?.response?.data?.error || "โหลดข้อมูลไม่สำเร็จ");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await PatientAPI.delete(Number(id));
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
    { title: "เบอร์โทรศัพท์", dataIndex: "phonenumber", key: "phonenumber" },
    {
      title: "Action",
      key: "action",
      width: 220,
      render: (_text, record) => (
        <Space>
          {/* เพิ่มข้อมูลย่อยของคนไข้รายนี้ */}
          <Button
            style={{
              backgroundColor: "#B9F6FF",
              color: "black",
              border: "gray solid 1px",
              borderRadius: "10px"
            }}
            size="small"
            type="primary"
            onClick={() => navigate(`initial-symptoms/${record.id}`)} 
          >
            บันทึกบริการ
          </Button>

          {/* ไปหน้าแก้ไข/รายละเอียด */}
          <Button
          style={{
            backgroundColor: "#FEFFC6",
            color: "black",
            border: "gray solid 1px",
            borderRadius: "10px"
          }}
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`detail/${record.id}`)} 
          >
            แก้ไข
          </Button>

          <Popconfirm
            title="ยืนยันการลบ?"
            okText="ลบ"
            cancelText="ยกเลิก"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button 
            style={{
              backgroundColor: "#FFCDD2",
              color: "black",
              border: "gray solid 1px",
              borderRadius: "10px"
            }}
            size="small" 
            danger icon={<DeleteOutlined />}>
              ลบ
            </Button>
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
        rowKey="id"                              
        pagination={{ pageSize: 5 }}
        
      />
   
    </>
  );
};

export default PatienTable;
