import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';

function AnimatedRoutes({ bookingData, setBookingData, avNumber, setAVNumber }) {
  const location = useLocation();


  return (
    <Routes location={location}>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route
        path="/booking"
        element={
          <BookingPage
            setBookingData={setBookingData}
            setAVNumber={setAVNumber}
          />
        }
      />
      <Route
        path="/confirmation"
        element={
          <ConfirmationPage
            bookingData={bookingData}
            avNumber={avNumber}
          />
        }
      />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  );
}

function App() {
  const [bookingData, setBookingData] = useState(null);
  const [avNumber, setAVNumber] = useState(null);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />

        {/* Page Content */}
        <main className="grow">
          <AnimatedRoutes
            bookingData={bookingData}
            setBookingData={setBookingData}
            avNumber={avNumber}
            setAVNumber={setAVNumber}
          />
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;