import { jsx as _jsx } from "react/jsx-runtime";
import './service/service';
import AddService from "./service/service";
const ServiceInfoPage = () => {
    return (_jsx("div", { style: { margin: 0, padding: 0 }, className: "container", children: _jsx(AddService, {}) }));
};
export default ServiceInfoPage;
