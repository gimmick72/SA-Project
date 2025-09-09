import { LoadingOutlined } from "@ant-design/icons";
import "./Loader.css";

const Loader: React.FC = () => (
  <div className="loader-container">
    <LoadingOutlined
      className="loader-icon"
      spin
    />
  </div>
);

export default Loader;