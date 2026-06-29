import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle, FiCopy, FiMessageCircle, FiMail, FiArrowRight,
  FiClock, FiMapPin, FiPackage, FiPhone, FiUser, FiNavigation,
} from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function ConfirmMap({ pickupLat, pickupLng, deliveryLat, deliveryLng, distance }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [routeCoords, setRouteCoords] = useState([]);

  const pickupIcon = L.divIcon({
    html: `<div style="background:#C0392B;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"><span style="transform:rotate(45deg);font-size:12px;line-height:1">🚛</span></div>`,
    className: '', iconSize: [28, 28], iconAnchor: [14, 28],
  });
  const deliveryIcon = L.divIcon({
    html: `<div style="background:#27AE60;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"><span style="transform:rotate(45deg);font-size:12px;line-height:1">🏠</span></div>`,
    className: '', iconSize: [28, 28], iconAnchor: [14, 28],
  });

  useEffect(() => {
    if (!pickupLat || !deliveryLat) return;
    fetch(`https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${deliveryLng},${deliveryLat}?overview=full&geometries=geojson`)
      .then(r => r.json())
      .then(json => {
        if (json.routes?.[0]) {
          setRouteCoords(json.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]));
        }
      }).catch(() => { });
  }, [pickupLat, deliveryLat]);

  useEffect(() => {
    if (!pickupLat || !deliveryLat || !mapRef.current) return;
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: false, scrollWheelZoom: false })
        .setView([(pickupLat + deliveryLat) / 2, (pickupLng + deliveryLng) / 2], 9);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OSM', maxZoom: 19,
      }).addTo(mapInstance.current);
    }
    const map = mapInstance.current;
    map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });
    L.marker([pickupLat, pickupLng], { icon: pickupIcon }).bindPopup('Pickup').addTo(map);
    L.marker([deliveryLat, deliveryLng], { icon: deliveryIcon }).bindPopup('Delivery').addTo(map);
    if (routeCoords.length > 0) {
      L.polyline(routeCoords, { color: '#2980B9', weight: 5, opacity: 0.85 }).addTo(map);
    } else {
      L.polyline([[pickupLat, pickupLng], [deliveryLat, deliveryLng]], {
        color: '#2980B9', weight: 4, dashArray: '8,5', opacity: 0.7,
      }).addTo(map);
    }
    map.fitBounds(
      L.latLngBounds([[pickupLat, pickupLng], [deliveryLat, deliveryLng]]),
      { padding: [28, 28] }
    );
  }, [pickupLat, pickupLng, deliveryLat, deliveryLng, routeCoords]);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ isolation: 'isolate' }}>
      <div ref={mapRef} style={{ height: '180px', width: '100%' }} className="bg-gray-100" />
      <div className="bg-[#F9F8F6] px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#C0392B]" /> Pickup
          </span>
          <span className="text-gray-300">→</span>
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#27AE60]" /> Delivery
          </span>
        </div>
        {distance > 0 && (
          <span className="text-xs font-black text-[#C0392B]">{distance} miles</span>
        )}
      </div>
    </div>
  );
}

