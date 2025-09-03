import { jsx as _jsx } from "react/jsx-runtime";
import { TiHomeOutline } from "react-icons/ti";
import { FaStethoscope } from "react-icons/fa";
import { LuClipboardPen, LuCalendar, LuPill } from "react-icons/lu";
import { MdOutlineGroup, MdPayment } from "react-icons/md";
import { RiServiceLine } from "react-icons/ri";
import { FaRegSave } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
export const menuItems = [
    { key: "1", icon: TiHomeOutline, label: "Admin", path: "/admin" },
    { key: "2", icon: LuClipboardPen, label: "Member", path: "/admin/member" },

].map((item) => ({
    key: item.key,
    icon: _jsx(item.icon, { style: { fontSize: "20px" } }),
    label: item.label,
    path: item.path,
}));
