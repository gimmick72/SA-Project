import React from "react";
import './Service/service'
import FullLayout from '../../../layout/FullLayout';
import SwitchPage from "./SwitchPage/switchpage";

const ServiceInfoPage = () => {
  return (
    <FullLayout>
    <div style={{ margin: 0, padding: 0 }} className="container"> <SwitchPage/> </div>
    </FullLayout>
  );
};

export default ServiceInfoPage;