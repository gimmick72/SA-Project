import React, { useEffect, useState } from "react";
import { Row, Col, Tabs } from "antd";
import { InitialSymtoms, getTodayInitialSymptomps } from "../../../services/Dashboard/dashboardStaff";
import { Person } from "./types";
import QueueTableDentist from "./dentist/QueueTable";
import DetailCardDentist  from "./payment/DetailCard"
import QueueTableStaff from "./staff/QueueTable";
import DetailCardStaff from "./staff/DetailCard";
import AddWalkinDrawer from "./staff/Action_Button";
import ActionButtonDentist from "./payment/Action_Button";
import PaymentTab from "./payment/payment";
import DetailCardPayment from "./payment/DetailCard";
import ActionButtonPayment from "./payment/Action_Button";


const HomePage: React.FC = () => {
  const [data, setData] = useState<InitialSymtoms[]>([]);
  const [activePatient, setActivePatient] = useState<InitialSymtoms | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [list, setList] = useState<Person[]>([]);

  const fetchData = async () => {
    try {
      const res = await getTodayInitialSymptomps();
      if (res && res.symptomps && Array.isArray(res.symptomps)) {
        const items: InitialSymtoms[] = res.symptomps.map((s) => ({
          id: s.ID,
          firstName: s.Patient?.FirstName || "",
          lastName: s.Patient?.LastName || "",
          service: s.Service?.Name || "",
          status: s.Status?.Name || "",
          symptomps: s.Symptomps || "",
          systolic: s.Systolic || 0,
          diastolic: s.Diastolic || 0,
          heartrate: s.HeartRate || "",
          visit: s.Visit ? new Date(s.Visit) : new Date(),
          weight: s.Weight || 0,
          height: s.Height || 0,
          serviceID: s.ServiceID || 0,
          patientID: s.PatientID || 0,
        }));
        setData(items);
      } else {
        console.warn('No symptomps data received or invalid format');
        setData([]);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tabItems = [
    {
      key: '1',
      label: 'จัดการคนไข้',
      children: (
        <Row gutter={16}>
          <Col span={14}>
            <QueueTableStaff data={data} onSelect={(p) => setActivePatient(p)} />
          </Col>
          <Col span={10}>
            <DetailCardStaff active={activePatient} />
            <AddWalkinDrawer 
              open={openAdd}
              onClose={() => setOpenAdd(false)}
              onSubmit={(p: Person) => setList([...list, p])}
              nextId={list.length + 1}
            />
          </Col>
        </Row>
      )
    },
    {
      key: '2',
      label: 'ชำระเงิน',
      children: (
        <Row gutter={16}>
          <Col span={14}>
            <PaymentTab
              rows={list}
              onPaid={(id: number) => {
                setList(list.map(p => p.id === id ? {...p, paid: true} : p));
              }}
              onVoid={(id: number) => {
                setList(list.filter(p => p.id !== id));
              }}
            />
          </Col>
          <Col span={10}>
            <DetailCardPayment active={activePatient ? {
              ...activePatient,
              type: 'Walk-in'
            } as Person : null} />
            <ActionButtonPayment />
          </Col>
        </Row>
      )
    },
    {
      key: '3',
      label: 'แพทย์',
      children: (
        <Row gutter={16}>
          <Col span={14}>
            <QueueTableDentist data={data} onSelect={(p) => setActivePatient(p)} />
          </Col>
          <Col span={10}>
            <DetailCardDentist active={activePatient ? {
              ...activePatient,
              type: 'Walk-in'
            } as Person : null} />
            <ActionButtonDentist />
          </Col>
        </Row>
      )
    }
  ];

  return (
    <div style={{ padding: 10, marginTop: -25 }}>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default HomePage;
