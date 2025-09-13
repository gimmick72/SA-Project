// src/components/PhotoPromo.tsx
import React from "react";


const PhotoPromo: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "#F5F2F9", //"#EFEAF7"
        borderRadius: 16,
        height: 500,
        width: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 12
      }}
    >
      <img
        src="/src/assets/clinic.jpeg"
        alt="คลินิกทันตกรรม"
        style={{
          maxHeight: "100%",
          maxWidth: 500,
          objectFit: "contain",
          borderRadius: 12,
        }}
      />
    </div>
  );
};

export default PhotoPromo;
