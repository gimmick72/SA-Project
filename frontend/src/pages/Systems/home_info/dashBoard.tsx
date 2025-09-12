import React, { useEffect, useState } from "react";
import { Row, Col, Tabs } from "antd";
import { InitialSymtoms, getTodayInitialSymptomps } from "../../../services/Dashboard/dashboardStaff";
import QueueTableDentist from "./dentist/TableDentist";
import DetailCardDentist from "./payment/DetailCard"

import QueueTableStaff from "./staff/QueueTable";
import DetailCardStaff from "./staff/DetailCard";
import ActionButtonDentist from "./dentist/Action_Button";

import ActionButtonStaff from "./staff/Action_Button";

import Payment from "./payment/payment";
import DetailCardPayment from "./payment/DetailCard";
import ActionButtonPayment from "./payment/Action_Button";
import { dentists } from './../../Home_page/First_pages/OurDentistsPage/dentistsData';


const { TabPane } = Tabs;

const HomePage: React.FC = () => {
  const [data, setData] = useState<InitialSymtoms[]>([]);
  const [activePatient, setActivePatient] = useState<InitialSymtoms | null>(null);

  const fetchData = async () => {
    try {
      const res = await getTodayInitialSymptomps();
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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: 10, marginTop: -25 }}>
      {/*component Staff */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="จัดการคนไข้" key="1">
          <Row gutter={16}>
            <Col span={14}>
              <QueueTableStaff data={data} onSelect={(p) => setActivePatient(p)} />
            </Col>
            <Col span={10}>
              <DetailCardStaff active={activePatient} />
              <ActionButtonStaff />
            </Col>
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="ชำระเงิน" key="2">
          <Row gutter={16}>
            <Col span={14}>
              <Payment />
            </Col>
            <Col span={10}>
              <DetailCardPayment active={activePatient} />
              <ActionButtonPayment />
            </Col>
          </Row>
        </Tabs.TabPane>



        {/*component Dentist */}
        <Tabs.TabPane tab="แพทย์" key="3">
          <Row gutter={16}>
            <Col span={14}>
              <QueueTableDentist data={data} onSelect={(p) => setActivePatient(p)} />
            </Col>
            <Col span={10}>
              <DetailCardDentist active={activePatient} />
              <ActionButtonDentist />
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default HomePage;
