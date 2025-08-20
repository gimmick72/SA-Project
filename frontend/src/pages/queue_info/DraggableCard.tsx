import React from "react";
import { Card } from "antd";
import { useDrag } from "react-dnd";
import { Patient } from "./types";

interface DraggableCardProps {
  patient: Patient;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ patient }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "PATIENT",
    item: { patient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getColor = () => (patient.type === "appointment" ? "#FAAD14" : "#722ED1");

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.4 : 1 }}>
      <Card
        size="small"
        bordered={false}
        style={{
          marginBottom: 10,
          backgroundColor: getColor(),
          color: "#fff",
          fontWeight: 600,
          textAlign: "center",
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {patient.name}
      </Card>
    </div>
  );
};

export default DraggableCard;
