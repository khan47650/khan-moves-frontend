import React, { useState, useRef, useEffect } from 'react';
import { FiMapPin, FiCalendar, FiEdit2, FiTool, FiCheckCircle, FiAlertCircle, FiCheck } from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../ConfirmationDialog';
import ConfirmationScreen from '../ConfirmationScreen';

function ConfirmMap({ pickupLat, pickupLng, deliveryLat, deliveryLng, distance }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const [routeCoords, setRouteCoords] = useState([]);

    const pickupIcon = L.divIcon({
        html: `<div style="background:#C0392B;width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"><span style="transform:rotate(45deg);font-size:11px">🚛</span></div>`,
        className: '', iconSize: [26, 26], iconAnchor: [13, 26],
    });
    const deliveryIcon = L.divIcon({
        html: `<div style="background:#27AE60;width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"><span style="transform:rotate(45deg);font-size:11px">🏠</span></div>`,
        className: '', iconSize: [26, 26], iconAnchor: [13, 26],
    });

    useEffect(() => {
        if (!pickupLat || !deliveryLat) return;
        fetch(`https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${deliveryLng},${deliveryLat}?overview=full&geometries=geojson`)
            .then(r => r.json())
            .then(json => {
                if (json.routes?.[0]) setRouteCoords(json.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]));
            }).catch(() => { });
    }, [pickupLat, deliveryLat]);

    useEffect(() => {
        if (!pickupLat || !deliveryLat || !mapRef.current) return;
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, { zoomControl: false, scrollWheelZoom: false })
                .setView([(pickupLat + deliveryLat) / 2, (pickupLng + deliveryLng) / 2], 9);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM', maxZoom: 19 }).addTo(mapInstance.current);
        }
        const map = mapInstance.current;
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });
        L.marker([pickupLat, pickupLng], { icon: pickupIcon }).addTo(map);
        L.marker([deliveryLat, deliveryLng], { icon: deliveryIcon }).addTo(map);
        if (routeCoords.length > 0) {
            L.polyline(routeCoords, { color: '#2980B9', weight: 5, opacity: 0.85 }).addTo(map);
        } else {
            L.polyline([[pickupLat, pickupLng], [deliveryLat, deliveryLng]], { color: '#2980B9', weight: 4, dashArray: '8,5', opacity: 0.7 }).addTo(map);
        }
        map.fitBounds(L.latLngBounds([[pickupLat, pickupLng], [deliveryLat, deliveryLng]]), { padding: [25, 25] });
    }, [pickupLat, pickupLng, deliveryLat, deliveryLng, routeCoords]);

    return (
        <div className="rounded-xl overflow-hidden" style={{ isolation: 'isolate' }}>
            <div ref={mapRef} style={{ height: '160px', width: '100%' }} className="bg-gray-100" />
            {distance > 0 && (
                <div className="bg-[#F9F8F6] px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-2 h-2 rounded-full bg-[#C0392B]" />Pickup
                        <span className="text-gray-300">→</span>
                        <div className="w-2 h-2 rounded-full bg-[#27AE60]" />Delivery
                    </div>
                    <span className="text-xs font-black text-[#C0392B]">{distance} miles</span>
                </div>
            )}
        </div>
    );
}

