
import { useRoutes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { lazy, useState, useEffect } from "react";
import Loadable from "../components/third-patry/Loadable";
import StaffRoutes from "./StaffRoutes";
import HomeRoutes from "./HomeRoutes";
import SuperAdminRoutes from "./SuperAdminRouter";


// Authentication Pages - inline definition to avoid module issues
const LoginPage = Loadable(lazy(() => import("../pages/Authentication/LoginPage")));
const RegisterPage = Loadable(lazy(() => import("../pages/Authentication/RegisterPage")));
const AuthenticationIndex = Loadable(lazy(() => import("../pages/Authentication/index")));


// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    // Listen for storage changes to react to logout
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case logout happens in same tab
    const interval = setInterval(() => {
      const currentAuth = localStorage.getItem('isAuthenticated') === 'true';
      if (currentAuth !== isAuthenticated) {
        setIsAuthenticated(currentAuth);
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

function ConfigRoutes() {
  // Define authentication routes inline
  const authRoutes = [
    {
      path: "/auth",
      children: [
        {
          index: true,
          element: <AuthenticationIndex />,
        },
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
      ],
    },
  ];

  // Create protected staff routes with ProtectedRoute wrapper
  const protectedStaffRoutes = StaffRoutes.map(route => ({
    ...route,
    element: <ProtectedRoute>{route.element}</ProtectedRoute>
  }));

  // Combine all routes
  const routes = [
    ...HomeRoutes,
    ...authRoutes,
    ...protectedStaffRoutes,
    ...SuperAdminRoutes,
  ];

  return useRoutes(routes);
}

export default ConfigRoutes;