import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SlideInLeft: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-700px" }); // เล่นแค่ครั้งเดียว

  return (
    <motion.div
      ref={ref}
      initial={{ x: -100, opacity: 0 }} // เลื่อนจากซ้ายมือ
      animate={inView ? { x: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default SlideInLeft;