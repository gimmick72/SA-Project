import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
const Clock = () => {
    const [currentTime, setCurrentTime] = useState("");
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const formattedTime = now.toLocaleString("en-GB", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            setCurrentTime(formattedTime);
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    return _jsx("span", { children: currentTime });
};
export default Clock;
