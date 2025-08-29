import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SlideInBottom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 100, opacity: 0 }} // เลื่อนลงมาจากด้านบน
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: "easeOut"}}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default SlideInBottom;