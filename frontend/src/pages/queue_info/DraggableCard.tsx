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

  const bg = patient.type === "appointment" ? "#FAAD14" : "#722ED1";

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
        userSelect: "none",
      }}
      aria-grabbed={isDragging}
      role="button"
    >
      <Card
        size="small"
        bordered={false}
        style={{
          marginBottom: 10,
          backgroundColor: bg,
          color: "#fff",
          fontWeight: 600,
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "left",
        }}
        bodyStyle={{ padding: "8px 10px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 8,
          }}
          title={patient.name}
        >
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {patient.name}
            {patient.caseCode ? `  #${patient.caseCode}` : ""}
          </div>
          {typeof patient.durationMin === "number" && patient.durationMin > 0 && (
            <span style={{ fontWeight: 500, fontSize: 12, opacity: 0.9 }}>
              {patient.durationMin}′
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DraggableCard;
