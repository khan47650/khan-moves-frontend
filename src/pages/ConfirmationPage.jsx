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
  FiPhone,
  FiUser,
} from 'react-icons/fi';

export default function ConfirmationPage({ bookingData, avNumber }) {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (!bookingData || !avNumber) navigate('/');
  }, [bookingData, avNumber, navigate]);

  if (!bookingData || !avNumber) return null;

  const handleCopyReference = () => {
    navigator.clipboard.writeText(avNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalVolume = (
    bookingData.items.reduce((sum, item) => sum + (item.volume || 0) * item.quantity, 0) / 1000
  ).toFixed(2);

  const timeLabel =
    bookingData.timeSlot === 'morning'
      ? '08:00 – 12:00'
      : bookingData.timeSlot === 'afternoon'
        ? '12:00 – 17:00'
        : 'Flexible';

  const whatsappMessage = `Hi Khan Moves! I've just submitted my booking request. My AV reference number is ${avNumber}. Looking forward to your confirmation!`;
  const whatsappLink = `https://wa.me/44121555666?text=${encodeURIComponent(whatsappMessage)}`;

  const emailSubject = `Booking Confirmation - Reference ${avNumber}`;
  const emailBody = `Hi Khan Moves,\n\nI've just submitted my booking request.\n\nAV Reference: ${avNumber}\nDate: ${bookingData.date}\nTime: ${bookingData.timeSlot}\n\nLooking forward to your confirmation!\n\nBest regards,\n${bookingData.customerName}`;
  const emailLink = `mailto:info@khanmoves.co.uk?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  const steps = [
    'Team reviews your request within 2 hours',
    'Confirmation via WhatsApp or email',
    'You receive your final price & invoice',
    'Driver calls 30 mins before arrival',
  ];

  return (
    <div className="bg-linear-to-br from-gray-50 via-white to-red-50 min-h-screen py-4 px-4">
      <div className="max-w-6xl mx-auto w-full">
        {/* TOP BANNER: success + reference in one row */}
        <div className="bg-[#1a1a1a] rounded-2xl p-5 md:p-6 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-green-500/15 rounded-full p-3 shrink-0">
              <FiCheckCircle size={32} className="text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Booking Submitted!
              </h1>
              <p className="text-gray-400 text-sm">
                We've received your request and will be in touch shortly.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 flex items-center gap-4 shrink-0">
            <div>
              <p className="text-[10px] tracking-widest text-gray-400 uppercase">Reference</p>
              <p className="text-2xl font-bold text-[#F1C40F] font-mono tracking-wider">
                {avNumber}
              </p>
            </div>
            <button
              onClick={handleCopyReference}
              className="inline-flex items-center gap-2 bg-[#F1C40F] text-[#1a1a1a] font-bold text-sm px-4 py-2 rounded-lg hover:bg-yellow-300 transition shrink-0"
            >
              <FiCopy size={15} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* MOVE DETAILS */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-bold text-[#1a1a1a] mb-4">Move Details</h2>

            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-100">
              <div className="bg-red-50 p-2.5 rounded-lg shrink-0">
                <FiPackage size={20} className="text-[#C0392B]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Service</p>
                <p className="font-semibold text-[#1a1a1a] capitalize">
                  {bookingData.serviceType.replace('-', ' ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-100">
              <div className="bg-yellow-50 p-2.5 rounded-lg shrink-0">
                <FiClock size={20} className="text-[#F1C40F]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Date &amp; Time</p>
                <p className="font-semibold text-[#1a1a1a] text-sm">
                  {new Date(bookingData.date).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  <span className="text-gray-500 font-normal"> · {timeLabel}</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-50 p-2.5 rounded-lg shrink-0">
                <FiMapPin size={20} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Route</p>
                <p className="font-semibold text-[#1a1a1a] text-sm truncate">
                  {bookingData.pickup.address || bookingData.pickup.postcode}
                </p>
                <p className="text-xs text-gray-400 mb-1">{bookingData.pickup.postcode}</p>
                <p className="text-[#C0392B] text-xs font-bold">↓</p>
                <p className="font-semibold text-[#1a1a1a] text-sm truncate">
                  {bookingData.delivery.address || bookingData.delivery.postcode}
                </p>
                <p className="text-xs text-gray-400">{bookingData.delivery.postcode}</p>
              </div>
            </div>
          </div>

          {/* YOUR DETAILS */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-bold text-[#1a1a1a] mb-4">Your Details</h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <FiUser size={15} className="text-gray-400 shrink-0" />
                <span className="font-semibold text-[#1a1a1a] truncate">
                  {bookingData.customerName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiMail size={15} className="text-gray-400 shrink-0" />
                <span className="text-gray-700 truncate">{bookingData.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone size={15} className="text-gray-400 shrink-0" />
                <span className="text-gray-700">{bookingData.customerPhone}</span>
              </div>
            </div>

            {bookingData.items.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Items ({bookingData.items.length})</p>
                  <p className="text-xs font-semibold text-[#1a1a1a]">{totalVolume} m³</p>
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                  {bookingData.items.map((item) => (
                    <p key={item.name} className="text-xs text-[#1a1a1a] flex justify-between">
                      <span className="truncate pr-2">{item.name}</span>
                      <span className="text-gray-400 shrink-0">x{item.quantity}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {bookingData.specialInstructions && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="text-xs text-gray-700 line-clamp-2">
                  {bookingData.specialInstructions}
                </p>
              </div>
            )}
          </div>

          {/* NEXT + ACTIONS */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex-1">
              <h2 className="font-bold text-[#1a1a1a] mb-3">What's Next</h2>
              <ol className="space-y-2.5">
                {steps.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-gray-700">
                    <span className="bg-red-50 text-[#C0392B] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-3 gap-2">

              <a href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                className="flex items-center justify-center bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
              >
                <FiMessageCircle size={20} />
              </a>

              <a href={emailLink}
                title="Email"
                className="flex items-center justify-center bg-[#C0392B] text-white py-3 rounded-xl hover:bg-red-800 transition"
              >
                <FiMail size={20} />
              </a>

              <a href="tel:01215556666"
                title="Call 0121 555 6666"
                className="flex items-center justify-center bg-[#1a1a1a] text-white py-3 rounded-xl hover:bg-gray-800 transition"
              >
                <FiPhone size={20} />
              </a>
            </div>

            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 bg-[#F1C40F] text-[#1a1a1a] font-bold py-2.5 rounded-xl hover:bg-yellow-300 transition text-sm"
            >
              Back to Home <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}