import React from "react";
import { Card, Empty } from "antd";
import { Patient } from "./types";
import DraggableCard from "./DraggableCard";

interface QueueSidebarProps {
  patients: Patient[];
  title?: string;
  maxHeight?: number; // ใช้แทน hardcode 560
}

const QueueSidebar: React.FC<QueueSidebarProps> = ({
  patients,
  title = "รายการคิวทั้งหมด",
  maxHeight = 560,
}) => {
  return (
    <Card
      title={title}
      style={{
        height: maxHeight,
        overflowY: "auto",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        background: "#fff",
      }}
      headStyle={{ backgroundColor: "#F0EBFA", fontWeight: 600 }}
      bodyStyle={{ padding: 12 }}
    >
      {patients.length === 0 ? (
        <Empty description="ยังไม่มีคิว" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        patients.map((p) => <DraggableCard key={p.id} patient={p} />)
      )}
    </Card>
  );
};

export default QueueSidebar;
