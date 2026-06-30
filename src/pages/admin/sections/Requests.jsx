import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMail, FiCheck, FiX, FiEye, FiPhone, FiMapPin, FiClock, FiPackage
} from 'react-icons/fi';
import { dummyRequests } from '../adminDummyData';
import { toast } from 'react-toastify';

export default function Requests() {
    const [requests, setRequests] = useState(dummyRequests);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const handleAccept = (id) => {
        const req = requests.find(r => r.id === id);
        toast.success(`Request ${req.avNumber} accepted! Moving to Active Jobs...`);
        setRequests(requests.filter(r => r.id !== id));
        setSelectedRequest(null);
    };

    const handleDecline = (id) => {
        const req = requests.find(r => r.id === id);
        toast.error(`Request ${req.avNumber} declined.`);
        setRequests(requests.filter(r => r.id !== id));
        setSelectedRequest(null);
    };

    return (
        <div className="relative">
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Booking Requests</h1>
            <p className="text-gray-500 mb-8">Pending customer booking requests waiting for approval.</p>

            {requests.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                    <p className="text-gray-500">No pending requests</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => (
                        <div key={req.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-[#1a1a1a]">{req.customerName}</h3>
                                    <p className="text-sm text-gray-500">
                                        Ref: <span className="font-semibold text-[#C0392B]">{req.avNumber}</span> • {req.submittedAt}
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                    PENDING
                                </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Contact</p>
                                    <p className="text-sm text-gray-700">{req.email}</p>
                                    <p className="text-sm text-gray-700">{req.phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Route</p>
                                    <p className="text-sm text-gray-700">{req.pickupPostcode} → {req.deliveryPostcode}</p>
                                    <p className="text-xs text-gray-500">Date: {req.date} ({req.time})</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 items-center">
                                <button
                                    onClick={() => setSelectedRequest(req)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-semibold"
                                >
                                    <FiEye size={16} /> View
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-semibold">
                                    <FiMail size={16} /> Send Invoice
                                </button>
                                <button
                                    onClick={() => handleAccept(req.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-semibold"
                                >
                                    <FiCheck size={16} /> Accept
                                </button>
                                <button
                                    onClick={() => handleDecline(req.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
                                >
                                    <FiX size={16} /> Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Side Panel */}
            <AnimatePresence>
                {selectedRequest && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRequest(null)}
                            className="fixed inset-0 bg-black/50 z-40"
                        />
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-16 right-0 h-[calc(100vh-64px)] w-96 bg-white z-50 overflow-y-auto shadow-2xl"
                        >
                            <div className="sticky top-0 bg-linear-to-r from-[#C0392B] to-red-700 text-white p-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedRequest.customerName}</h2>
                                    <p className="text-red-100 text-sm mt-1">Ref: {selectedRequest.avNumber}</p>
                                </div>
                                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-red-600 rounded-lg transition">
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <span className="inline-block px-4 py-2 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
                                    PENDING
                                </span>

                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Contact Information</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#C0392B]/10 rounded-lg"><FiMail className="text-[#C0392B]" size={18} /></div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Email</p>
                                            <p className="text-sm text-gray-700 font-medium">{selectedRequest.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#C0392B]/10 rounded-lg"><FiPhone className="text-[#C0392B]" size={18} /></div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Phone</p>
                                            <p className="text-sm text-gray-700 font-medium">{selectedRequest.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiMapPin className="text-blue-600" size={18} />
                                        <h4 className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Pickup</h4>
                                    </div>
                                    <p className="text-sm text-blue-900 font-medium mb-2">{selectedRequest.pickupPostcode}</p>
                                    <div className="flex items-center gap-2 text-xs text-blue-700">
                                        <FiClock size={14} />
                                        <span>{selectedRequest.date} · {selectedRequest.time}</span>
                                    </div>
                                </div>

                                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiMapPin className="text-orange-600" size={18} />
                                        <h4 className="text-sm font-semibold text-orange-900 uppercase tracking-wide">Delivery</h4>
                                    </div>
                                    <p className="text-sm text-orange-900 font-medium">{selectedRequest.deliveryPostcode}</p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiPackage className="text-[#C0392B]" size={18} />
                                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Items</h4>
                                    </div>
                                    <p className="text-sm text-gray-700">{selectedRequest.items.join(', ')}</p>
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-sm font-semibold text-gray-700">Total Volume:</span>
                                        <span className="text-lg font-bold text-green-600">{selectedRequest.totalVolume}</span>
                                    </div>
                                </div>

                                {selectedRequest.specialInstructions && (
                                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                        <p className="text-xs text-yellow-700 uppercase font-semibold mb-2">⚠️ Special Instructions</p>
                                        <p className="text-sm text-yellow-800">{selectedRequest.specialInstructions}</p>
                                    </div>
                                )}

                                <div className="space-y-3 pt-4 border-t border-gray-200">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAccept(selectedRequest.id)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition text-sm font-bold uppercase tracking-wide"
                                    >
                                        <FiCheck size={18} /> Accept
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => handleDecline(selectedRequest.id)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-bold uppercase tracking-wide"
                                    >
                                        <FiX size={18} /> Decline
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

