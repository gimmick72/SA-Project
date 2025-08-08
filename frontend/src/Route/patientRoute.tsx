import React from "react";
import { Route } from "react-router-dom";
import PatientInfoPage from "../pages/pateint_info/index";
import AddPatientPage from "../pages/pateint_info/AddPatientPage";
import HistoryPage from "../pages/pateint_info/history";
import ContactPage from "../pages/pateint_info/contact";

// RETURN เป็น Array of <Route>
const PatientRoutes = [
  <Route key="patient" path="/patient" element={<PatientInfoPage />} />,
  <Route key="add-patient" path="/patient/add" element={<AddPatientPage />} />,
  <Route key="history" path="/patient/history" element={<HistoryPage />} />,
  <Route key="contact" path="/patient/contact" element={<ContactPage />} />
];

export default PatientRoutes;
