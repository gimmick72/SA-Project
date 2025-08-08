import React from "react";
import { Route } from "react-router-dom";
import Booking from "../pages/Booking/index";
import Select from "../pages/Booking/Booking";
import YourQueue from "../pages/Booking/yourQueue";

// RETURN เป็น Array of <Route>
const PatientRoutes = [
  <Route key="booking" path="/booking" element={<Booking />} />,
  <Route key="select" path="/booking/select-queue" element={<Select />} />,
  <Route key="yourQueue" path="/booking/your-queue" element={<YourQueue />} />,
];

export default PatientRoutes;
