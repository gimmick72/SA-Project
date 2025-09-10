import React from "react";

const SlideInRight: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ height: "100%" }}>
      {children}
    </div>
  );
};

export default SlideInRight;