export default function StepConfirmDetails({
    data, onEdit, onSubmit, errors, loading = false, totalPrice = 0,
    totalVolume = 0, pickupLat, pickupLng, deliveryLat, deliveryLng, distance = 0,
}) {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);
    const [bookingRef, setBookingRef] = useState('');
    const [submittedBooking, setSubmittedBooking] = useState(null);

    const hasCoords = pickupLat && deliveryLat;

    const handleProceedClick = () => {
        if (!termsAccepted) {
            toast.error('Please accept the terms & conditions');
            return;
        }
        setDialogOpen(true);
    };

    // ── Dialog confirm → call API → show confirmation screen ───────────────
    const handleDialogConfirm = async formData => {
        const result = await onSubmit(formData);

        if (result?.data) {
            setConfirmationData(formData);
            setSubmittedBooking(result.data);
            setBookingRef(
                result.bookingRef ||
                result.data.bookingRef ||
                ''
            );
            setShowConfirmation(true);
            setDialogOpen(false);
        }
    };

    if (showConfirmation && confirmationData) {
        return (
            <ConfirmationScreen
                data={submittedBooking || data}
                confirmationData={confirmationData}
                totalPrice={submittedBooking?.totalPrice ?? totalPrice}
                totalVolume={submittedBooking?.totalVolume ?? totalVolume}
                bookingRef={submittedBooking?.bookingRef || bookingRef}
                pickupLat={submittedBooking?.pickup?.lat ?? pickupLat}
                pickupLng={submittedBooking?.pickup?.lng ?? pickupLng}
                deliveryLat={submittedBooking?.delivery?.lat ?? deliveryLat}
                deliveryLng={submittedBooking?.delivery?.lng ?? deliveryLng}
                distance={submittedBooking?.distance ?? distance}
            />
        );
    }

    return (
        <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
            <div className="max-w-7xl mx-auto mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">Confirm your details</h3>
                <p className="text-gray-500 text-xs mt-0.5">Review everything before we book your move</p>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl p-4 md:p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div className="flex gap-5 flex-col lg:flex-row">

                        {/* ── LEFT ── */}
                        <div className="flex-1 min-w-0 space-y-4">

                            {/* Route */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FiMapPin size={14} className="text-gray-500" />
                                    <span className="text-sm font-bold text-[#1a1a1a]">Route</span>
                                    <button onClick={() => onEdit('location')} className="ml-auto flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#1a1a1a] transition">
                                        <FiEdit2 size={12} /> Edit
                                    </button>
                                </div>
                                <div className="flex gap-2 flex-col sm:flex-row">
                                    <div className="flex-1 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <div className="w-2 h-2 rounded-full bg-[#C0392B]" />
                                            <span className="text-[10px] font-bold text-[#C0392B] uppercase tracking-wide">Pickup</span>
                                        </div>
                                        <p className="text-sm font-bold text-[#1a1a1a]">{data.pickup.address || '—'}</p>
                                        <p className="text-xs text-gray-500">{data.pickup.postcode}</p>
                                        {data.pickupFloor?.floorLevel && (
                                            <p className="text-xs text-gray-400 capitalize mt-0.5">{data.pickupFloor.floorLevel.replace('ground', 'Ground floor')}</p>
                                        )}
                                    </div>
                                    <div className="flex-1 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <div className="w-2 h-2 rounded-full bg-[#27AE60]" />
                                            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Delivery</span>
                                        </div>
                                        <p className="text-sm font-bold text-[#1a1a1a]">{data.delivery.address || '—'}</p>
                                        <p className="text-xs text-gray-500">{data.delivery.postcode}</p>
                                        {data.deliveryFloor?.floorLevel && (
                                            <p className="text-xs text-gray-400 capitalize mt-0.5">{data.deliveryFloor.floorLevel.replace('ground', 'Ground floor')}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Items summary */}
                            <div className="pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-bold text-[#1a1a1a]">Items</span>
                                    <button onClick={() => onEdit('items')} className="ml-auto flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#1a1a1a] transition">
                                        <FiEdit2 size={12} /> Edit
                                    </button>
                                </div>
                                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                    {data.items.length > 0 ? data.items.map((it, i) => (
                                        <div key={i} className="flex items-center justify-between bg-[#F9F8F6] px-3 py-2 rounded-lg text-xs">
                                            <span className="text-gray-700 font-medium truncate flex-1">{it.name}</span>
                                            <span className="text-gray-500 font-bold shrink-0 ml-2">×{it.quantity}</span>
                                        </div>
                                    )) : (
                                        <p className="text-xs text-gray-400">No items added.</p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Total volume: <span className="font-semibold text-[#1a1a1a]">{totalVolume.toFixed(2)} m³</span></p>
                            </div>

                            {/* Date & Time */}
                            <div className="pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <FiCalendar size={14} className="text-gray-500" />
                                    <span className="text-sm font-bold text-[#1a1a1a]">Pickup date & time</span>
                                    <button onClick={() => onEdit('datePrice')} className="ml-auto flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#1a1a1a] transition">
                                        <FiEdit2 size={12} /> Edit
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-[#F9F8F6] rounded-xl px-3 py-2">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5"> Pickup date</p>
                                        <p className="text-sm font-bold text-[#1a1a1a]">
                                            {data.dateType === 'flexible' ? 'Flexible (20% off)' : data.date
                                                ? new Date(data.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
                                                : '—'}
                                        </p>
                                    </div>
                                    <div className="flex-1 bg-[#F9F8F6] rounded-xl px-3 py-2">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5"> Pickup time</p>
                                        <p className="text-sm font-bold text-[#1a1a1a] capitalize">{data.timeSlot || 'TBC'}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Moving crew */}
                            <div className="pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <FiTool size={14} className="text-gray-500" />
                                    <span className="text-sm font-bold text-[#1a1a1a]">
                                        Moving crew
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => onEdit('datePrice')}
                                        className="ml-auto flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#C0392B] transition"
                                    >
                                        <FiEdit2 size={12} />
                                        Edit
                                    </button>
                                </div>

                                <div className="bg-[#F9F8F6] rounded-xl px-3 py-2.5">
                                    <p className="text-sm font-bold text-[#1a1a1a]">
                                        {data.helperCount > 0
                                            ? 'Driver + professional helper'
                                            : 'Driver only'}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {data.helperCount > 0
                                            ? 'Two-person crew for loading and unloading'
                                            : 'One-person crew with customer assistance'}
                                    </p>
                                </div>
                            </div>

                            {/* Added services */}
                            {(
                                data.dismantleItems?.length > 0 ||
                                data.assemblyItems?.length > 0 ||
                                data.packingService
                            ) && (
                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FiTool size={14} className="text-gray-500" />

                                            <span className="text-sm font-bold text-[#1a1a1a]">
                                                Added services
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => onEdit('services')}
                                                className="ml-auto flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#C0392B] transition"
                                            >
                                                <FiEdit2 size={12} />
                                                Edit
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            {data.dismantleItems?.length > 0 && (
                                                <div className="bg-[#F9F8F6] rounded-xl p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-xs font-bold text-[#1a1a1a]">
                                                            Dismantling
                                                        </p>

                                                        <span className="text-xs font-bold text-[#C0392B]">
                                                            +£{data.dismantleCount * 20}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-1.5">
                                                        {data.dismantleItems.map((item, index) => (
                                                            <span
                                                                key={item.itemId || `${item.name}-${index}`}
                                                                className="text-[10px] bg-white border border-gray-200 rounded-full px-2 py-1 text-gray-600"
                                                            >
                                                                {item.name} ×{item.quantity}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {data.assemblyItems?.length > 0 && (
                                                <div className="bg-[#F9F8F6] rounded-xl p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-xs font-bold text-[#1a1a1a]">
                                                            Assembly
                                                        </p>

                                                        <span className="text-xs font-bold text-[#C0392B]">
                                                            +£{data.assemblyCount * 30}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-1.5">
                                                        {data.assemblyItems.map((item, index) => (
                                                            <span
                                                                key={item.itemId || `${item.name}-${index}`}
                                                                className="text-[10px] bg-white border border-gray-200 rounded-full px-2 py-1 text-gray-600"
                                                            >
                                                                {item.name} ×{item.quantity}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {data.packingService && (
                                                <div className="flex justify-between bg-[#F9F8F6] px-3 py-2 rounded-lg text-xs">
                                                    <span className="text-gray-700">
                                                        Professional packing service
                                                    </span>

                                                    <span className="font-bold text-[#C0392B]">
                                                        +£49
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* Special instructions */}
                            {data.specialInstructions && (
                                <div className="pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <FiAlertCircle size={14} className="text-gray-500" />
                                        <span className="text-sm font-bold text-[#1a1a1a]">Special instructions</span>
                                    </div>
                                    <p className="text-xs text-gray-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">{data.specialInstructions}</p>
                                </div>
                            )}

                            {/* Terms */}
                            <div className="pt-3 border-t border-gray-100">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" checked={termsAccepted}
                                        onChange={e => setTermsAccepted(e.target.checked)}
                                        className="w-4 h-4 mt-0.5 shrink-0 accent-green-600" />
                                    <span className="text-xs text-gray-600">
                                        I agree to Khan Moves'{' '}
                                        <a href="/terms" className="text-[#1a1a1a] font-bold hover:underline">Terms & Conditions</a>{' '}
                                        and <a href="/privacy" className="text-[#1a1a1a] font-bold hover:underline">Privacy Policy</a>.
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* ── RIGHT: Map + Price ── */}
                        <div className="lg:w-60 shrink-0 flex flex-col gap-3">
                            {hasCoords && (
                                <div className="rounded-xl overflow-hidden border border-gray-100">
                                    <ConfirmMap pickupLat={pickupLat} pickupLng={pickupLng}
                                        deliveryLat={deliveryLat} deliveryLng={deliveryLng} distance={distance} />
                                </div>
                            )}
                            <div className="bg-white rounded-xl border-2 border-[#1a1a1a] p-4">
                                <p className="text-xs text-gray-500 mb-1">Total to pay</p>
                                <p className="text-3xl font-black text-[#1a1a1a] mb-3">£{totalPrice}</p>
                                <button
                                    onClick={handleProceedClick}
                                    disabled={loading || !termsAccepted}
                                    className={`w-full py-3 rounded-xl font-bold text-white text-sm transition flex items-center justify-center gap-2 ${termsAccepted && !loading ? 'bg-green-600 hover:bg-green-700 shadow-sm' : 'bg-gray-300 cursor-not-allowed'}`}
                                >
                                    {loading
                                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing</>
                                        : <><FiCheckCircle size={16} /> Proceed & Book</>}
                                </button>
                                {!termsAccepted && <p className="text-[10px] text-gray-400 text-center mt-2">Accept terms to continue</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationDialog
                isOpen={dialogOpen}
                onClose={() => !loading && setDialogOpen(false)}
                onConfirm={handleDialogConfirm}
                loading={loading}
            />
        </div>
    );
}
