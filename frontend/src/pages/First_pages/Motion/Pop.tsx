import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Pop: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }} // เริ่มสูงกว่าและจางกว่า
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{
        duration: 0.7,    // ปรับให้ช้าลง smooth
        ease: "easeOut",
        delay: 0.3,       // หน่วงก่อนเริ่ม
      }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default Pop;