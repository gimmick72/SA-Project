import React from "react";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Loadable from "../../components/third-patry/Loadable";

// patient info pages
const PatientListPage = Loadable(lazy(() => import("../../pages/Systems/patient_info/PatientList")));
const PatientDetailPage = Loadable(lazy(() => import("../../pages/Systems/patient_info/PatientDetailPage")));
const InitialSymptoms = Loadable(lazy(() => import("../../pages/Systems/patient_info/InitialPage")));
const HistoryPage = Loadable(lazy(() => import("../../pages/Systems/patient_info/HistoryPage")));
const AddPatientPage = Loadable(lazy(() => import("../../pages/Systems/patient_info/AddPatientPage")));

const PatientRoute: RouteObject[] = [
  { index: true, element: React.createElement(PatientListPage) },
  { path: "detail/:id", element: React.createElement(PatientDetailPage) },          
  { path: "initial-symptoms/:id", element: React.createElement(InitialSymptoms) },  
  { path: "patient-history/:id", element: React.createElement(HistoryPage) },
  { path: "add-patient", element: React.createElement(AddPatientPage) },
  // { path: "admin/patient", element: React.createElement(PatientListPage) },
];

export { PatientRoute };