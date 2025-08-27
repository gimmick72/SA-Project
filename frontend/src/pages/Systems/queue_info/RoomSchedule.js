import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, Card, Button } from "antd";
import { useDrop, useDrag } from "react-dnd";
const RoomSchedule = ({ room, onAssignPatient }) => {
    const queueCount = room.timeSlots.filter((slot) => slot.patient !== null).length;
    const findNextAvailableSlot = (currentTime) => {
        const index = room.timeSlots.findIndex(slot => slot.time === currentTime);
        if (index >= 0 && index < room.timeSlots.length - 1) {
            return room.timeSlots[index + 1].time;
        }
        return null;
    };
    const renderSlot = (slot) => {
        // ทำให้ slot เป็น draggable ถ้ามีผู้ป่วย
        const [{ isDragging }, drag] = useDrag({
            type: "PATIENT",
            item: {
                patient: slot.patient,
                fromRoomId: room.roomId,
                fromTime: slot.time
            },
            canDrag: !!slot.patient, // ลากได้เฉพาะถ้ามีผู้ป่วย
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });
        // ทำให้ slot เป็น drop target
        const [{ isOver }, drop] = useDrop({
            accept: "PATIENT",
            drop: (item) => {
                if (!item.patient)
                    return;
                // ถ้าเป็นการ์ดนัด + ช่องนี้มี walk-in → เลื่อน walk-in
                if (item.patient.type === "appointment" &&
                    slot.patient &&
                    slot.patient.type === "walkin") {
                    const nextTime = findNextAvailableSlot(slot.time);
                    if (nextTime) {
                        onAssignPatient(room.roomId, nextTime, slot.patient);
                    }
                }
                // ถ้ามาจาก slot อื่น → ลบจาก slot เดิม
                if (item.fromRoomId && item.fromTime) {
                    onAssignPatient(item.fromRoomId, item.fromTime, null);
                }
                // ใส่ลง slot ปัจจุบัน
                onAssignPatient(room.roomId, slot.time, item.patient);
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
            }),
        });
        return (_jsxs("div", { ref: (node) => drag(drop(node)), style: {
                height: 60,
                border: "1px solid #ccc",
                marginBottom: 4,
                padding: 8,
                backgroundColor: isOver ? "#e6f7ff" : "#fff",
                borderRadius: 6,
                opacity: isDragging ? 0.5 : 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: 12, marginBottom: 4 }, children: slot.time }), slot.patient && (_jsx("div", { style: {
                                backgroundColor: slot.patient.type === "appointment" ? "#FAAD14" : "#722ED1",
                                color: "#fff",
                                padding: "2px 6px",
                                borderRadius: 4,
                                fontWeight: 500,
                                fontSize: 14,
                            }, children: slot.patient.name }))] }), slot.patient && (_jsx(Button, { size: "small", danger: true, onClick: () => onAssignPatient(room.roomId, slot.time, null), children: "\u0E25\u0E1A" }))] }, slot.time));
    };
    return (_jsx(Card, { title: _jsxs("div", { children: [_jsxs("div", { style: { fontWeight: 600, marginBottom: 8 }, children: [room.roomName, " (", queueCount, " \u0E04\u0E34\u0E27)"] }), _jsxs(Select, { defaultValue: room.assignedDoctor || undefined, placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E17\u0E31\u0E19\u0E15\u0E41\u0E1E\u0E17\u0E22\u0E4C", style: { width: "100%" }, children: [_jsx(Select.Option, { value: "dr-a", children: "\u0E17\u0E31\u0E19\u0E15\u0E41\u0E1E\u0E17\u0E22\u0E4C A" }), _jsx(Select.Option, { value: "dr-b", children: "\u0E17\u0E31\u0E19\u0E15\u0E41\u0E1E\u0E17\u0E22\u0E4C B" }), _jsx(Select.Option, { value: "dr-c", children: "\u0E17\u0E31\u0E19\u0E15\u0E41\u0E1E\u0E17\u0E22\u0E4C C" }), _jsx(Select.Option, { value: "dr-d", children: "\u0E17\u0E31\u0E19\u0E15\u0E41\u0E1E\u0E17\u0E22\u0E4C D" })] })] }), style: {
            marginBottom: 24,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }, bodyStyle: { padding: 12 }, children: room.timeSlots.map(renderSlot) }));
};
export default RoomSchedule;
