import React, { useState } from 'react';
import { FiX, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../api/api';

export default function RejectDialog({ booking, onClose, onRejected }) {
    const [reason, setReason] = useState('');
    const [sending, setSending] = useState(false);

    const handleReject = async () => {
        if (!reason.trim()) { toast.error('Please enter a reason'); return; }
        setSending(true);
        try {
            await api.post(`/jobs/reject-booking/${booking._id}`, { reason });
            toast.success('Booking rejected and email sent.');
            onRejected(booking._id);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reject booking');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#1a1a1a]">Reject Booking</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                        <FiX size={18} />
                    </button>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                    Enter a reason — it will be emailed to <strong>{booking.customer?.name}</strong>.
                </p>
                <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="e.g. We are fully booked on your requested date. Please try another date."
                    rows={4}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-400 transition resize-none mb-4"
                    autoFocus
                />
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        disabled={sending}
                        className="flex-1 py-2.5 border border-gray-300 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={sending || !reason.trim()}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl font-semibold text-sm text-white transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending
                            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                            : <><FiSend size={14} /> Reject & Notify</>}
                    </button>
                </div>
            </div>
        </div>
    );
}