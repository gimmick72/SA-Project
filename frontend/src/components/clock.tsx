import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm:ss"));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="text-xl font-semibold text-black">
      {currentTime}
    </span>
  );
};

export default Clock;
