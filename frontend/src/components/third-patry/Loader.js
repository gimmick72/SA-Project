import { jsx as _jsx } from "react/jsx-runtime";
import { LoadingOutlined } from "@ant-design/icons";
const Loader = () => (_jsx("div", { style: {
        position: "fixed",
        top: "50%",
        left: "50%",
        zIndex: 2000,
        width: "100%",
        height: "100%",
    }, children: _jsx(LoadingOutlined, { style: {
            fontSize: 100,
            color: "#180731",
        }, spin: true }) }));
export default Loader;
