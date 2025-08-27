import { jsx as _jsx } from "react/jsx-runtime";
import { TiHomeOutline } from "react-icons/ti";
import { FaStethoscope } from "react-icons/fa";
import { LuClipboardPen, LuCalendar, LuPill } from "react-icons/lu";
import { MdOutlineGroup, MdPayment } from "react-icons/md";
import { RiServiceLine } from "react-icons/ri";
import { FaRegSave } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
export const menuItems = [
    { key: "1", icon: TiHomeOutline, label: "หน้าหลัก", path: "/home" },
    { key: "2", icon: LuClipboardPen, label: "ประวัติคนไข้", path: "/patient" },
    { key: "3", icon: FaStethoscope, label: "การรักษา", path: "/treatment" },
    { key: "4", icon: LuCalendar, label: "ตารางแพทย์", path: "/schedule" },
    { key: "5", icon: LuPill, label: "เวชภัณฑ์", path: "/medicine" },
    { key: "6", icon: MdOutlineGroup, label: "บุคลากร", path: "/staff" },
    { key: "7", icon: IoMdAddCircleOutline, label: "คิวและห้องตรวจ", path: "/queue" },
    { key: "8", icon: MdPayment, label: "ชำระเงิน", path: "/payment" },
    { key: "9", icon: FaRegSave, label: "บันทึกการเข้างาน", path: "/attendance" },
    { key: "10", icon: RiServiceLine, label: "บริการ", path: "/service" },
].map((item) => ({
    key: item.key,
    icon: _jsx(item.icon, { style: { fontSize: "20px" } }),
    label: item.label,
    path: item.path,
}));
