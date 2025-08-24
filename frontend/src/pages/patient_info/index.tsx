import React from "react";
import { Outlet } from "react-router-dom";
import FullLayout from "../../layout/FullLayout";

const PatientInfoPage = () => {
  return (
    <FullLayout>
      <Outlet />
    </FullLayout>
  );
};

export default PatientInfoPage;
