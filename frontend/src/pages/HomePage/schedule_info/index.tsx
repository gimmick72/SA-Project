import React from "react";
import MyCalendar from "./calendar";
import FullLayout from "../../layout/FullLayout";


const ScheduleInfoPage = () => {
  return (
     <FullLayout>
    <div style={{ width: '1220px', height: '550px', border: '2px solid #ffffff' }}>
      <div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '10px' }}>ปฏิทินแพทย์</div>
        <MyCalendar />
      </div>
    </div>
    </FullLayout>
  );
};

export default ScheduleInfoPage;