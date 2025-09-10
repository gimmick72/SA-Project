import { useRoutes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import StaffRoutes from "./StaffRoutes";
import HomeRoutes from "./HomeRoutes";
import AuthRoutes from "./AuthRoutes";
import ProtectedRoute from "../components/ProtectedRoute";

function ConfigRoutes() {
  // Combine all routes with proper structure
  const routes = [
    // Home routes (public)
    ...HomeRoutes,
    
    // Auth routes (public)
    ...AuthRoutes,
    
    // Protected Staff Routes - wrap each admin route with protection
    ...StaffRoutes.map(route => ({
      ...route,
      element: (
        <ProtectedRoute requiredRole="staff">
          {route.element}
        </ProtectedRoute>
      )
    })),
    
    // Catch-all route for unmatched paths
    {
      path: "*",
      element: <Navigate to="/home" replace />
    }
  ];

  return useRoutes(routes);
}

export default ConfigRoutes;
