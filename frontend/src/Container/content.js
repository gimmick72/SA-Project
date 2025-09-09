import { jsx as _jsx } from "react/jsx-runtime";
import { Layout, theme } from "antd";
const { Content } = Layout;
const ContentLayout = ({ children }) => {
    const { token: { colorBgContainer }, } = theme.useToken();
    return (_jsx(Content, {
        style: {
            margin: "30px",
            flexGrow: 1,
            background: "#ffffff",
            height: '100%',
            padding: 24,
            border: "0.5px solid #000000",
            borderRadius: 20,
        },
        children: children
    }));
};
export default ContentLayout;