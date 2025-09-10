import React from "react";
import "./HomePage.css";

import OurDentistsPage from "./ourDentists/OurDentistsPage";
import ServicesPage from "./services/ServicesPage";
import ContactPage from "./contactUs/ContactUs";
import PriceGuidePage from "./priceGuide/PriceGuidePage";
import SlideInTop from "./Motion/SlideInTop";

const HomePage: React.FC = () => {
  return (
    <div className="homepage-content">
      <SlideInTop>
        <div id="home" className="homepage-section first">
          <PriceGuidePage />
        </div>
      </SlideInTop>
      <div id="dentists" className="homepage-section">
        <OurDentistsPage />
      </div>
      <div id="services" className="homepage-section">
        <ServicesPage />
      </div>
      <div id="priceguide" className="homepage-section">
        <PriceGuidePage />
      </div>
      <div id="contact" className="homepage-section">
        <ContactPage />
      </div>
    </div>
  );
};

export default HomePage;
