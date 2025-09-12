import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";

// Lazy load components
const HomePage = lazy(() => import("../Home_page/First_pages/HomePage/HomePage"));
const OurDentists = lazy(() => import("../Home_page/First_pages/OurDentistsPage/OurDentistsPage"));
const Services = lazy(() => import("../Home_page/First_pages/Services/ServicesPage"));
const ContactPage = lazy(() => import("../Home_page/First_pages/ContactUs/ContactUs"));
const BookingPage = lazy(() => import("../Home_page/First_pages/booking_page/BookingPage"));

const HomePageRoutes: React.FC = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dentists" element={<OurDentists />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </div>
  );
};

export default HomePageRoutes;