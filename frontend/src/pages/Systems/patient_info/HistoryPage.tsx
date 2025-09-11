import React from "react";
import HistoryTable from "./component_patient/historyTable";
import "./design/history.css";
import NavigateHeader from "./component_patient/header_navigate";

const HistoryPage: React.FC = () => {
  return (
    <div className="wrapper">
      <NavigateHeader />   
      <div className="header">
        <div className="content-box">
          <div className="table-section">
            <HistoryTable />
          </div>
        </div>
      </div>
    </div>
  );
};
export default HistoryPage;
