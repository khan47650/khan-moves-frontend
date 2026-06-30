import React, { useState, useEffect } from 'react';
import { FiX, FiPhone, FiMail, FiUser, FiCheckCircle, FiMessageSquare, FiTruck } from 'react-icons/fi';

function formatUKPhone(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 5) return digits;
  return digits.slice(0, 5) + ' ' + digits.slice(5);
}

const EMAIL_CORRECTIONS = {
  'gamil.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmail.co': 'gmail.com',
  'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmaill.com': 'hotmail.com',
  'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'outlok.com': 'outlook.com',
  'outloook.com': 'outlook.com',
};

function correctEmail(email) {
  const atIdx = email.lastIndexOf('@');
  if (atIdx < 0) return { value: email, suggestion: null };
  const domain = email.slice(atIdx + 1).toLowerCase();
  const corrected = EMAIL_CORRECTIONS[domain];
  if (corrected) return { value: email, suggestion: email.slice(0, atIdx + 1) + corrected };
  return { value: email, suggestion: null };
}

export default function ConfirmationDialog({ isOpen, onClose, onConfirm, loading }) {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', whatsapp: '', businessDelivery: false,
  });
  const [errors, setErrors] = useState({});
  const [emailSuggestion, setEmailSuggestion] = useState(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.phone.trim()) e.phone = 'Phone is required';
    const digits = formData.phone.replace(/\D/g, '');
    if (digits && digits.length < 10) e.phone = 'Enter a valid UK number';
    return e;
  };

  const handlePhoneChange = (raw, field = 'phone') => {
    const formatted = formatUKPhone(raw);
    setFormData(prev => ({ ...prev, [field]: formatted }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleEmailChange = (val) => {
    setFormData(prev => ({ ...prev, email: val }));
    const { suggestion } = correctEmail(val);
    setEmailSuggestion(suggestion);
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onConfirm(formData);
    setFormData({ name: '', phone: '', email: '', whatsapp: '', businessDelivery: false });
    setErrors({});
    setEmailSuggestion(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-9998" onClick={onClose} />
      <div className="fixed z-9999 inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl w-full max-w-md pointer-events-auto shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-[#1a1a1a]">Your details</h3>
            <button onClick={onClose} disabled={loading} className="p-1.5 hover:bg-gray-100 rounded-lg transition disabled:opacity-50">
              <FiX size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="p-5 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto">

            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiUser size={15} /> Name *
              </label>
              <input
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={e => { setFormData(p => ({ ...p, name: e.target.value })); if (errors.name) setErrors(p => ({ ...p, name: '' })); }}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm outline-none transition ${errors.name ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'}`}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiPhone size={15} /> Phone number *
              </label>
              <input
                type="tel"
                placeholder="07700 000000"
                value={formData.phone}
                onChange={e => handlePhoneChange(e.target.value, 'phone')}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm outline-none transition ${errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'}`}
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiMail size={15} /> Email (optional)
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={e => handleEmailChange(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 transition"
              />
              {emailSuggestion && (
                <div className="mt-1.5 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                  <span>Did you mean <strong>{emailSuggestion}</strong>?</span>
                  <button onClick={() => { setFormData(p => ({ ...p, email: emailSuggestion })); setEmailSuggestion(null); }} className="ml-auto font-bold text-amber-800 underline">Use this</button>
                </div>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiMessageSquare size={15} /> WhatsApp (optional)
              </label>
              <input
                type="tel"
                placeholder="07700 000000"
                value={formData.whatsapp}
                onChange={e => handlePhoneChange(e.target.value, 'whatsapp')}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 transition"
              />
            </div>

            {/* Business Delivery */}
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={formData.businessDelivery}
                onChange={e => setFormData(p => ({ ...p, businessDelivery: e.target.checked }))}
                className="w-4 h-4 shrink-0"
              />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FiTruck size={15} className="text-gray-600 shrink-0" />
                <span className="text-sm font-semibold text-gray-700">Business delivery</span>
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 p-5 border-t border-gray-100">
            <button onClick={onClose} disabled={loading} className="flex-1 py-2.5 border border-gray-300 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-sm text-white transition flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><span className="animate-spin">⏳</span> Processing</> : <><FiCheckCircle size={16} /> Confirm</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}