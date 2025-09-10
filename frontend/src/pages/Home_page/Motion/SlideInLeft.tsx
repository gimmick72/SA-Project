import React from "react";

const SlideInLeft: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ height: "100%" }}>
      {children}
    </div>
  );
};

export default SlideInLeft;