import { useRoutes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import StaffRoutes from "./StaffRoutes";
import HomeRoutes from "./HomeRoutes";
import AuthRoutes from "./AuthRoutes";
import ProtectedRoute from "../components/ProtectedRoute";

function ConfigRoutes() {
  // Combine all routes with authentication
  const routes = [
    ...HomeRoutes,
    ...AuthRoutes,
    // Protected Staff Routes
    {
      path: "/admin/*",
      element: (
        <ProtectedRoute requiredRole="staff">
          {StaffRoutes.find(route => route.path === "/admin")?.element}
        </ProtectedRoute>
      ),
      children: StaffRoutes.find(route => route.path === "/admin")?.children
    },
    // Default redirect based on authentication
    {
      path: "/",
      element: <Navigate to="/home" replace />
    },
    // Catch-all route for unmatched paths
    {
      path: "*",
      element: <Navigate to="/home" replace />
    }
  ];

  return useRoutes(routes);
}

export default ConfigRoutes;
