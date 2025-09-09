import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const NavigateHeader: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const items: TabsProps["items"] = [
    {
      key: "detail",
      label: "ข้อมูลประจำตัว",
    },
    {
      key: "history",
      label: "ประวัติการรักษา",
    },
  ];

  // เลือก tab ตาม path ปัจจุบัน
  const activeKey =
    location.pathname.includes("patient-history") ? "history" : "detail";

  const onChange = (key: string) => {
    if (!id) return;
    if (key === "detail") {
      navigate(`/admin/patient/detail/${id}?mode=view`);
    } else if (key === "history") {
      navigate(`/admin/patient/patient-history/${id}`);
    }
  };

  return (
    <Tabs
      activeKey={activeKey}
      items={items}
      onChange={onChange}
      type="line"
      size="large"
    />
  );
};

export default NavigateHeader;
