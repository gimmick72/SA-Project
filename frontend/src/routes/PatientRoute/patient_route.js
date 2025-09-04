import React from "react";
import { lazy } from "react";
import Loadable from "../../components/third-patry/Loadable";
// patient info pages
const PatientListPage = Loadable(lazy(() => import("../../pages/Systems/patient_info/PatientList")));
const PatientDetailPage = Loadable(lazy(() => import("../../pages/Systems/patient_info/PatientDetailPage")));
const InitialSymptoms = Loadable(lazy(() => import("../../pages/Systems/patient_info/InitialPage")));
const HistoryPage = Loadable(lazy(() => import("../../pages/Systems/patient_info/HistoryPage")));
const AddPatientPage = Loadable(lazy(() => import("../../pages/Systems/patient_info/AddPatientPage")));
const PatientInfoPageRoute = [
    {
        index: true,
        element: React.createElement(PatientListPage),
    },
    {
        path: "detail",
        element: React.createElement(PatientDetailPage),
    },
    {
        path: "initial",
        element: React.createElement(InitialSymptoms),
    },
    {
        path: "patient-history",
        element: React.createElement(HistoryPage),
    },
    {
        path: "add-patient",
        element: React.createElement(AddPatientPage),
    },
];
export default PatientInfoPageRoute;
