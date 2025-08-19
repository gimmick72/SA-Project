import { useRoutes } from "react-router-dom";
import AdminRoute from "./AdminRoutes";
import HomeRoutes from "./HomeRoutes";

function ConfigRoutes() {
//   const isLoggedIn = localStorage.getItem("isLogin") === "true";
//   return isLoggedIn ? <AdminRoute /> : useRoutes(HomeRoutes);

  return useRoutes(HomeRoutes);
}

export default ConfigRoutes;
