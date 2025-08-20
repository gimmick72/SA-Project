// import React from "react";
// import Clock from "../../components/clock";
import MyCalendar from "./calendar";
import FullLayout from "../../layout/FullLayout";

const ScheduleInfoPage = () => {
  return (
<FullLayout>

  <div className="container"> 
    <MyCalendar/>


  </div>
</FullLayout>
  );
};

export default ScheduleInfoPage;