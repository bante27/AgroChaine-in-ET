import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Login from './pages/Login'
// import Register from './pages/Register' // This line is correctly commented out
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import ProtectedRoute from './components/common/ProtectedRoute'
import Transport from './pages/Transport'


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/transport" element={<Transport />} />
        {/* You can add more specific service routes here as you create more service pages */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        {/* REMOVED: <Route path="/register" element={<Register />} /> */}
        <Route path="/marketplace" element={<Marketplace />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        {/* Add a catch-all route for 404 Not Found if desired */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Layout>
    // </ThemeProvider>
  )
}

export default App