import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import OurDentists from "./pages/OurDentistsPage/OurDentistsPage";
import Services from "./pages/Services/ServicesPage";
import ContactPage from "./pages/ContactUs/ContactUs";
//import About from "./pages/About/About";
import BookQueue from "./Route/Booking";
//import Contact from "./pages/Contact/Contact";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dentists" element={<OurDentists />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<ContactPage />} />
     {BookQueue}
    </Routes>
  );
};

export default App;
