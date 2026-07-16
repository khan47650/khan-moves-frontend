import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMail, FiCheck, FiX, FiEye, FiPhone, FiMapPin,
    FiClock, FiPackage, FiMessageSquare, FiSend
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../../api/api';
import SendInvoiceDialog from '../../../components/admin/SendInvoiceDialog';
import RejectDialog from '../../../components/admin/RejectDialog';

function SectionLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-12 h-12 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C0392B] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#C0392B]/20 animate-pulse" />
                </div>
            </div>
            <p className="text-sm font-semibold text-gray-400">Loading requests...</p>
        </div>
    );
}


export default function Requests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [sendInvoiceFor, setSendInvoiceFor] = useState(null);
    const [rejectFor, setRejectFor] = useState(null);
    const [acceptingId, setAcceptingId] = useState(null);

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const [pendingRes, inProgressRes] = await Promise.all([
                api.get('/bookings?status=in_progress&limit=100'),
                api.get('/bookings?status=pending&limit=100'),

            ]);
            const pending = pendingRes.data?.data || [];
            const inProgress = inProgressRes.data?.data || [];
            setRequests([...pending, ...inProgress]);
        } catch {
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (req) => {
        setAcceptingId(req._id);
        try {
            await api.post(`/jobs/from-booking/${req._id}`);
            toast.success(`Booking ${req.bookingRef} confirmed! Job created.`);
            setRequests(prev => prev.filter(r => r._id !== req._id));
            setSelectedRequest(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to accept booking');
        } finally {
            setAcceptingId(null);
        }
    };

    const handleRejected = (bookingId) => {
        setRequests(prev => prev.filter(r => r._id !== bookingId));
        setSelectedRequest(null);
    };

    const handleInvoiceSent = async (bookingId) => {
        try {
            await api.patch(`/bookings/${bookingId}/status`, { status: 'in_progress' });
            setRequests(prev => prev.map(r =>
                r._id === bookingId ? { ...r, status: 'in_progress' } : r
            ));
            setSelectedRequest(prev =>
                prev?._id === bookingId ? { ...prev, status: 'in_progress' } : prev
            );
        } catch {
            // silent
        }
    };

    return (
        <div className="relative">
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Booking Requests</h1>
            <p className="text-gray-500 mb-6">Pending customer booking requests waiting for approval.</p>

            {loading ? <SectionLoader /> : requests.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                    <FiPackage size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No pending requests</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {requests.map(req => (
                        <div key={req._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-base font-bold text-[#1a1a1a]">{req.customer?.name || '—'}</h3>
                                    <p className="text-sm text-gray-500">
                                        Ref: <span className="font-semibold text-[#C0392B]">{req.bookingRef}</span>
                                        {req.createdAt && <span className="ml-2">· {new Date(req.createdAt).toLocaleDateString('en-GB')}</span>}
                                    </p>
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${req.status === 'in_progress' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {req.status === 'in_progress' ? 'IN PROGRESS' : 'PENDING'}
                                </span>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100 text-sm">
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold mb-0.5">Customer</p>
                                    <p className="text-gray-700">{req.customer?.phone || '—'}</p>
                                    <p className="text-gray-500 text-xs truncate">{req.customer?.email || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold mb-0.5">Route</p>
                                    <p className="text-gray-700">{req.pickup?.postcode || '—'} → {req.delivery?.postcode || '—'}</p>
                                    <p className="text-xs text-gray-500">{req.serviceType || "—"} · {req.distance || 0} mi</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold mb-0.5">Date & Price</p>
                                    <p className="text-gray-700">{req.dateType === 'flexible' ? 'Flexible' : req.date || '—'}</p>
                                    <p className="text-sm font-bold text-[#C0392B]">£{req.totalPrice || 0}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedRequest(req)}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-xs font-semibold"
                                >
                                    <FiEye size={14} /> View Details
                                </button>
                                <button
                                    onClick={() => setSendInvoiceFor(req)}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-xs font-semibold"
                                >
                                    <FiSend size={14} /> {req.status === 'in_progress' ? 'Send Invoice Again' : 'Send Invoice'}
                                </button>
                                <button
                                    onClick={() => handleAccept(req)}
                                    disabled={acceptingId === req._id}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-xs font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {acceptingId === req._id
                                        ? <><div className="w-3 h-3 border-2 border-green-700/30 border-t-green-700 rounded-full animate-spin" /> Accepting...</>
                                        : <><FiCheck size={14} /> Accept</>}
                                </button>
                                <button
                                    onClick={() => setRejectFor(req)}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-xs font-semibold"
                                >
                                    <FiX size={14} /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Send Invoice Dialog */}
            {sendInvoiceFor && (
                <SendInvoiceDialog
                    booking={sendInvoiceFor}
                    onClose={() => setSendInvoiceFor(null)}
                    onSent={handleInvoiceSent}
                />
            )}

            {rejectFor && (
                <RejectDialog
                    booking={rejectFor}
                    onClose={() => setRejectFor(null)}
                    onRejected={handleRejected}
                />
            )}

            {/* Detail Side Panel */}
            <AnimatePresence>
                {selectedRequest && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                            {/* Header */}
                            <div className="sticky top-0 bg-linear-to-r from-[#C0392B] to-red-700 text-white p-5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">{selectedRequest.customer?.name || '—'}</h2>
                                    <p className="text-red-100 text-sm mt-0.5">Ref: {selectedRequest.bookingRef}</p>
                                </div>
                                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-red-600 rounded-lg transition">
                                    <FiX size={22} />
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${selectedRequest.status === 'in_progress' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {selectedRequest.status === 'in_progress' ? 'IN PROGRESS' : 'PENDING'}
                                </span>

                                {/* Contact */}
                                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contact</h4>
                                    {selectedRequest.customer?.phone && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#C0392B]/10 rounded-lg flex items-center justify-center shrink-0">
                                                <FiPhone className="text-[#C0392B]" size={15} />
                                            </div>
                                            <p className="text-sm text-gray-700">{selectedRequest.customer.phone}</p>
                                        </div>
                                    )}
                                    {selectedRequest.customer?.email && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#C0392B]/10 rounded-lg flex items-center justify-center shrink-0">
                                                <FiMail className="text-[#C0392B]" size={15} />
                                            </div>
                                            <p className="text-sm text-gray-700 truncate">{selectedRequest.customer.email}</p>
                                        </div>
                                    )}
                                    {selectedRequest.customer?.whatsapp && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#C0392B]/10 rounded-lg flex items-center justify-center shrink-0">
                                                <FiMessageSquare className="text-[#C0392B]" size={15} />
                                            </div>
                                            <p className="text-sm text-gray-700">{selectedRequest.customer.whatsapp}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Service */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Service</h4>
                                    <p className="text-sm font-semibold text-[#1a1a1a]">
                                        {selectedRequest.serviceType || "—"}
                                    </p>
                                </div>

                                {/* Route */}
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                    <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-3">Route</h4>
                                    <div className="mb-2">
                                        <p className="text-xs text-gray-500 mb-0.5">Pickup</p>
                                        <p className="text-sm font-bold text-[#1a1a1a]">{selectedRequest.pickup?.address || '—'}</p>
                                        <p className="text-xs text-gray-500">{selectedRequest.pickup?.postcode}</p>
                                    </div>
                                    <div className="text-[#C0392B] text-sm my-1 ml-1">↓</div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Delivery</p>
                                        <p className="text-sm font-bold text-[#1a1a1a]">{selectedRequest.delivery?.address || '—'}</p>
                                        <p className="text-xs text-gray-500">{selectedRequest.delivery?.postcode}</p>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">{selectedRequest.distance || 0} miles</p>
                                </div>

                                {/* Date & Time */}
                                <div className="border border-gray-100 rounded-xl p-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Date & Time</h4>
                                    <div className="flex items-center gap-2">
                                        <FiClock size={14} className="text-gray-400" />
                                        <p className="text-sm text-gray-700">
                                            {selectedRequest.dateType === 'flexible' ? 'Flexible dates' : selectedRequest.date || '—'}
                                            {selectedRequest.timeSlot && <span className="ml-2 capitalize text-gray-500">· {selectedRequest.timeSlot}</span>}
                                        </p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="border border-gray-100 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiPackage size={15} className="text-[#C0392B]" />
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Items ({selectedRequest.items?.length || 0})</h4>
                                    </div>
                                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                        {(selectedRequest.items || []).map((it, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm bg-gray-50 px-3 py-1.5 rounded-lg">
                                                <span className="text-gray-700 truncate flex-1">{it.name}</span>
                                                <span className="text-gray-500 font-bold shrink-0 ml-2">x{it.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                                        <span className="text-xs text-gray-500">Total Volume</span>
                                        <span className="text-sm font-bold text-[#1a1a1a]">{(selectedRequest.totalVolume || 0).toFixed(2)} m³</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="bg-[#1a1a1a] rounded-xl p-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-400">Total Price</p>
                                    <p className="text-2xl font-black text-[#F1C40F]">£{selectedRequest.totalPrice || 0}</p>
                                </div>

                                {/* Special Instructions */}
                                {selectedRequest.specialInstructions && (
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                        <p className="text-xs font-bold text-amber-700 uppercase mb-2">Special Instructions</p>
                                        <p className="text-sm text-amber-800">{selectedRequest.specialInstructions}</p>
                                    </div>
                                )}

                                {/* Accept / Reject buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAccept(selectedRequest)}
                                        disabled={acceptingId === selectedRequest?._id}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {acceptingId === selectedRequest?._id
                                            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Accepting...</>
                                            : <><FiCheck size={16} /> Accept</>}
                                    </button>
                                    <button
                                        onClick={() => { setSelectedRequest(null); setRejectFor(selectedRequest); }}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-bold text-sm transition"
                                    >
                                        <FiX size={16} /> Reject
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
