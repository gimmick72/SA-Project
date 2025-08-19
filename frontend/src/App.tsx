import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import FullLayout from "./layout/FullLayout";
import IndexLayout from "./layout/IndexLayout";
import ConfigRoutes from "./routes";
import "./App.css"; 

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <Router>
        <ConfigRoutes />
      </Router>
    </React.StrictMode>
  );
};

export default App;