export default function ConfirmationPage({ bookingData, avNumber }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!bookingData || !avNumber) navigate('/');
  }, [bookingData, avNumber, navigate]);

  if (!bookingData || !avNumber) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(avNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timeLabel = {
    early: '6:00 AM – 6:00 PM',
    morning: '8:00 AM – 6:00 PM',
    afternoon: '9:00 AM – 4:00 PM',
    flexible: 'Flexible',
  }[bookingData.timeSlot] || bookingData.timeSlot || 'TBC';

  const pickupLat = bookingData.pickup?.lat;
  const pickupLng = bookingData.pickup?.lng;
  const deliveryLat = bookingData.delivery?.lat;
  const deliveryLng = bookingData.delivery?.lng;
  const hasCoords = pickupLat && deliveryLat;
  const distance = bookingData.distance || 0;

  const whatsappMsg = `Hi Khan Moves! My booking reference is ${avNumber}. Looking forward to your confirmation!`;
  const whatsappLink = `https://wa.me/441215556666?text=${encodeURIComponent(whatsappMsg)}`;
  const emailSubject = `Booking Reference ${avNumber}`;
  const emailBody = `Hi Khan Moves,\n\nMy booking reference is ${avNumber}.\nDate: ${bookingData.date}\nTime: ${timeLabel}\n\nBest regards,\n${bookingData.customerName || ''}`;
  const emailLink = `mailto:info@khanmoves.co.uk?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const nextSteps = [
    'Team reviews your request within 2 hours',
    'Confirmation via WhatsApp or email',
    'You receive your final price & invoice',
    'Driver calls 30 mins before arrival',
  ];

  return (
    <div className="min-h-screen bg-[#F5F1ED] py-4 px-4">
      <div className="max-w-6xl mx-auto w-full space-y-4">

        {/* ── SUCCESS BANNER ── */}
        <div className="bg-[#1a1a1a] rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/15 rounded-full flex items-center justify-center border-2 border-green-500 shrink-0">
              <FiCheckCircle size={24} className="text-green-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white">Booking Submitted!</h1>
              <p className="text-gray-400 text-xs mt-0.5">We've received your request and will be in touch shortly.</p>
            </div>
          </div>
          <div className="bg-black/40 border border-yellow-500/20 rounded-xl px-4 py-3 flex items-center gap-3 shrink-0">
            <div>
              <p className="text-[10px] tracking-widest text-gray-400 uppercase">Reference</p>
              <p className="text-2xl font-black text-[#F1C40F] font-mono tracking-wider">{avNumber}</p>
            </div>
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 bg-[#F1C40F] hover:bg-yellow-300 text-[#1a1a1a] font-bold text-xs px-3 py-2 rounded-lg transition">
              <FiCopy size={13} />{copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* ── LEFT: Move details + Map ── */}
          <div className="lg:col-span-5 space-y-4">

            {/* Move details card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h2 className="font-black text-[#1a1a1a] text-sm mb-3">Move Details</h2>

              {/* Service */}
              <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-100">
                <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                  <FiPackage size={17} className="text-[#C0392B]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Service</p>
                  <p className="text-sm font-bold text-[#1a1a1a] capitalize">
                    {(bookingData.serviceType || 'Home').replace('-', ' ')}
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-100">
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                  <FiClock size={17} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Date & Time</p>
                  <p className="text-sm font-bold text-[#1a1a1a]">
                    {bookingData.dateType === 'flexible'
                      ? 'Flexible date'
                      : bookingData.date
                        ? new Date(bookingData.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    <span className="text-gray-400 font-normal text-xs ml-1">· {timeLabel}</span>
                  </p>
                </div>
              </div>

              {/* Route side by side */}
              <div className="flex items-start gap-3 mb-0">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <FiMapPin size={17} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Route</p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-red-50 rounded-xl px-3 py-2 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" />
                        <span className="text-[9px] font-black text-[#C0392B] uppercase tracking-wide">Pickup</span>
                      </div>
                      <p className="text-xs font-bold text-[#1a1a1a] truncate">
                        {bookingData.pickup?.address || bookingData.pickup?.postcode || '—'}
                      </p>
                      <p className="text-[10px] text-gray-400">{bookingData.pickup?.postcode}</p>
                    </div>
                    <div className="flex-1 bg-green-50 rounded-xl px-3 py-2 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#27AE60]" />
                        <span className="text-[9px] font-black text-green-700 uppercase tracking-wide">Delivery</span>
                      </div>
                      <p className="text-xs font-bold text-[#1a1a1a] truncate">
                        {bookingData.delivery?.address || bookingData.delivery?.postcode || '—'}
                      </p>
                      <p className="text-[10px] text-gray-400">{bookingData.delivery?.postcode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            {hasCoords && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <ConfirmMap
                  pickupLat={pickupLat} pickupLng={pickupLng}
                  deliveryLat={deliveryLat} deliveryLng={deliveryLng}
                  distance={distance}
                />
              </div>
            )}
          </div>

          {/* ── MIDDLE: Your details ── */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h2 className="font-black text-[#1a1a1a] text-sm mb-3">Your Details</h2>

            <div className="space-y-2 text-sm mb-4">
              {bookingData.customerName && (
                <div className="flex items-center gap-2">
                  <FiUser size={14} className="text-gray-400 shrink-0" />
                  <span className="font-semibold text-[#1a1a1a] truncate">{bookingData.customerName}</span>
                </div>
              )}
              {bookingData.customerEmail && (
                <div className="flex items-center gap-2">
                  <FiMail size={14} className="text-gray-400 shrink-0" />
                  <span className="text-gray-600 truncate text-xs">{bookingData.customerEmail}</span>
                </div>
              )}
              {bookingData.customerPhone && (
                <div className="flex items-center gap-2">
                  <FiPhone size={14} className="text-gray-400 shrink-0" />
                  <span className="text-gray-600 text-xs">{bookingData.customerPhone}</span>
                </div>
              )}
            </div>

            {/* Items */}
            {bookingData.items?.length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">
                  Items ({bookingData.items.length})
                </p>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {bookingData.items.map(item => (
                    <div key={item.name} className="flex justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                      <span className="text-[#1a1a1a] truncate pr-2 font-medium">{item.name}</span>
                      <span className="text-gray-400 shrink-0 font-bold">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            {bookingData.totalPrice > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Estimated total</span>
                <span className="text-xl font-black text-[#C0392B]">£{bookingData.totalPrice}</span>
              </div>
            )}

            {/* Notes */}
            {bookingData.specialInstructions && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Notes</p>
                <p className="text-xs text-gray-600 bg-amber-50 rounded-lg px-2.5 py-2 border border-amber-100">
                  {bookingData.specialInstructions}
                </p>
              </div>
            )}
          </div>

          {/* ── RIGHT: What's next + actions ── */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex-1">
              <h2 className="font-black text-[#1a1a1a] text-sm mb-3">What's Next</h2>
              <ol className="space-y-3">
                {nextSteps.map((s, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 rounded-full bg-[#C0392B] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-xs text-gray-600 leading-snug">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Contact buttons */}
            <div className="grid grid-cols-3 gap-2">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" title="WhatsApp"
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition">
                <FiMessageCircle size={19} />
              </a>
              <a href={emailLink} title="Email"
                className="flex items-center justify-center bg-[#C0392B] hover:bg-red-700 text-white py-3 rounded-xl transition">
                <FiMail size={19} />
              </a>
              <a href="tel:01215556666" title="Call us"
                className="flex items-center justify-center bg-[#1a1a1a] hover:bg-gray-800 text-white py-3 rounded-xl transition">
                <FiPhone size={19} />
              </a>
            </div>

            <button onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 bg-[#F1C40F] hover:bg-yellow-300 text-[#1a1a1a] font-bold py-3 rounded-xl transition text-sm shadow-sm">
              Back to Home <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}