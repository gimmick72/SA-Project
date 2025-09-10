import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import FullLayout from "../layout/FullLayout";

const HomeInfoPage = Loadable(lazy(() => import("../pages/Systems/home/home_info")));
const PatientInfoPage = Loadable(lazy(() => import("../pages/Systems/patient_info/index"))); 
const TreatmentInfoPage = Loadable(lazy(() => import("../pages/Systems/treatment_info/index")));
const ScheduleInfoPage = Loadable(lazy(() => import("../pages/Systems/schedule_info/index")));
const MedicineInfoPage = Loadable(lazy(() => import("../pages/Systems/medicine_page/index")));
const StaffInfoPage = Loadable(lazy(() => import("../pages/Systems/staff_info/index")));
const QueueInfoPage = Loadable(lazy(() => import("../pages/Systems/queue_info/index")));
const PaymentRoutes = Loadable(lazy(() => import("../pages/Systems/payment_info/routes")));
const AttendanceInfoPage = Loadable(lazy(() => import("../pages/Systems/attendance_info/index")));
const ServiceInfoPage = Loadable(lazy(() => import("../pages/Systems/service_info/index")));

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
        path: "queue",
        element: <QueueInfoPage />,
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
