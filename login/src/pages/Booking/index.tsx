import { Link } from "react-router-dom";
import { Card } from "antd";
import Navbar from "../../Container/navbartop";

const { Meta } = Card;

const Booking = () => {
  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "2rem",
          borderRadius: "20px",
          display: "grid",
          placeItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "3rem",
          }}
        >
          คุณต้องการทำอะไร
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "2rem",
            top: "50%",
          }}
        >
          <Link to="/booking/select-queue">
            <Card
              hoverable
              style={{ width: 300, height: 400, marginRight: "2rem" }}
              cover={
                <img
                  alt="example"
                  src="https://tse3.mm.bing.net/th/id/OIP.MHcgIR-4n7KYqKvFE3hp0QHaE7?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3"
                />
              }
            >
              <Meta title="จัดฟัน" description="dhjsgdhgsj" />
            </Card>
          </Link>
          <Link to="/booking/select-queue">
            <Card
              hoverable
              style={{ width: 300, height: 400, marginRight: "2rem" }}
              cover={
                <img
                  alt="example"
                  src="https://tse3.mm.bing.net/th/id/OIP.MHcgIR-4n7KYqKvFE3hp0QHaE7?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3"
                />
              }
            >
              <Meta title="จัดฟัน" description="dhjsgdhgsj" />
            </Card>
          </Link>

          <Link to="/booking/select-queue">
            <Card
              hoverable
              style={{ width: 300, height: 400 }}
              cover={
                <img
                  alt="example"
                  src="https://tse3.mm.bing.net/th/id/OIP.MHcgIR-4n7KYqKvFE3hp0QHaE7?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3"
                />
              }
            >
              <Meta title="จัดฟัน" description="dhjsgdhgsj" />
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
};
export default Booking;
