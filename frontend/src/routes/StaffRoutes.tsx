import React from "react";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import FullLayout from "../layout/FullLayout";
import StaffDetail from "../pages/Systems/staff_info/staffData/StaffDetail";
import RequireManager from "../pages/Systems/staff_info/components/RequireManager";

const HomeInfoPage = Loadable(lazy(() => import("../pages/Systems/home_info/index")));
const PatientInfoPage = Loadable(lazy(() => import("../pages/Systems/patient_info/index")));
const TreatmentInfoPage = Loadable(lazy(() => import("../pages/Systems/treatment_info/index")));
const ScheduleInfoPage = Loadable(lazy(() => import("../pages/Systems/schedule_info/index")));
const MedicineInfoPage = Loadable(lazy(() => import("../pages/Systems/medicine_page/index")));
const StaffInfoPage = Loadable(lazy(() => import("../pages/Systems/staff_info/index")));
const QueueInfoPage = Loadable(lazy(() => import("../pages/Systems/queue_info/index")));
const PaymentRoutes = Loadable(lazy(() => import("../pages/Systems/payment_info/routes")));
const AttendanceInfoPage = Loadable(lazy(() => import("../pages/Systems/attendance_info/index")));
const ServiceInfoPage = Loadable(lazy(() => import("../pages/Systems/service_info/index")));

const PatientDetailPage = Loadable(lazy(() => import("../pages/Systems/patient_info/PatientDetailPage")));
const InitialSymptoms = Loadable(lazy(() => import("../pages/Systems/patient_info/InitialPage")));
const HistoryPage = Loadable(lazy(() => import("../pages/Systems/patient_info/HistoryPage")));
const AddPatientPage = Loadable(lazy(() => import("../pages/Systems/patient_info/AddPatientPage")));

const ManageQueue = Loadable(lazy(() => import("../pages/Systems/queue_info/manageQueue")))


// Patient routes removed - using simplified patient info page

const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <FullLayout />,
    children: [
      {
        index: true,
        element: <HomeInfoPage />,
      },
      {
        path: "patient",
        element: <PatientInfoPage />,
      },
        // children of patient
            {
              path: "patient/detail/:id",
              element: <PatientDetailPage/>,
            },
            {
              path: "patient/initial-symptoms/:id",
              element:  <InitialSymptoms/>,
            },
            {
              path: "patient/patient-history/:id",
              element:  <HistoryPage/>,
            },
            {
              path: "patient/add-patient",
              element: <AddPatientPage/>,
            },
        // children of patient
      {
        path: "treatment",
        element: <TreatmentInfoPage />,
      },
      {
        path: "schedule",
        element: <ScheduleInfoPage />,
      },
      {
        path: "medicine",
        element: <MedicineInfoPage />,
      },
      {
        path: "staff",
        element: <StaffInfoPage />,
      },
      {
        path: "PersonalData/:Employee_ID",
        element:
                <RequireManager> 
                <StaffDetail />
                </RequireManager> 
      },
      {
        path: "queue",
        element: <QueueInfoPage />,
      },
              {
                path: "queue/manage-queue",
                element: <ManageQueue/>
              },
      {
        path: "payment/*",
        element: <PaymentRoutes />,
      },
      {
        path: "attendance",
        element: <AttendanceInfoPage />,
      },
      {
        path: "service",
        element: <ServiceInfoPage />,
      },
    ],
  },
];

export default AdminRoutes;
