import { Card, Col, Row } from "antd";
import ClinicPromo from "./ClinicPromo";
import PhotoPromo from "./PhotoPromo";


const PromoPage: React.FC = () => {
  return (
    <div>
          <Row justify="center">
            <Col xs={24} md={20} lg={18}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 24,
                  padding: 24,
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <ClinicPromo />
                  </Col>
                  <Col xs={24} md={12}>
                    <PhotoPromo />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
    </div>
  );};

  export default PromoPage;