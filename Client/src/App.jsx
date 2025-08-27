import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Login from './pages/Login'
// import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import Transport from './pages/Transport'
import ForgotPassword from './pages/forgot-password'
import SellerProfile from './pages/SellerProfile' // ✅ Import SellerProfile

// Components
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Wrap all main routes in Layout */}
      <Route element={<Layout />}>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/transport" element={<Transport />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/marketplace" element={<Marketplace />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Seller Profile */}
        <Route path="/seller/:id" element={<SellerProfile />} />  {/* ✅ Add dynamic route */}

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  )
}

export default App
