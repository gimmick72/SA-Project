import React from "react";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Loadable from "../../components/third-patry/Loadable";

// patient info pages
const PatientListPage = Loadable(lazy(() => import("../../pages/Systems/patient_info/PatientList")));
const PatientDetailPage = Loadable(lazy(() => import("../../pages/Systems/patient_info/PatientDetailPage")));
const InitialSymptoms = Loadable(lazy(() => import("../../pages/Systems/patient_info/InitialPage")));
const HistoryPage = Loadable(lazy(() => import("../../pages/Systems/patient_info/HistoryPage")));
const ContactPage = Loadable(lazy(() => import("../../pages/Systems/patient_info/ContactPage")));

const PatientInfoPageRoute: RouteObject[] = [
  {
    index: true,   // default page under /admin/patient
    element: React.createElement(PatientListPage),
  },
  {
    path: "detail/:id",  // ex. /admin/patient/detail/123
    element: React.createElement(PatientDetailPage),
  },
  {
    path: "initial", // ex. /admin/patient/initial
    element: React.createElement(InitialSymptoms),
  },
  {
    path: "history/:id", // ex. /admin/patient/history/123
    element: React.createElement(HistoryPage),
  },
  {
    path: "contact/:id", // ex. /admin/patient/contact/123
    element: React.createElement(ContactPage),
  },
];

export default PatientInfoPageRoute;
