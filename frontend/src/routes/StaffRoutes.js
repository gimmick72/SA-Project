import { jsx as _jsx } from "react/jsx-runtime";
import { lazy } from "react";
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
const ServiceInfoPage = Loadable(lazy(() => import("../pages/Systems/service_info/index")));
//patient routes
const AddPatient = Loadable(lazy(() => import("../pages/Systems/patient_info/AddPatientPage")));
const InitialSymptoms = Loadable(lazy(() => import("../pages/Systems/patient_info/InitialPage")));
const PatienTable = Loadable(lazy(() => import("../pages/Systems/patient_info/component_patient/table")));
const AdminRoutes = [
    {
        path: "/admin",
        element: _jsx(FullLayout, {}),
        children: [
            {
                index: true,
                element: _jsx(HomeInfoPage, {}),
            },
            {
                path: "patient", // แสดงตารางคนไข้
                element: _jsx(PatientInfoPage, {}),
            },
            {
                path: "patient/add", // แสดงฟอร์มเพิ่ม
                element: _jsx(AddPatient, {}),
            },
            {
                path: "patient/initial", // แสดงฟอร์มอาการเบื้องต้น
                element: _jsx(InitialSymptoms, {}),
            },
            {
                path: "treatment",
                element: _jsx(TreatmentInfoPage, {}),
            },
            {
                path: "schedule",
                element: _jsx(ScheduleInfoPage, {}),
            },
            {
                path: "medicine",
                element: _jsx(MedicineInfoPage, {}),
            },
            {
                path: "staff",
                element: _jsx(StaffInfoPage, {}),
            },
            {
                path: "queue",
                element: _jsx(QueueInfoPage, {}),
            },
            {
                path: "payment",
                element: _jsx(PaymentInfoPage, {}),
            },
            {
                path: "attendance",
                element: _jsx(AttendanceInfoPage, {}),
            },
            {
                path: "service",
                element: _jsx(ServiceInfoPage, {}),
            },
        ],
    },
];
export default AdminRoutes;
