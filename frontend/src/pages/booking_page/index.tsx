import { Link } from "react-router-dom";
import Card from "antd/es/card";
const { Meta } = Card;

const BookingPage = () => {
  return (
    <>
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

        <Link to="/booking/queue">
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
    </>
  );
};
export default BookingPage; 