import React from "react";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Loadable from "../../../../components/third-patry/Loadable";

// patient info pages
const PatientDetailPage = Loadable(lazy(() => import("../PatientDetailPage")));
const InitialSymptoms = Loadable(lazy(() => import("../InitialPage")));
const HistoryPage = Loadable(lazy(() => import("../HistoryPage")));
const AddPatientPage = Loadable(lazy(() => import("../AddPatientPage")));

const PatientRoute: RouteObject[] = [
  { path: "detail/:id", element: React.createElement(PatientDetailPage) },          
  { path: "initial-symptoms/:id", element: React.createElement(InitialSymptoms) },  
  { path: "patient-history/:id", element: React.createElement(HistoryPage) },
  { path: "add-patient", element: React.createElement(AddPatientPage) },
];

export { PatientRoute };