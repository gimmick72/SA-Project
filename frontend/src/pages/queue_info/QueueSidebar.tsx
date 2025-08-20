import React from "react";
import { Card } from "antd";
import { Patient } from "./types";
import DraggableCard from "./DraggableCard";

interface QueueSidebarProps {
  patients: Patient[];
}

const QueueSidebar: React.FC<QueueSidebarProps> = ({ patients }) => {
  return (
    <Card
      title="รายการคิวทั้งหมด"
      style={{
        height: "560px",
        overflowY: "auto",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
      headStyle={{ backgroundColor: "#F0EBFA", fontWeight: 600 }}
    >
      {patients.map((p) => (
        <DraggableCard key={p.id} patient={p} />
      ))}
    </Card>
  );
};

export default QueueSidebar;
