import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Row, Col, Layout } from "antd";
import QueueSidebar from "./QueueSidebar";
import RoomSchedule from "./RoomSchedule";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const { Content } = Layout;
const generateTimeSlots = () => Array.from({ length: 11 }, (_, i) => ({
    time: `${10 + i}:00`,
    patient: null,
}));
const initialRooms = [
    { roomId: "1", roomName: "ห้องตรวจ 1", assignedDoctor: null, timeSlots: generateTimeSlots() },
    { roomId: "2", roomName: "ห้องตรวจ 2", assignedDoctor: null, timeSlots: generateTimeSlots() },
    { roomId: "3", roomName: "ห้องตรวจ 3", assignedDoctor: null, timeSlots: generateTimeSlots() },
    { roomId: "4", roomName: "ห้องตรวจ 4", assignedDoctor: null, timeSlots: generateTimeSlots() },
];
const initialPatients = [
    { id: "p1", name: "คุณสมชาย", type: "walkin" },
    { id: "p2", name: "คุณสมหญิง", type: "appointment" },
    { id: "p3", name: "คุณมานะ", type: "walkin" },
    { id: "p4", name: "คุณชาวี", type: "appointment" }
];
const QueuePage = () => {
    const [patients] = useState(initialPatients);
    const [rooms, setRooms] = useState(initialRooms);
    // อัปเดตการใส่/ลบผู้ป่วยใน slot
    const handleAssignPatient = (roomId, time, patient) => {
        setRooms((prevRooms) => prevRooms.map((room) => {
            if (room.roomId !== roomId)
                return room;
            return Object.assign(Object.assign({}, room), { timeSlots: room.timeSlots.map((slot) => slot.time === time ? Object.assign(Object.assign({}, slot), { patient }) : slot) });
        }));
    };
    return (_jsx("div", { style: { display: "flex", width: "1400px", height: "620px", border: "2px solid #FFF", overflow: "hidden", }, children: _jsx(DndProvider, { backend: HTML5Backend, children: _jsx(Layout, { style: { padding: "24px", height: "620px", backgroundColor: "#FFF" }, children: _jsx(Content, { children: _jsxs(Row, { gutter: 16, children: [_jsx(Col, { xs: 24, md: 6, children: _jsx(QueueSidebar, { patients: patients }) }), _jsx("div", { style: { width: "1010px", height: "1000", border: "2px solid #FFF", backgroundColor: "#FFFFFF", borderRadius: 12, }, children: _jsx(Col, { xs: 24, md: 18, children: _jsx("div", { style: {
                                            overflowY: "auto",
                                            height: "560px",
                                            width: "990px",
                                            paddingRight: 12,
                                            border: "2px solid #FFF",
                                            backgroundColor: "#FFFFFF",
                                            borderRadius: 12,
                                        }, children: _jsx(Row, { gutter: [16, 16], children: rooms.map((room) => (_jsx(Col, { xs: 24, sm: 12, md: 12, lg: 6, children: _jsx(RoomSchedule, { room: room, onAssignPatient: handleAssignPatient }) }, room.roomId))) }) }) }) })] }) }) }) }) }));
};
export default QueuePage;
