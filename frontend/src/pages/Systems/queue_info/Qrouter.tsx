import React, { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Loadable from "../../../components/third-patry/Loadable";

const QueuePage = Loadable(lazy(() => import("./index")));
const ManageQueue = Loadable(lazy(() => import("./manageQueue")))

const QueueRouter: RouteObject[] = [
  
      { index: true, element: <QueuePage /> }, 
      { path: "manage-queue", element:React.createElement(ManageQueue) }, 

];

export { QueueRouter };

