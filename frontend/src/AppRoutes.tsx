import React from "react";
import { Routes, Route } from "react-router-dom";
import PatientInfoPage from "./pages/pateint_info/index";


const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/patient-info" element={<PatientInfoPage />} />
      </Routes>
    );
  };
  
export default AppRoutes;

