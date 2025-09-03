import { useState, useEffect } from "react";
import Service from "../Service/service";
import "./switchpage.css"
import Promotion from "../Promotion/promotion";

export default function SwitchPage() {
  const [tab, setTab] = useState("services"); // ค่าเริ่มต้นคือ "บริการ"

  return (
    <div style={{border: "2px none black", height: "550px"}} >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px', gap: '25px', border: "2px none black"      
       }}>
        <div>
          <h1 className="text-2xl font-bold mb-4 gap-4">บริการ</h1>
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
          <Service />
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
