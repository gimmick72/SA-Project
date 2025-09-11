import React, { useEffect, useMemo, useState } from "react";
import { Table, Typography, Button, Space, Drawer, Descriptions, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPatientHistory } from "../../../../services/Patient/patient";
import dayjs from "dayjs";

const { Title, Text } = Typography;

type Treatment = {
  id: number;
  name: string;
  price?: number;
  tooth?: string;
  note?: string;
};
type CaseData = {
  id: number;
  created_at?: string;
  visitDate?: string;
  diagnosis?: string;
  totalCost?: number;
  Dentist?: { firstname?: string; lastname?: string };
  Treatments?: Treatment[];
  Patient?: { firstname?: string; lastname?: string };
};

type ResponseCases = { data: CaseData[] };

type Row = {
  key: React.Key;
  id: number;
  visitDate: string;
  dentistName: string;
  diagnosis: string;
  totalCost?: number;
  treatmentsCount: number;
  raw: CaseData;
};

const HistoryTable: React.FC = () => {
  const { id } = useParams(); // patientID จาก route
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState<string>("");
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [activeCase, setActiveCase] = useState<CaseData | null>(null);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const cases = await fetchPatientHistory(id);
      // fetchPatientHistory returns PatientHistory[] directly, not wrapped in data

      // Set patient name - we'll need to fetch patient info separately since history doesn't include it
      setPatientName("ผู้ป่วย"); // Default name, could be improved by fetching patient details

      const list = cases.map<Row>((c, i) => {
        const d = c.visit_date || c.created_at || "";
        const visitDate = d ? dayjs(d).format("YYYY-MM-DD HH:mm") : "-";
        const dentistName = c.doctor || "-";

        return {
          key: i,
          id: c.id,
          visitDate,
          dentistName,
          diagnosis: c.diagnosis || "-",
          totalCost: 0, // PatientHistory doesn't have cost info
          treatmentsCount: 1, // Default to 1 since we have treatment info
          raw: c as any, // Cast to match CaseData interface
        };
      });

      list.sort((a, b) => dayjs(b.visitDate).valueOf() - dayjs(a.visitDate).valueOf());
      setRows(list);
    } catch (err) {
      console.error("[GET] /api/case-data/:id error =", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const columns: ColumnsType<Row> = useMemo(
    () => [
      {
        title: "วันที่เข้ารับการรักษา",
        dataIndex: "visitDate",
        width: 200,
        sorter: (a, b) =>
          dayjs(a.visitDate).valueOf() - dayjs(b.visitDate).valueOf(),
      },
      { title: "บริการ", dataIndex: "service",width: 180},
      { title: "ทันตแพทย์", dataIndex: "dentistName", width: 180 },
     
      {
        title: "รายละเอียด",
        key: "action",
        fixed: "right",
        width: 180,
        render: (_: any, record: Row) => (
          <Space>
            <Button
              onClick={() => {
                setActiveCase(record.raw);
                setOpen(true);
              }}
            >
              ดูรายละเอียด
            </Button>
          </Space>
        ),
      },
    ],
    [navigate]
  );

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
      <Table<Row>
        rowKey="key"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        scroll={{ x: 900 }}
      />
      <Drawer
        title="รายละเอียดเคส"
        placement="right"
        width={520}
        onClose={() => setOpen(false)}
        open={open}
      >
        {activeCase ? (
          <>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="วันที่">
                {activeCase.visitDate
                  ? dayjs(activeCase.visitDate).format("YYYY-MM-DD HH:mm")
                  : activeCase.created_at
                  ? dayjs(activeCase.created_at).format("YYYY-MM-DD HH:mm")
                  : "-"
                }
              </Descriptions.Item>
              <Descriptions.Item label="ทันตแพทย์">
                {activeCase.Dentist
                  ? `${activeCase.Dentist.firstname ?? ""} ${activeCase.Dentist.lastname ?? ""}`.trim()
                  : "-"
                }
              </Descriptions.Item>

            </Descriptions>

            <Typography.Title level={5} style={{ marginTop: 16 }}>รายการรักษา</Typography.Title>
            <Table<Treatment>
              rowKey={(r)=> String(r.id)}
              size="small"
              dataSource={activeCase.Treatments ?? []}
              pagination={false}
              columns={[
                { title: "หัตถการ", dataIndex: "name" },
                { title: "ซี่ฟัน", dataIndex: "tooth", width: 90 },
                { title: "หมายเหตุ", dataIndex: "note" },
                { title: "ราคา (บาท)", dataIndex: "price", width: 120, align: "right",
                  render: (v?:number)=> v!=null ? v.toLocaleString() : "-" },
              ]}
            />
          </>
        ) : <Text type="secondary">ไม่พบข้อมูลเคส</Text>}
      </Drawer>
      </div>
    </>
  );
};

export default HistoryTable;
