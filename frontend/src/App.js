import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ConfigRoutes from "./routes";

const App = () => {
    return (_jsx(React.StrictMode, { children: _jsx(Router, { children: _jsx(ConfigRoutes, {}) }) }));
};
export default App;
