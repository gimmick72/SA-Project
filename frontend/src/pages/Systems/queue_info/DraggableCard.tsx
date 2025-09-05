import React from "react";
import { Card } from "antd";
import { useDrag } from "react-dnd";
import { Patient } from "./types";

export default function DraggableCard({ patient }: { patient: Patient }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "PATIENT",
    item: { patient },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }), [patient]);

  const bg = patient.type === "appointment" ? "#FAAD14" : "#722ED1";

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.4 : 1, cursor: "grab" }}>
      <Card size="small" bordered={false} style={{ marginBottom: 8, background: bg, color: "#fff", borderRadius: 8 }}>
        <b>{patient.name}</b>{patient.caseCode ? `  #${patient.caseCode}` : ""}
      </Card>
    </div>
  );
}
