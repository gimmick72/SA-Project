// import React from "react";
import { BrowserRouter } from "react-router-dom";
import FullLayout from "./layout/FullLayout";
import AppRoutes from "./AppRoutes";
import "./App.css"; // Import your global styles here

const App = () => (
  <BrowserRouter>
    <FullLayout>
      <AppRoutes />
    </FullLayout>
  </BrowserRouter>
);

export default App;
