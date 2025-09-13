import React, { useEffect, useMemo, useState } from "react";
import { Table, message, Space, Popconfirm, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { patientAPI } from "../../../../services/patientApi";
import { useNavigate } from "react-router-dom";
import { PatientRow } from "../../../../interface/initailPatient/patient";

// ✅ ดึง array ออกมาไม่ว่ารูปไหน
const pickArray = (resp: any): any[] => {
  if (Array.isArray(resp)) return resp; // [ ... ]
  if (Array.isArray(resp?.patients)) return resp.patients; // { patients: [...] }
  if (Array.isArray(resp?.data)) return resp.data; // { data: [...] }
  if (Array.isArray(resp?.items)) return resp.items; // { items: [...] }
  if (Array.isArray(resp?.data?.patients)) return resp.data.patients;
  if (Array.isArray(resp?.data?.data)) return resp.data.data;
  return [];
};

// ✅ แม็พฟิลด์ให้คลุมทั้ง snake_case, camelCase, GORM
const toRows = (resp: any): PatientRow[] => {
  const raw = pickArray(resp);
  return raw.map((p: any, i: number) => ({
    id: p.id ?? p.ID ?? `row-${i}`,
    citizenID: p.citizenID ?? p.citizen_id ?? p.CitizenID ?? "", // ⬅️ เพิ่มไว้สำหรับค้นหา
    firstname: p.firstname ?? p.first_name ?? p.Firstname ?? "",
    lastname: p.lastname ?? p.last_name ?? p.Lastname ?? "",
    phonenumber: p.phonenumber ?? p.phone_number ?? p.PhoneNumber ?? "",
  }));
};

// ตรวจ id ว่าเป็น int บวก
const isPositiveInt = (v: any) => /^[1-9]\d*$/.test(String(v ?? ""));

interface PatienTableProps {
  /** ข้อความค้นหาจากหน้า List (เลขบัตรประชาชน) */
  searchTerm?: string;
}

const PatienTable: React.FC<PatienTableProps> = ({ searchTerm = "" }) => {
  const [data, setData] = useState<PatientRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, ctx] = message.useMessage();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const r = await patientAPI.getPatients(); // ได้ res.data โดยตรงแล้ว
      setData(toRows(r));
    } catch (error) {
      if(error){
        
        message.error("error.");
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== กรองด้วย citizenID (ฝั่ง client) =====
  const filteredData = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return data;
    return data.filter((r) =>
      String(r.citizenID ?? "").toLowerCase().includes(q)
    );
  }, [data, searchTerm]);

  const columns: ColumnsType<PatientRow> = [
    { title: "รหัส", dataIndex: "id", key: "id", width: 120 },
    { title: "เลขบัตรประชาชน", dataIndex: "citizenID", key: "citizenID", width: 180 }, // แสดงเพื่อให้ผู้ใช้เห็นว่ากรองจากค่านี้
    { title: "ชื่อ", dataIndex: "firstname", key: "firstname" },
    { title: "นามสกุล", dataIndex: "lastname", key: "lastname" },
    { title: "เบอร์โทรศัพท์", dataIndex: "phonenumber", key: "phonenumber" },
    {
      title: "Action",
      key: "action",
      width: 320,
      render: (_t, r) => {
        const disabled = !isPositiveInt(r.id);
        const id = r.id;
        return (
          <Space>
            <Button
              size="small"
              disabled={disabled}
              onClick={() => navigate(`initial-symptoms/${id}`)}
              style={{
                background:"#FFFDD3",
                borderRadius:"8px"
              }}
            >
              บันทึกบริการ
            </Button>

            <Button
              size="small"
              disabled={disabled}
              onClick={() => navigate(`/admin/patient/detail/${id}`)}
              style={{
                background:"#D3FFFF",
                borderRadius:"8px"
              }}
            >
              รายละเอียด
            </Button>
            
            <Popconfirm
              title="ยืนยันการลบ?"
              okText="ลบ"
              cancelText="ยกเลิก"
              onConfirm={async () => {
                if (disabled) return;
                await patientAPI.deletePatient(Number(id));
                msg.success("ลบแล้ว");
                fetchData();
              }}
            >
              <Button size="small" danger disabled={disabled}>
                ลบ
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {ctx}
      <Table
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        rowKey={(r) => String(r.id ?? `tmp-${r.firstname}-${r.lastname}`)}
        pagination={{ pageSize: 5 }}
      />
    </>
  );
};

export default PatienTable;
