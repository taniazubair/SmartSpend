// src/pages/LandingPage.jsx

import LandingNavbar from "../components/Landing/LandingNavbar";
import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import WhyChooseUs from "../components/Landing/WhyChooseUs";
import HowItWorks from "../components/Landing/HowItWorks";
import DashboardPreview from "../components/Landing/DashboardPreview";
import CTA from "../components/Landing/CTA";
import Footer from "../components/Landing/Footer";

function LandingPage() {
  return (
    <div className="bg-white overflow-x-hidden">
      <LandingNavbar />
      <Hero />
      <Features />
      <WhyChooseUs />
      <HowItWorks />
      <DashboardPreview />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;