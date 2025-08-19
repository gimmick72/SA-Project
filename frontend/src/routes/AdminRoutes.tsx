import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import FullLayout from "../layout/FullLayout";

const IndexPage = Loadable(lazy(() => import("../pages/index_page/index")));
const HomeInfoPage = Loadable(lazy(() => import("../pages/home_info/index")));
const PatientInfoPage = Loadable(lazy(() => import("../pages/pateint_info/index"))); 
const TreatmentInfoPage = Loadable(lazy(() => import("../pages/treatment_info/index")));
const ScheduleInfoPage = Loadable(lazy(() => import("../pages/schedule_info/index")));
const MedicineInfoPage = Loadable(lazy(() => import("../pages/medicine_page/index")));
const StaffInfoPage = Loadable(lazy(() => import("../pages/staff_info/index")));
const QueueInfoPage = Loadable(lazy(() => import("../pages/queue_info/index")));
const PaymentInfoPage = Loadable(lazy(() => import("../pages/payment_info/index")));
const AttendanceInfoPage = Loadable(lazy(() => import("../pages/attendance_info/index")));
const ServiceInfoPage = Loadable(lazy(() => import("../pages/service_info/index")));

const AdminRoute = () => {
  const routes = useRoutes([
    {
      path: "/",
      // element: isLoggedIn ? <FullLayout /> : <IndexPage />,
      element: <IndexPage />,
    },
    {
      path: "/staff-home",
      element: <HomeInfoPage />,
    },
    {
      path: "/patient",
      element: <PatientInfoPage />,
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
  ]);

  return routes;
};

export default AdminRoute;
