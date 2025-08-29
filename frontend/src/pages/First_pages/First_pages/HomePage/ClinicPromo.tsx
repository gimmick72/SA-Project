import React from "react";
import { Typography, Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const ClinicPromo: React.FC = () => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #d9cdefff 60%, #ebe6f4ff 100%)",
        borderRadius: 24,
        height: 500,
        width: 500,
        padding: "40px 32px 32px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        boxShadow: "0 8px 32px rgba(114,46,209,0.10)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SmileOutlined style={{ fontSize: 48, color: "#722ED1", position: "absolute", top: 32, right: 32, opacity: 0.15 }} />
      <Title level={3} style={{ color: "#722ED1", marginBottom: 12, fontWeight: 700, letterSpacing: 1 }}>
        ยิ้มสวย มั่นใจ <br />
        ไปกับทันตแพทย์มืออาชีพ
      </Title>
      <Paragraph style={{ fontSize: 18, color: "#6C3FB4", marginBottom: 32, fontWeight: 500 }}>
        บริการทันตกรรมครบวงจร ด้วยทีมงานผู้เชี่ยวชาญ<br />
        พร้อมให้คุณยิ้มได้อย่างมั่นใจ
      </Paragraph>
      <style>{`
        .booking-btn {
          background: linear-gradient(90deg, #722ED1 60%, #E01919 100%);
          border: none;
          color: #fff;
          font-weight: 600;
          font-size: 18px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(114,46,209,0.10);
          padding: 10px 32px;
          width: fit-content;
          transition: background 0.3s, transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
  outline: none !important;
  box-shadow: none !important;
        }
        .booking-btn:hover, .booking-btn:focus {
          background: linear-gradient(90deg, #E01919 0%, #722ED1 100%) !important;
          transform: scale(1.07) translateY(-2px);
          box-shadow: 0 6px 24px rgba(114,46,209,0.18) !important;
        }
        .booking-btn .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.5s linear;
          background-color: rgba(255,255,255,0.5);
          pointer-events: none;
        }
        @keyframes ripple {
          to {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
      <Button
        type="primary"
        className="booking-btn"
        size="large"
        href="#booking"
        onClick={e => {
          const btn = e.currentTarget;
          const circle = document.createElement("span");
          const diameter = Math.max(btn.clientWidth, btn.clientHeight);
          const radius = diameter / 2;
          circle.style.width = circle.style.height = `${diameter}px`;
          circle.style.left = `${e.nativeEvent.offsetX - radius}px`;
          circle.style.top = `${e.nativeEvent.offsetY - radius}px`;
          circle.className = "ripple";
          const ripple = btn.getElementsByClassName("ripple")[0];
          if (ripple) ripple.remove();
          btn.appendChild(circle);
        }}
      >
        จองคิวทันที
      </Button>
    </div>
  );
};

export default ClinicPromo;
