import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Home from "./pages/Home.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from './components/Footer.jsx';

// --- All the features of the app ---
import AmazonScraper from "./components/AmazonScraper.jsx";
import BackgroundGeneration from "./components/BackgroundGeneration.jsx";
import BackgroundRemoval from "./components/BackgroundRemoval.jsx";
import EbayScraper from "./components/EbayScraper.jsx";
import ShopifyScraper from "./components/ShopifyScraper.jsx";
import ImageOptimization from "./components/ImageOptimization.jsx";
import Merge from "./components/Merge.jsx";
import Report from "./components/Report.jsx";

import Services from "./pages/Services.jsx";
import About from "./pages/About.jsx";
import Payment from './pages/Payment.jsx'
import Cards from './pages/Cards.jsx'
import Auth from './pages/Auth.jsx'
import Amazon from "./pages/Amazon.jsx";
import Ebay from "./pages/Ebay.jsx";
import Shopify from "./pages/Shopify.jsx";
import View from "./pages/View.jsx";
import FreeTrialNotification from "./components/FreeTrialNotification";

// --- Scroll-to-top helper ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const { user, trialDaysLeft } = useAuth();
  
  return (
    <>
      <ScrollToTop />  
      <Navbar />
      {user && <FreeTrialNotification daysLeft={trialDaysLeft} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/about" element={<About />} />
        <Route path="/amazon" element={<Amazon />} />
        <Route path="/ebay" element={<Ebay />} />
        <Route path="/shopify" element={<Shopify />} />
        <Route path="/view" element={<View />} />
      </Routes>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;