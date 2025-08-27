import { jsx as _jsx } from "react/jsx-runtime";
import { Layout, theme } from "antd";
const { Content } = Layout;
const ContentLayout = ({ children }) => {
    const { token: { colorBgContainer }, } = theme.useToken();
    return (_jsx(Content, { style: { margin: "30px", flexGrow: 1 }, children: children }));
};
export default ContentLayout;
