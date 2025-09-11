import React from "react";
import { CalendarOutlined } from "@ant-design/icons";
import MyCalendar from "../schedule_info/Calendar/calendar";
import CustomToolbar from "./Toobar/toobar";
// import SchedulePag from "../schedule_info/schedulePage"

const ScheduleInfoPage = () => {
  return (
    <div style={{
      maxWidth: '100%',
      margin: '0 auto',
      height: '100%',
      background: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      minHeight: 'calc(100vh - 128px)'
    }}>
      <MyCalendar/>
    </div>
  );
};

export default ScheduleInfoPage;
