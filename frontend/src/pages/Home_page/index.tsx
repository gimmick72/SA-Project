import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";

// Lazy load components
const HomePage = lazy(() => import("./HomePage"));
const OurDentists = lazy(() => import("./ourDentists"));
const Services = lazy(() => import("./services"));
const ContactPage = lazy(() => import("./contactUs"));
const Booking = lazy(() => import("./booking"));

const HomePageRoutes: React.FC = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dentists" element={<OurDentists />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </div>
  );
};

export default HomePageRoutes;