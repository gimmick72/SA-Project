import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import FullLayout from "../layout/FullLayout";


const HomeInfoPage = Loadable(lazy(() => import("../pages/Systems/home_info/index")));
const PatientInfoPage = Loadable(lazy(() => import("../pages/Systems/patient_info/index"))); 
const TreatmentInfoPage = Loadable(lazy(() => import("../pages/Systems/treatment_info/index")));
const ScheduleInfoPage = Loadable(lazy(() => import("../pages/Systems/schedule_info/index")));
const MedicineInfoPage = Loadable(lazy(() => import("../pages/Systems/medicine_page/index")));
const StaffInfoPage = Loadable(lazy(() => import("../pages/Systems/staff_info/index")));
const QueueInfoPage = Loadable(lazy(() => import("../pages/Systems/queue_info/index")));
const PaymentInfoPage = Loadable(lazy(() => import("../pages/Systems/payment_info/index")));
const AttendanceInfoPage = Loadable(lazy(() => import("../pages/Systems/attendance_info/index")));

const Admin = Loadable(lazy(() => import("../pages/Systems/admin/admin")));
const Member= Loadable(lazy(() => import("../pages/Systems/member/member")));
const HomePage = Loadable(lazy(() => import("../pages/Systems/home_info/index")));
const HomeMed = Loadable(lazy(() => import("../pages/Systems/home_med/index")));


// Removed unused patient route imports - files were deleted


const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <FullLayout />,
    children: [
      {
        index: true,
        element: <Admin />,
      },
      {
        path: "member",
        element: <Member/>,
      },
      
      { path: "home", 
        element: <HomePage /> 
      },
      { path: "homeMed", 
        element: <HomeMed /> 
      },
    

    ],
  },
];

export default AdminRoutes;
