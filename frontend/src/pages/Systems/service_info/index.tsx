import React from "react";
import './service/service'
import AddService from "./service/service";
// FullLayout removed - now handled by route wrapper

const ServiceInfoPage = () => {
  return (
    
    <div style={{ margin: 0, padding: 0 }} className="container">
      <AddService/>
    </div>
    
  );
};

export default ServiceInfoPage;