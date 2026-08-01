import React from 'react';
import BookingWizard from '../components/booking/BookingWizard';

export default function BookingPage({ setBookingData, setAVNumber }) {
  return (
    <div className="bg-[#F5F1ED] py-5">
      <BookingWizard setBookingData={setBookingData} setAVNumber={setAVNumber} />
    </div>
  );
}
