import React, { useState, useEffect } from 'react';
import {
    FiX,
    FiPhone,
    FiMail,
    FiUser,
    FiCheckCircle,
    FiMessageSquare,
    FiTruck,
} from 'react-icons/fi';

export default function ConfirmationDialog({ isOpen, onClose, onConfirm, loading }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        whatsapp: '',
        specialInstructions: '',
        businessDelivery: false,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (formData.phone && formData.phone.length < 10) newErrors.phone = 'Invalid phone';
        return newErrors;
    };

    const handleSubmit = () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onConfirm(formData);
        setFormData({ name: '', phone: '', email: '', whatsapp: '', specialInstructions: '', businessDelivery: false });
        setErrors({});
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop - VERY HIGH Z-INDEX */}
            <div
                className="fixed inset-0 bg-black/50 z-9998"
                onClick={onClose}
            />

            {/* Dialog Wrapper - Portal-like positioning */}
            <div className="fixed z-9999 inset-0 flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-white rounded-2xl w-full max-w-md pointer-events-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-[#1a1a1a]">Your details</h3>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="p-5 space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto">

                        {/* Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <FiUser size={16} />
                                Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Your full name"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value });
                                    if (errors.name) setErrors({ ...errors, name: '' });
                                }}
                                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm outline-none transition ${errors.name
                                    ? 'border-red-400 focus:border-red-400'
                                    : 'border-gray-200 focus:border-gray-400'
                                    }`}
                            />
                            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <FiPhone size={16} />
                                Phone number *
                            </label>
                            <input
                                type="tel"
                                placeholder="+44 7700 000000"
                                value={formData.phone}
                                onChange={(e) => {
                                    setFormData({ ...formData, phone: e.target.value });
                                    if (errors.phone) setErrors({ ...errors, phone: '' });
                                }}
                                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm outline-none transition ${errors.phone
                                    ? 'border-red-400 focus:border-red-400'
                                    : 'border-gray-200 focus:border-gray-400'
                                    }`}
                            />
                            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <FiMail size={16} />
                                Email (optional)
                            </label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 transition"
                            />
                        </div>

                        {/* WhatsApp */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <FiMessageSquare size={16} />
                                WhatsApp (optional)
                            </label>
                            <input
                                type="tel"
                                placeholder="+44 7700 000000"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 transition"
                            />
                        </div>

                        {/* Special Instructions */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                Special instructions (important)
                            </label>
                            <textarea
                                placeholder="E.g. Parking available, narrow entrance, etc."
                                value={formData.specialInstructions}
                                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                                rows="3"
                                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 transition resize-none"
                            />
                        </div>

                        {/* Business Delivery */}
                        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                            <input
                                type="checkbox"
                                checked={formData.businessDelivery}
                                onChange={(e) => setFormData({ ...formData, businessDelivery: e.target.checked })}
                                className="w-4 h-4 shrink-0"
                            />
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <FiTruck size={16} className="text-gray-600 shrink-0" />
                                <span className="text-sm font-semibold text-gray-700">Business delivery</span>
                            </div>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 p-5 border-t border-gray-100 bg-white">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-2.5 border border-gray-300 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 py-2.5 bg-[#1a1a1a] hover:bg-black rounded-lg font-semibold text-sm text-white transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin">⏳</span> Processing
                                </>
                            ) : (
                                <>
                                    <FiCheckCircle size={16} /> Confirm
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}