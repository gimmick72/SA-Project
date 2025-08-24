import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";

const HomeInfoPage = Loadable(lazy(() => import("../pages/home_info/index")));

//patient info
const PatientInfoPage = Loadable(lazy(() => import("../pages/patient_info/index"))); 
const PatientListPage = Loadable(lazy(() => import("../pages/patient_info/PatientList")));
const PatientDetailPage = Loadable(lazy(() => import("../pages/patient_info/PatientDetailPage")));
const InitialSymptoms = Loadable(lazy(() => import("../pages/patient_info/InitialPage")));
const HistoryPage = Loadable(lazy(() => import("../pages/patient_info/HistoryPage")));
const ContactPage = Loadable(lazy(() => import("../pages/patient_info/ContactPage")));

const TreatmentInfoPage = Loadable(lazy(() => import("../pages/treatment_info/index")));
const ScheduleInfoPage = Loadable(lazy(() => import("../pages/schedule_info/index")));
const MedicineInfoPage = Loadable(lazy(() => import("../pages/medicine_page/index")));
const StaffInfoPage = Loadable(lazy(() => import("../pages/staff_info/index")));
const QueueInfoPage = Loadable(lazy(() => import("../pages/queue_info/index")));
const PaymentInfoPage = Loadable(lazy(() => import("../pages/payment_info/index")));
const AttendanceInfoPage = Loadable(lazy(() => import("../pages/attendance_info/index")));
const ServiceInfoPage = Loadable(lazy(() => import("../pages/service_info/index")));

const StaffRoute: RouteObject[] = [
  {
    path: "/home",
    element: <HomeInfoPage />,
  },
  {
    path: "/patient",
    element: <PatientInfoPage />, // wrapper + layout
    children: [
      { index: true, element: <PatientListPage /> }, // default แสดงตาราง
      { path: "add", element: <PatientDetailPage /> }, 
      { path: "detail", element: <PatientDetailPage /> },
      { path: "initial", element: <InitialSymptoms /> },
      { path: "patient-history", element: <HistoryPage /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },
  {
    path: "/treatment",
    element: <TreatmentInfoPage />,
  },
  {
    path: "/schedule",
    element: <ScheduleInfoPage />,
  },
  {
    path: "/medicine",
    element: <MedicineInfoPage />,
  },
  {
    path: "/staff",
    element: <StaffInfoPage />,
  },
  {
    path: "/queue",
    element: <QueueInfoPage />,
  },
  {
    path: "/payment",
    element: <PaymentInfoPage />,
  },
  {
    path: "/attendance",
    element: <AttendanceInfoPage />,
  },
  {
    path: "/service",
    element: <ServiceInfoPage />,
  },
];

export default StaffRoute;
