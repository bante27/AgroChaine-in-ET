import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { NotificationProvider } from './contexts/NotificationContext'; // 👈 ADD THIS

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import ForgotPassword from './pages/ForgotPassword';
import SellerProfile from './pages/SellerProfile';
import Orders from './pages/Orders';

// Context / Service Pages
import KYCVerification from './contexts/KYCVerification';
import DigitalMarketplace from './contexts/DigitalMarketplace';
import SupplyChainManagement from './contexts/SupplyChainManagement';
import PrivacyPolicy from './contexts/PrivacyPolicy';
import TermsOfService from './contexts/TermsOfService';
import CookiePolicy from './contexts/CookiePolicy';
import AgroFinancing from './contexts/AgroFinancing';
import FAQ from './contexts/FAQ';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <NotificationProvider>
      <Routes>
        <Route element={<Layout />}>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Seller Profile */}
          <Route path="/seller/:id" element={<SellerProfile />} />

          {/* Service / Context Pages */}
          <Route path="/kyc" element={<KYCVerification />} />
          <Route path="/digital-marketplace" element={<DigitalMarketplace />} />
          <Route path="/supplychain" element={<SupplyChainManagement />} />

          {/* Policy Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookie" element={<CookiePolicy />} />
          <Route path="/financing" element={<AgroFinancing />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<div className="text-center text-2xl mt-20">404 Not Found</div>} />
        </Route>
      </Routes>
    </NotificationProvider>
  );
}

export default App;