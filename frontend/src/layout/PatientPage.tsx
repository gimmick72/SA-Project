// components/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import from "../HomePage/HomePage"

const PatientPage = () => {
  return (
    <div>
      <header>แถบเมนูหรือ Header</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PatientPage;
