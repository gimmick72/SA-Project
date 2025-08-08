// src/components/PhotoPromo.tsx
import React from "react";

const PhotoPromo: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "#EFEAF7",
        borderRadius: 16,
        height: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
      }}
    >
      <img
        src="/PhotoPromo.png" // 🔁 เปลี่ยนชื่อไฟล์ตามที่คุณมี
        alt="คลินิกทันตกรรม"
        style={{
          maxHeight: "100%",
          maxWidth: "100%",
          objectFit: "contain",
          borderRadius: 12,
        }}
      />
    </div>
  );
};

export default PhotoPromo;
