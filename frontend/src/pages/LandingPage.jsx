// src/pages/LandingPage.jsx

import LandingNavbar from "../components/LandingNavbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWorks from "../components/HowItWorks";
import DashboardPreview from "../components/DashboardPreview";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

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