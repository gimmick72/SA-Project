import React, { useState } from "react";
import { Row, Col, Layout } from "antd";
import QueueSidebar from "./QueueSidebar";
import RoomSchedule from "./RoomSchedule";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Patient, RoomScheduleData } from "./types";

const { Content } = Layout;

const generateTimeSlots = () =>
  Array.from({ length: 11 }, (_, i) => ({
    time: `${10 + i}:00`,
    patient: null,
  }));

const initialRooms: RoomScheduleData[] = [
  { roomId: "1", roomName: "ห้องตรวจ 1", assignedDoctor: null, timeSlots: generateTimeSlots() },
  { roomId: "2", roomName: "ห้องตรวจ 2", assignedDoctor: null, timeSlots: generateTimeSlots() },
  { roomId: "3", roomName: "ห้องตรวจ 3", assignedDoctor: null, timeSlots: generateTimeSlots() },
  { roomId: "4", roomName: "ห้องตรวจ 4", assignedDoctor: null, timeSlots: generateTimeSlots() },
];

const initialPatients: Patient[] = [
  { id: "p1", name: "คุณสมชาย", type: "walkin" },
  { id: "p2", name: "คุณสมหญิง", type: "appointment" },
  { id: "p3", name: "คุณมานะ", type: "walkin" },
  { id: "p4", name: "คุณชาวี", type: "appointment" }
];

const QueuePage: React.FC = () => {
  const [patients] = useState(initialPatients);
  const [rooms, setRooms] = useState(initialRooms);

  // อัปเดตการใส่/ลบผู้ป่วยใน slot
  const handleAssignPatient = (
    roomId: string,
    time: string,
    patient: Patient | null
  ) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.roomId !== roomId) return room;
        return {
          ...room,
          timeSlots: room.timeSlots.map((slot) =>
            slot.time === time ? { ...slot, patient } : slot
          ),
        };
      })
    );
  };

  return (
    <div style={{ display:"flex",width: "1400px", height: "620px", border: "2px solid #FFF", overflow: "hidden", }}>
      <DndProvider backend={HTML5Backend}>
        <Layout style={{ padding: "24px", height: "620px", backgroundColor: "#FFF" }}>
          <Content>
            <Row gutter={16}>
              {/* Sidebar แสดงคิวทั้งหมด */}
              <Col xs={24} md={6}>
                <QueueSidebar patients={patients} />
              </Col>

              {/* ส่วนของห้องตรวจ - Scroll แนวตั้ง */}
              <div style={{width:"1010px",height:"1000", border: "2px solid #FFF", backgroundColor: "#FFFFFF",borderRadius: 12,}}>
                <Col xs={24} md={18}>
                  <div
                    style={{
                      overflowY: "auto",
                      height: "560px",
                      width: "990px",
                      paddingRight: 12,
                      border: "2px solid #FFF",
                      backgroundColor: "#FFFFFF",
                      borderRadius: 12,
                    }}
                  >
                    <Row gutter={[16, 16]}>
                      {rooms.map((room) => (
                        <Col key={room.roomId} xs={24} sm={12} md={12} lg={6}>
                          <RoomSchedule
                            room={room}
                            onAssignPatient={handleAssignPatient}
                          />
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Col>
              </div>
            </Row>
          </Content>
        </Layout>
      </DndProvider>
    </div>
  );
};

export default QueuePage;
