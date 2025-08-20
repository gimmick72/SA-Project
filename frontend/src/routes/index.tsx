// import { useRoutes } from "react-router-dom";
// import AdminRoute from "./AdminRoutes";
// import HomeRoutes from "./HomeRoutes";

// function ConfigRoutes() {
// //   const isLoggedIn = localStorage.getItem("isLogin") === "true";
// //   return isLoggedIn ? <AdminRoute /> : useRoutes(HomeRoutes);

//   return useRoutes(HomeRoutes);
// }

// export default ConfigRoutes;


import { useRoutes } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import HomeRoutes from "./HomeRoutes";

function ConfigRoutes() {
  // รวม Route ทั้งหมดเข้าด้วยกัน
  const routes = [...HomeRoutes, ...AdminRoutes];

  return useRoutes(routes);
}

export default ConfigRoutes;