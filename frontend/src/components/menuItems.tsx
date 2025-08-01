import { TiHomeOutline} from "react-icons/ti";
import { FaStethoscope } from "react-icons/fa";
import { LuClipboardPen } from "react-icons/lu";
import { LuCalendar } from "react-icons/lu";
// import { BiSolidAddToQueue } from "react-icons/bi"
import { LuPill } from "react-icons/lu";;
import { MdOutlineGroup } from "react-icons/md";
import { MdPayment } from "react-icons/md";
import { RiServiceLine } from "react-icons/ri";
import { FaRegSave } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import React from "react";

export const menuItems = [
  { key: "1", icon: TiHomeOutline, label: "หน้าหลัก" },
  { key: "2", icon: LuClipboardPen, label: "ประวัติคนไข้" },
  { key: "3", icon: FaStethoscope, label: "การรักษา" },
  { key: "4", icon: LuCalendar, label: "ตารางแพทย์" },
  { key: "5", icon: LuPill , label: "เวชภัณฑ์" },
  { key: "6", icon: MdOutlineGroup, label: "บุคลากร" },
  { key: "7", icon: IoMdAddCircleOutline, label: "คิวและห้องตรวจ" },
  { key: "8", icon: MdPayment, label: "ชำระเงิน" },
  { key: "9", icon: FaRegSave , label: "บันทึกการเข้างาน" },
  { key: "10", icon: RiServiceLine, label: "บริการ" },
].map((item) => ({
  key: item.key,
  icon: <item.icon style={{ fontSize: "20px" }} />,
  label: item.label,
}));
