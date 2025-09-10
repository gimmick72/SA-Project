// src/pages/queue_info/QueueSidebar.tsx
import React from "react";
import { Card, Empty } from "antd";
import { Patient } from "./types";
import DraggableCard from "./DraggableCard";

interface QueueSidebarProps {
  patients: Patient[];
  title?: string;
  maxHeight?: number | string; // ← ปรับให้รองรับ string เช่น "100%"
}

const QueueSidebar: React.FC<QueueSidebarProps> = ({
  patients,
  title = "คิวทั้งหมด",
  maxHeight = 560,
}) => {
  return (
    <Card
      title={title}
      style={{
        height: typeof maxHeight === "number" ? maxHeight : undefined,
        // ถ้าเป็น string เช่น "100%" ให้ใช้ minHeight:0 + height ผ่าน parent (index.tsx)
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        background: "#fff",
      }}
      headStyle={{ backgroundColor: "#F0EBFA", fontWeight: 600 }}
      bodyStyle={{ padding: 12, maxHeight: maxHeight, overflowY: "auto" }}
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
