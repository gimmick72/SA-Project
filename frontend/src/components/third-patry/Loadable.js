import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense } from "react";
import Loader from "./Loader";
const Loadable = (Component) => (props) => (_jsx(Suspense, { fallback: _jsx(Loader, {}), children: _jsx(Component, Object.assign({}, props)) }));
export default Loadable;
