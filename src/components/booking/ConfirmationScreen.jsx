import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiCheckCircle, FiCopy, FiPackage, FiClock,
    FiMapPin, FiUser, FiMail, FiPhone, FiMessageCircle, FiArrowRight,
} from 'react-icons/fi';
import MapComponent from './MapComponent';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function ConfirmationScreen({
    data,
    confirmationData,
    totalPrice = 0,
    totalVolume = 0,
    bookingRef = '',
    pickupLat,
    pickupLng,
    deliveryLat,
    deliveryLng,
    distance = 0,
}) {
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const [serviceName, setServiceName] = useState('');

    useEffect(() => {
        const fetchServiceName = async () => {
            try {
                const res = await api.get('/inventory/services');
                const services = res.data?.data || [];
                const matched = services.find(
                    service => service.slug === data.serviceType
                );

                setServiceName(
                    matched?.label ||
                    data.serviceType?.replaceAll('_', ' ') ||
                    '—'
                );
            } catch (err) {
                setServiceName(
                    data.serviceType?.replaceAll('_', ' ') || '—'
                );
            }
        };

        fetchServiceName();
    }, [data.serviceType]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(bookingRef);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    return (
        <motion.div
            className="bg-linear-to-br from-amber-50/30 via-white to-rose-50/20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-6">

                {/* ── SUCCESS BANNER ── */}
                <motion.div
                    variants={itemVariants}
                    className="bg-linear-to-r from-[#1a1a1a] to-[#2d2d2d] rounded-2xl p-6 mb-6 shadow-xl flex items-center justify-between flex-wrap gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-green-500/15 rounded-full flex items-center justify-center border-2 border-green-500">
                            <FiCheckCircle size={28} className="text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-white text-2xl md:text-3xl font-black">Booking Submitted!</h2>
                            <p className="text-gray-400 text-sm mt-1">We've received your request and will be in touch shortly.</p>
                        </div>
                    </div>
                    {bookingRef && (
                        <div className="bg-black/40 border border-yellow-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
                            <div>
                                <p className="text-yellow-500/70 text-[10px] font-bold tracking-[0.15em]">REFERENCE</p>
                                <p className="text-[#F1C40F] text-2xl font-black tracking-wider">{bookingRef}</p>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-1.5 bg-[#F1C40F] hover:bg-yellow-400 text-[#1a1a1a] px-3 py-2 rounded-lg font-bold text-sm transition shadow-md"
                            >
                                <FiCopy size={14} />
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* ── THREE COLUMN GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

                    {/* MOVE DETAILS */}
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                        <h3 className="text-xl font-black text-[#1a1a1a] mb-5">Move Details</h3>
                        <div className="space-y-4">

                            {/* Service */}
                            <div className="flex gap-3 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                                    <FiPackage size={18} className="text-[#C0392B]" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Service</p>
                                    <p className="font-bold text-[#1a1a1a] mt-0.5 capitalize">
                                        {serviceName || 'Loading service...'}
                                    </p>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="flex gap-3 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center shrink-0">
                                    <FiClock size={18} className="text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Pickup Date & Time</p>
                                    {data.dateType === 'flexible' ? (
                                        <p className="font-bold text-[#1a1a1a] mt-0.5">  Flexible pickup date (20% off)</p>
                                    ) : (
                                        <p className="font-bold text-[#1a1a1a] mt-0.5">
                                            {data.date ? new Date(data.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                            {data.timeSlot && <span className="capitalize"> · {data.timeSlot}</span>}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Route */}
                            <div className="flex gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                                    <FiMapPin size={18} className="text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 font-medium mb-2">Route</p>
                                    <p className="font-bold text-sm text-[#1a1a1a]">{data.pickup.address || data.pickup.postcode}</p>
                                    <p className="text-xs text-gray-500">{data.pickup.postcode}</p>
                                    <div className="flex justify-start my-2 ml-1">
                                        <FiArrowRight className="text-[#C0392B] rotate-90" size={16} />
                                    </div>
                                    <p className="font-bold text-sm text-[#1a1a1a]">{data.delivery.address || data.delivery.postcode}</p>
                                    <p className="text-xs text-gray-500">{data.delivery.postcode}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* YOUR DETAILS */}
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                        <h3 className="text-xl font-black text-[#1a1a1a] mb-5">Your Details</h3>

                        {/* Customer info */}
                        <div className="space-y-3 mb-5 pb-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <FiUser size={16} className="text-gray-400 shrink-0" />
                                <p className="font-bold text-[#1a1a1a] text-sm">{confirmationData?.name || '—'}</p>
                            </div>
                            {confirmationData?.email && (
                                <div className="flex items-center gap-3">
                                    <FiMail size={16} className="text-gray-400 shrink-0" />
                                    <p className="text-sm text-gray-700 truncate">{confirmationData.email}</p>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <FiPhone size={16} className="text-gray-400 shrink-0" />
                                <p className="text-sm text-gray-700">{confirmationData?.phone || '—'}</p>
                            </div>
                        </div>

                        {/* Items — real data */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-bold text-[#1a1a1a]">Items ({data.items.length})</p>
                                <p className="font-black text-[#1a1a1a] text-sm">{totalVolume.toFixed(2)} m³</p>
                            </div>
                            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                {data.items.map((it, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                                        <p className="text-gray-700 font-medium truncate flex-1">{it.name}</p>
                                        <p className="text-gray-500 font-bold shrink-0 ml-2">×{it.quantity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Crew */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500 font-medium mb-1">
                                Moving crew
                            </p>

                            <p className="text-sm font-bold text-[#1a1a1a]">
                                {data.helperCount > 0
                                    ? 'Driver + professional helper'
                                    : 'Driver only'}
                            </p>
                        </div>

                        {/* Selected add-ons */}
                        {(
                            data.dismantleItems?.length > 0 ||
                            data.assemblyItems?.length > 0 ||
                            data.packingService
                        ) && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="font-bold text-[#1a1a1a] mb-3">
                                        Additional Services
                                    </p>

                                    <div className="space-y-2">
                                        {data.dismantleItems?.map((item, index) => (
                                            <div
                                                key={`dismantle-${item.itemId || index}`}
                                                className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2"
                                            >
                                                <span className="text-gray-700">
                                                    Dismantle: {item.name}
                                                </span>

                                                <span className="font-bold">
                                                    ×{item.quantity}
                                                </span>
                                            </div>
                                        ))}

                                        {data.assemblyItems?.map((item, index) => (
                                            <div
                                                key={`assembly-${item.itemId || index}`}
                                                className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2"
                                            >
                                                <span className="text-gray-700">
                                                    Assemble: {item.name}
                                                </span>

                                                <span className="font-bold">
                                                    ×{item.quantity}
                                                </span>
                                            </div>
                                        ))}

                                        {data.packingService && (
                                            <div className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                                                <span className="text-gray-700">
                                                    Professional packing
                                                </span>

                                                <span className="font-bold text-green-600">
                                                    Selected
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Total Price */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-xs text-gray-500 font-medium">Estimated Total</p>
                            <p className="text-2xl font-black text-[#C0392B]">£{totalPrice}</p>
                        </div>
                    </motion.div>

                    {/* WHAT'S NEXT */}
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                        <h3 className="text-xl font-black text-[#1a1a1a] mb-5">What's Next</h3>
                        <div className="space-y-3 mb-5">
                            {[
                                'Our team will review and confirm your booking details',
                                'Your invoice will be sent and can be paid online',
                                'Call customer care anytime for updates or changes',
                                'Your driver will call approximately 30 minutes before arrival',
                            ].map((step, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-6 h-6 bg-[#C0392B] text-white rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                                        {i + 1}
                                    </div>
                                    <p className="text-sm text-gray-700 leading-snug">{step}</p>
                                </div>
                            ))}
                        </div>

                        {/* Contact buttons */}
                        <div className="flex gap-2 mb-3">
                            <a
                                href="https://wa.me/447424153126"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Contact on WhatsApp"
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition flex items-center justify-center shadow-sm"
                            >
                                <FiMessageCircle size={18} />
                            </a>

                            <a
                                href="mailto:info@khanmoves.co.uk"
                                aria-label="Send email"
                                className="flex-1 bg-[#C0392B] hover:bg-red-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center shadow-sm"
                            >
                                <FiMail size={18} />
                            </a>

                            <a
                                href="tel:07424153126"
                                aria-label="Call customer care"
                                className="flex-1 bg-[#1a1a1a] hover:bg-gray-800 text-white py-3 rounded-xl font-bold transition flex items-center justify-center shadow-sm"
                            >
                                <FiPhone size={18} />
                            </a>
                        </div>

                        <p className="text-xs text-center text-gray-500 mb-3">
                            Need help? Call{' '}
                            <a
                                href="tel:07424153126"
                                className="font-bold text-[#C0392B] hover:underline"
                            >
                                07424153126
                            </a>
                        </p>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-[#F1C40F] hover:bg-yellow-400 text-[#1a1a1a] py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md"
                        >
                            Back to Home <FiArrowRight size={18} />
                        </button>
                    </motion.div>
                </div>

                {/* ── MAP ── */}
                {pickupLat && deliveryLat && (
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                            <h3 className="text-xl font-black text-[#1a1a1a]">Route Map</h3>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-[#C0392B] rounded-full" />
                                    <span className="text-gray-700 font-medium">Pickup</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-[#27AE60] rounded-full" />
                                    <span className="text-gray-700 font-medium">Delivery</span>
                                </div>
                                <div className="text-gray-300">|</div>
                                <p className="font-bold text-[#1a1a1a]">{distance} miles</p>
                            </div>
                        </div>
                        <div className="h-80">
                            <MapComponent
                                pickupLat={pickupLat}
                                pickupLng={pickupLng}
                                deliveryLat={deliveryLat}
                                deliveryLng={deliveryLng}
                                distance={distance}
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
