import React from "react";
import { Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

const ClinicPromo: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "#EFEAF7",
        borderRadius: 16,
        height: 250,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Title level={4} style={{ color: "#722ED1" }}>
        ยิ้มสวย มั่นใจ <br />
        ไปกับทันตแพทย์มืออาชีพ
      </Title>
      <Paragraph style={{ fontSize: 16 }}>
        บริการทันตกรรมครบวงจร ด้วยทีมงานผู้เชี่ยวชาญ พร้อมให้คุณยิ้มได้อย่างมั่นใจ
      </Paragraph>
      <Button type="primary" style={{ backgroundColor: "#722ED1", borderColor: "#722ED1", width: "fit-content" }}>
        จองคิวทันที
      </Button>
    </div>
  );
};

export default ClinicPromo;
