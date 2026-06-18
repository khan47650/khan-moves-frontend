import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import SignIn from "./pages/SignIn";
import SignUp from './pages/SignUp';

function AnimatedRoutes({ bookingData, setBookingData, avNumber, setAVNumber }) {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route
        path="/booking"
        element={<BookingPage setBookingData={setBookingData} setAVNumber={setAVNumber} />}
      />
      <Route
        path="/confirmation"
        element={<ConfirmationPage bookingData={bookingData} avNumber={avNumber} />}
      />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

function Layout({ children }) {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith('/admin');
  const hideFooter = ['/signin', '/signup', '/admin'].some(p =>
    location.pathname.startsWith(p)
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!hideHeader && <Header />}

      <main className="grow">{children}</main>

      {!hideFooter && <Footer />}
    </div>
  );
}
function App() {
  const [bookingData, setBookingData] = useState(null);
  const [avNumber, setAVNumber] = useState(null);

  return (
    <Router>
      <Layout>
        <AnimatedRoutes
          bookingData={bookingData}
          setBookingData={setBookingData}
          avNumber={avNumber}
          setAVNumber={setAVNumber}
        />
      </Layout>
    </Router>
  );
}

export default App;