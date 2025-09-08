import { useState, useEffect } from "react";
import Service from "../service/service";
import "./switchpage.css"
import Promotion from "../Promotion/promotion";
import 'antd/dist/reset.css';
import Servicecomponent from "../service/service";

export default function SwitchPage() {
  const [tab, setTab] = useState("services"); // ค่าเริ่มต้นคือ "บริการ"

  return (
    <div style={{border: "2px none black", height: "550px", marginTop: 0, paddingTop: 0}} >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px', gap: '25px', border: "2px none black", marginTop: 0, paddingTop: 0 }}>
        <div style={{ marginBottom: 0 }}>
          <h1 style={{font:'18px', fontWeight:'bold', marginLeft:'18px'}} > บริการ </h1>
        </div >

        {/* ปุ่มเปลี่ยน content */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px', gap: '10px' }}>
          <h3
            className={`cursor-pointer font-bold pb-1 ${tab === "services" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
              }`}
            onClick={() => setTab("services")}
          >
            รายการบริการ
          </h3>
          <h3
            className={`cursor-pointer font-bold pb-1 ${tab === "promotions" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
              }`}
            onClick={() => setTab("promotions")}
          >
            โปรโมชัน
          </h3>
        </div>
      </div>

      {/* Content ด้านใน */}
      {tab === "services" && (
        <div className={ `margin 0 padding 0` }>
          <Servicecomponent />
        </div>
      )}
      {tab === "promotions" && (
        <div className={ `margin 0 padding 0` }>
          <Promotion/>
        </div>
      )}
    </div>
  );
}
