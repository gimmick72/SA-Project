import { Link } from "react-router-dom";
import { Calendar, theme } from "antd";
import type { CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import "./booking.css";
import { Outlet } from "react-router-dom";
const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
  console.log(value.format("YYYY-MM-DD"), mode);
};

const BookingPage = () => {

  
  // const { token } = theme.useToken();

  // const wrapperStyle: React.CSSProperties = {
  //   width: 300,
  //   border: `1px solid ${token.colorBorderSecondary}`,
  //   borderRadius: token.borderRadiusLG,
  // };

  return (

    <div>sdjfsfdskdfjsk</div>
    // <>
    
    //   <div
    //     style={{
    //       minHeight: "70vh",
    //       padding: "2rem",
    //       border: `1px solid black`,
    //       borderRadius: "20px",
    //       display: "grid",
    //       marginLeft: "10rem",
    //       marginRight: "10rem",
    //       marginTop: "2rem",
    //       marginBottom: "2rem",
    //       fontFamily: "sans-serif",
    //       // backgroundColor:" #FDFAFF"
    //     }}
    //   >
    //     <div
    //       style={{
    //         display: "flex",
    //         justifyContent: "space-between",
    //         paddingLeft: "2rem",
    //       }}
    //     >
    //       <div>
    //         <h1>เลือกวันและเวลา</h1>
    //         <p>
    //           Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolores,
    //           vel.
    //         </p>
    //         <br />
    //         <div>
    //           <h1>Day</h1>
    //           <button className="time-button">time</button>
    //           <button className="time-button">time</button>

    //           <div
    //             style={{
    //               width: "300px",
    //               height: "100px",
    //               margin: "2rem",
    //               border: "1px solid #000",
    //               borderRadius: "20px",
    //               textAlign: "center",
    //               alignContent: "center",
    //             }}
    //           >
    //             status
    //           </div>
    //         </div>
    //         <Link to="/booking/your-queue">
    //           <button className="booking-button">จองคิว</button>
    //         </Link>
    //       </div>

    //       <div
    //         style={{
    //           marginTop: "2rem",
    //           width: "40%",
    //           height: "350px",
    //           // border: `1px solid black`,
    //           borderRadius: "20px",
    //           padding: "1rem",
    //         }}
    //       >
    //         <Calendar fullscreen={false} onPanelChange={onPanelChange} />
    //       </div>
    //       <div></div>
    //     </div>
    //     <button className="back-button">ย้อนกลับ</button>
    //   </div>
    // </>
  );
};
export default BookingPage;