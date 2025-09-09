import { useRoutes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import StaffRoutes from "./StaffRoutes";
import HomeRoutes from "./HomeRoutes";

function ConfigRoutes() {
  // Combine all routes without authentication
  const routes = [
    ...HomeRoutes,
    ...StaffRoutes,
    // Catch-all route for unmatched paths
    {
      path: "*",
      element: <Navigate to="/home" replace />
    }
  ];

  return useRoutes(routes);
}

export default ConfigRoutes;
