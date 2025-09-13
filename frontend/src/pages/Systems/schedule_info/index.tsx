import React from "react";
import { CalendarOutlined } from "@ant-design/icons";
import MyCalendar from "../schedule_info/Calendar/calendar";
import CustomToolbar from "./Toobar/toobar";
// import SchedulePag from "../schedule_info/schedulePage"

const ScheduleInfoPage = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-mb-24">
        <h2 className="admin-page-title">
          <CalendarOutlined style={{ marginRight: '8px' }} />
          ระบบจัดการตารางงาน
        </h2>
      </div>
      <MyCalendar/>
    </div>
  );
};

export default ScheduleInfoPage;
