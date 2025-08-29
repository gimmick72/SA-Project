import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SlideInRight: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-700px" }); // once: true = เล่นแค่ครั้งเดียว

  return (
    <motion.div
      ref={ref}
      initial={{ x: 100, opacity: 0 }}
      animate={inView ? { x: 0, opacity: 1 } : {}} // animate เมื่อ inView
      transition={{ duration: 0.5, ease: "easeOut", delay : 0.4 }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default SlideInRight;