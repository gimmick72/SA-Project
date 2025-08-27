import React from "react";
import './service/service'
import AddService from "./service/service";
import FullLayout from '../../../layout/FullLayout';

const ServiceInfoPage = () => {
  return (
    <div style={{ margin: 0, padding: 0 }} className="container">
      <AddService/>
    </div>
  );
};

export default ServiceInfoPage;
