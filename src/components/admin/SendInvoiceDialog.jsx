import React, { useState, useRef } from 'react';
import { FiX, FiMail, FiCheck, FiPackage, FiMessageSquare, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../api/api';

export default function SendInvoiceDialog({ booking, onClose, onSent }) {
    const [step, setStep] = useState('file'); // 'file' | 'method'
    const [selectedFile, setSelectedFile] = useState(null);
    const [method, setMethod] = useState('');
    const [notes, setNotes] = useState('');
    const [sending, setSending] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') { toast.error('Please select a PDF file'); return; }
        setSelectedFile(file);
        setStep('method');
    };

    const handleSend = async () => {
        if (!method) { toast.error('Please select a method'); return; }
        if (!selectedFile) { toast.error('Please select a file'); return; }
        setSending(true);
        try {
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(selectedFile);
            });

            await api.post(`/bookings/${booking._id}/send-invoice`, {
                method,
                notes,
                attachment: {
                    filename: selectedFile.name,
                    content: base64,
                },
            });

            toast.success(method === 'email' ? 'Invoice sent via email!' : 'Invoice sent via WhatsApp!');
            if (onSent) onSent(booking._id);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send invoice');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-[#1a1a1a]">Send Invoice</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                        <FiX size={18} />
                    </button>
                </div>

                {step === 'file' ? (
                    <>
                        <p className="text-xs text-gray-500 mb-5">
                            Select the invoice PDF to send to <strong>{booking.customer?.name}</strong>
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="w-full flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-300 hover:border-[#C0392B] rounded-xl transition group"
                        >
                            <div className="w-12 h-12 bg-gray-100 group-hover:bg-red-50 rounded-xl flex items-center justify-center transition">
                                <FiPackage size={22} className="text-gray-400 group-hover:text-[#C0392B]" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-[#1a1a1a]">Click to select PDF</p>
                                <p className="text-xs text-gray-400 mt-0.5">Invoice PDF file only</p>
                            </div>
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full mt-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition font-semibold"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        {/* File selected indicator */}
                        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl mb-4">
                            <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                                <FiCheck size={16} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-green-700">File selected</p>
                                <p className="text-xs text-green-600 truncate">{selectedFile?.name}</p>
                            </div>
                            <button
                                onClick={() => { setSelectedFile(null); setStep('file'); setMethod(''); }}
                                className="text-gray-400 hover:text-red-500 transition"
                            >
                                <FiX size={14} />
                            </button>
                        </div>

                        {/* Method selection */}
                        <p className="text-xs text-gray-500 mb-3">Choose how to send:</p>
                        <div className="space-y-2 mb-4">
                            <button
                                onClick={() => setMethod('email')}
                                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition ${method === 'email' ? 'border-[#C0392B] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${method === 'email' ? 'bg-[#C0392B] text-white' : 'bg-gray-100 text-gray-600'}`}>
                                    <FiMail size={16} />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="text-sm font-bold text-[#1a1a1a]">Send by Email</p>
                                    <p className="text-xs text-gray-500">{booking.customer?.email || 'No email on file'}</p>
                                </div>
                                {method === 'email' && <FiCheck size={16} className="text-[#C0392B]" />}
                            </button>

                            <button
                                onClick={() => setMethod('whatsapp')}
                                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition ${method === 'whatsapp' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${method === 'whatsapp' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                    <FiMessageSquare size={16} />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="text-sm font-bold text-[#1a1a1a]">Send by WhatsApp</p>
                                    <p className="text-xs text-gray-500">{booking.customer?.whatsapp || booking.customer?.phone || 'No number on file'}</p>
                                </div>
                                {method === 'whatsapp' && <FiCheck size={16} className="text-green-500" />}
                            </button>
                        </div>

                        {/* Notes */}
                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message (optional)</label>
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                placeholder="e.g. Payment due within 7 days. Thank you!"
                                rows={2}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C0392B] transition resize-none"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                disabled={sending}
                                className="flex-1 py-2.5 border border-gray-300 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={sending || !method}
                                className="flex-1 py-2.5 bg-[#C0392B] hover:bg-red-800 rounded-xl font-semibold text-sm text-white transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sending
                                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                                    : <><FiSend size={14} /> Send</>}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
