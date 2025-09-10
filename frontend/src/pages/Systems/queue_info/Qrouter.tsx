import React, { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Loadable from "../../../components/third-patry/Loadable";

const QueuePage = Loadable(lazy(() => import("./index")));
const ManageQueue = Loadable(lazy(() => import("./manageQueue")))
const ManageQueueDashboard = Loadable(lazy(() => import("../../First_pages/First_pages/BookingPage/Dash")))

const QueueRouter: RouteObject[] = [
  { index: true, element: <QueuePage /> },
  { path: "manage-queue", element: React.createElement(ManageQueue) },
  {
    path: "manage-queue-dashboard",
    element: React.createElement(ManageQueueDashboard),
  },
];

export { QueueRouter };

