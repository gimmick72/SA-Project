import { Link } from "react-router-dom";
import { Card, Layout } from 'antd';
import './yourQueue.css';
import Navbar from "../../Container/navbartop"; 

const YourQueue = () => {
  return (
    <>
    <Navbar/>
    <div style={{
        // border: `1px solid black`,
        borderRadius: "20px",
        display: "grid",
        marginLeft: "10rem",
        marginRight: "10rem",
        marginTop: "5rem",
        marginBottom: "2rem",
        fontFamily: "sans-serif",
        justifyContent: "center",
    }}>
   <Card title="นัดหมายของคุณ" variant="borderless" style={{ width: 400,border:"1px solid black"}}>
    
    <div style={{
        // backgroundColor:"#F3F3F3",
        padding: "2rem",
        borderRadius: "10px",
        margin: "2rem",
        
    }}>
    <div>
        <div>ชื่อ นามสกุล
            <div className="box">name</div>
        </div>
        <div>หมายเลขโทรศัพท์
            <div className="box">phone number</div>
        </div>
        <div>วันที่นัดหมาย
            <div className="box">date</div>
        </div>
        <div>ช่วงเวลา
            <div className="box">time</div>
        </div>
    </div>
    </div>
  </Card>
    </div>
    </>
  )
}
export default YourQueue