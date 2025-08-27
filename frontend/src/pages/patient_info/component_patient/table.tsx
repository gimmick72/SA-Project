import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { PatientAPI } from "../../../services/https/index";
import { PersonalInfomation } from "../../../interfaces/initial_patient";

const PatienTable: React.FC = () => {
  const [data, setData] = useState<PersonalInfomation[]>([]);

  const fetchData = async () => {
    const patients = await PatientAPI.getAll();
    setData(patients);
  };

  const handleDelete = async (id: number) => {
    await PatientAPI.delete(id);
    fetchData(); // refresh table
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { title: "รหัส", dataIndex: "id", key: "id" },
    { title: "ชื่อ", dataIndex: "firstname", key: "firstname" },
    { title: "นามสกุล", dataIndex: "lastname", key: "lastname" },
    { title: "เบอร์โทรศัพท์", dataIndex: "phone_number", key: "phone_number" },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: PersonalInfomation) => (
        <div>
          <button onClick={() => handleDelete(record.id)}>ลบ</button>
        </div>
      ),
    },
  ];

  return <Table columns={columns as any} dataSource={data} rowKey={(record) => record.id} />;
};

export default PatienTable;
