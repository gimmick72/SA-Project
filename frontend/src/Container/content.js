import { jsx as _jsx } from "react/jsx-runtime";
import { Layout, theme } from "antd";
const { Content } = Layout;
const ContentLayout = ({ children }) => {
    const { token: { colorBgContainer }, } = theme.useToken();
    return (_jsx(Content, { style: { margin: "30px", flexGrow: 1 }, children: _jsx("div", { style: {
                padding: 24,
                height: "100%",
                background: "#FFFFFF",
                borderRadius: 20,
                border: "0.5px solid #000000",
                display: "block",
            }, children: children }) }));
};
export default ContentLayout;
