import React from 'react';
import BookingWizard from '../components/booking/BookingWizard';

export default function BookingPage({ setBookingData, setAVNumber }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <BookingWizard setBookingData={setBookingData} setAVNumber={setAVNumber} />
    </div>
  );
}
