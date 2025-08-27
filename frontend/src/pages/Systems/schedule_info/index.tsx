import React from "react";
import MyCalendar from "./calendar";
// FullLayout removed - now handled by route wrapper


const ScheduleInfoPage = () => {
  return (
     
    <div style={{ width: '1220px', height: '550px', border: '2px solid #ffffff' }}>
      <div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '10px' }}>ปฏิทินแพทย์</div>
        <MyCalendar />
      </div>
    </div>
    
  );
};

export default ScheduleInfoPage;