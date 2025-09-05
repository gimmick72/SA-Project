import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./First_pages/HomePage/HomePage";
import OurDentists from "./First_pages/OurDentistsPage/OurDentistsPage";
import Services from "./First_pages/Services/ServicesPage";
import ContactPage from "./First_pages/ContactUs/ContactUs";
import AllBooking from './First_pages/booking_page/index';




const App: React.FC = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dentists" element={<OurDentists />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/allbooking" element={< AllBooking/>} />
      </Routes>
    </div>
  );
};

export default App;
