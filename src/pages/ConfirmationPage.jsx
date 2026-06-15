import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle,
  FiCopy,
  FiMessageCircle,
  FiMail,
  FiArrowRight,
  FiClock,
  FiMapPin,
  FiPackage,
} from 'react-icons/fi';

export default function ConfirmationPage({ bookingData, avNumber }) {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (!bookingData || !avNumber) {
      navigate('/');
    }
  }, [bookingData, avNumber, navigate]);

  if (!bookingData || !avNumber) {
    return null;
  }

  const handleCopyReference = () => {
    navigator.clipboard.writeText(avNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalVolume = (
    bookingData.items.reduce(
      (sum, item) => sum + (item.volume || 0) * item.quantity,
      0
    ) / 1000
  ).toFixed(2);

  const whatsappMessage = `Hi Khan Moves! I've just submitted my booking request. My AV reference number is ${avNumber}. Looking forward to your confirmation!`;

  const whatsappLink = `https://wa.me/44121555666?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const emailSubject = `Booking Confirmation - Reference ${avNumber}`;
  const emailBody = `Hi Khan Moves,\n\nI've just submitted my booking request.\n\nAV Reference: ${avNumber}\nDate: ${bookingData.date}\nTime: ${bookingData.timeSlot}\n\nLooking forward to your confirmation!\n\nBest regards,\n${bookingData.customerName}`;
  const emailLink = `mailto:info@khanmoves.co.uk?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 py-12 md:py-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4 animate-bounce">
              <FiCheckCircle size={48} className="text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            Booking Submitted!
          </h1>
          <p className="text-xl text-gray-600">
            We've received your booking request and will be in touch soon.
          </p>
        </div>

        {/* AV Reference Card */}
        <div className="bg-white rounded-lg border-2 border-[#C0392B] p-8 md:p-10 mb-8 shadow-lg">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm mb-2">YOUR BOOKING REFERENCE</p>
            <div className="text-5xl font-bold text-[#C0392B] tracking-wider font-mono mb-4">
              {avNumber}
            </div>
            <button
              onClick={handleCopyReference}
              className="inline-flex items-center gap-2 bg-[#F1C40F] text-[#1a1a1a] font-bold px-6 py-2 rounded-lg hover:bg-yellow-300 transition"
            >
              <FiCopy size={16} />
              {copied ? 'Copied!' : 'Copy Reference'}
            </button>
          </div>

          <p className="text-center text-gray-600 text-sm">
            Keep this reference safe. You'll need it to track your booking and for all communication with us.
          </p>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-10 mb-8">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">
            Booking Summary
          </h2>

          <div className="space-y-6">
            {/* Service Type */}
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="bg-[#C0392B] bg-opacity-10 p-3 rounded-lg shrink-0">
                <FiPackage size={24} className="text-[#C0392B]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Service Type</p>
                <p className="text-lg font-semibold text-[#1a1a1a] capitalize">
                  {bookingData.serviceType.replace('-', ' ')}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="bg-[#F1C40F] bg-opacity-20 p-3 rounded-lg shrink-0">
                <FiClock size={24} className="text-[#F1C40F]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Scheduled Date & Time</p>
                <p className="text-lg font-semibold text-[#1a1a1a]">
                  {new Date(bookingData.date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  <span className="text-gray-600 font-normal">
                    - {bookingData.timeSlot === 'morning'
                      ? '08:00-12:00'
                      : bookingData.timeSlot === 'afternoon'
                        ? '12:00-17:00'
                        : 'Flexible'}
                  </span>
                </p>
              </div>
            </div>

            {/* Locations */}
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="bg-green-100 p-3 rounded-lg shrink-0">
                <FiMapPin size={24} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-3">Moving Route</p>
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">
                      {bookingData.pickup.address}
                    </p>
                    <p className="text-sm text-gray-500">
                      {bookingData.pickup.postcode}
                    </p>
                  </div>
                  <div className="text-center">
                    <span className="text-[#C0392B] font-bold">↓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">
                      {bookingData.delivery.address}
                    </p>
                    <p className="text-sm text-gray-500">
                      {bookingData.delivery.postcode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items & Volume */}
            {bookingData.items.length > 0 && (
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg shrink-0">
                  <FiPackage size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Items to Move</p>
                  <div className="space-y-1">
                    {bookingData.items.map((item) => (
                      <p key={item.name} className="text-[#1a1a1a] font-semibold">
                        {item.name} <span className="text-gray-500 font-normal">x{item.quantity}</span>
                      </p>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Total Volume:</strong> {totalVolume} m³
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 md:p-8 mb-8">
          <h3 className="font-bold text-[#1a1a1a] mb-4">Your Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold text-[#1a1a1a]">
                {bookingData.customerName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-[#1a1a1a]">
                {bookingData.customerEmail}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-[#1a1a1a]">
                {bookingData.customerPhone}
              </p>
            </div>
            {bookingData.specialInstructions && (
              <div>
                <p className="text-sm text-gray-600">Special Instructions</p>
                <p className="font-semibold text-[#1a1a1a]">
                  {bookingData.specialInstructions}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 md:p-8 mb-8">
          <h3 className="font-bold text-[#1a1a1a] mb-4">What Happens Next?</h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-[#C0392B] shrink-0">1.</span>
              <span>
                Our team will review your booking request within 2 hours
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-[#C0392B] shrink-0">2.</span>
              <span>
                We'll send you a confirmation message via WhatsApp or email
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-[#C0392B] shrink-0">3.</span>
              <span>
                You'll receive an invoice and final price confirmation
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-[#C0392B] shrink-0">4.</span>
              <span>
                On moving day, our driver will contact you 30 minutes before arrival
              </span>
            </li>
          </ol>
        </div>

        {/* Contact Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-green-600 text-white font-bold px-6 py-4 rounded-lg hover:bg-green-700 transition"
          >
            <FiMessageCircle size={20} />
            Message on WhatsApp
          </a>
          <a
            href={emailLink}
            className="flex items-center justify-center gap-3 bg-[#C0392B] text-white font-bold px-6 py-4 rounded-lg hover:bg-red-800 transition"
          >
            <FiMail size={20} />
            Send Email
          </a>
        </div>

        {/* Direct Contact */}
        <div className="text-center">
          <p className="text-gray-600 mb-3">Or call us directly:</p>
          <a
            href="tel:01215556666"
            className="text-2xl font-bold text-[#C0392B] hover:text-red-800 transition"
          >
            0121 555 6666
          </a>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-[#F1C40F] text-[#1a1a1a] font-bold px-8 py-3 rounded-lg hover:bg-yellow-300 transition"
          >
            Back to Home <FiArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
