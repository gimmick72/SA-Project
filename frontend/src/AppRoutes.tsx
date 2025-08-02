import React from "react";
import { Routes, Route } from "react-router-dom";
import HomeInfoPage from "./pages/home_info/index"
import PatientInfoPage from "./pages/pateint_info/index";
import TreatmentInfoPage from "./pages/treatment_info/index"
import ScheduleInfoPage from "./pages/schedule_info/index"
import MedicineInfoPage from "./pages/medicine_page/index"
import StaffInfoPage from "./pages/staff_info/index"
import QueueInfoPage from "./pages/queue_info/index"
import PaymentInfoPage from "./pages/payment_info/index"
import AttendanceInfoPage from "./pages/attendance_info/index"
import ServiceInfoPage from "./pages/service_info/index"


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<HomeInfoPage />} />
      <Route path="/patient" element={<PatientInfoPage />} />
      <Route path="/treatment" element={<TreatmentInfoPage />} />
      <Route path="/schedule" element={<ScheduleInfoPage />} />
      <Route path="/medicine" element={<MedicineInfoPage />} />
      <Route path="/staff" element={<StaffInfoPage />} />
      <Route path="/queue" element={<QueueInfoPage />} />
      <Route path="/payment" element={<PaymentInfoPage />} />
      <Route path="/attendance" element={<AttendanceInfoPage />} />
      <Route path="/service" element={<ServiceInfoPage />} />

    </Routes >
  );
};

export default AppRoutes;

