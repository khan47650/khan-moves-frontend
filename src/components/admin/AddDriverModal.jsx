import React, { useState, useRef } from 'react';
import { FiX, FiUser, FiFileText, FiUpload } from 'react-icons/fi';

export default function AddDriverModal({ show, onClose, onAdd, loading }) {
    const [form, setForm] = useState({
        name: '', phone: '', licenseNumber: '', joiningDate: '', bankDetails: '',
    });
    const [licenceFile, setLicenceFile] = useState(null);
    const [error, setError] = useState('');
    const licenceRef = useRef();

    if (!show) return null;

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleLicence = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLicenceFile(file);
    };

    const handleSubmit = () => {
        if (!form.name.trim()) { setError('Driver name is required.'); return; }
        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));
        if (licenceFile) data.append('licence', licenceFile);
        onAdd(data);
    };

    const handleClose = () => {
        setForm({ name: '', phone: '', licenseNumber: '', joiningDate: '', bankDetails: '' });
        setLicenceFile(null);
        setError('');
        onClose();
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#C0392B]/10 flex items-center justify-center">
                            <FiUser size={15} className="text-[#C0392B]" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-base">Add New Driver</h3>
                    </div>
                    <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                        <FiX size={16} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                        <input name="name" value={form.name} onChange={handleChange}
                            placeholder="e.g. Ahmed Khan"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B] transition-all" />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                        <input name="phone" value={form.phone} onChange={handleChange}
                            placeholder="e.g. +44 7700 900000"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B] transition-all" />
                    </div>

                    {/* License Number */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Licence Number</label>
                        <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange}
                            placeholder="e.g. KHANA123456"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B] transition-all" />
                    </div>

                    {/* Joining Date */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Joining Date</label>
                        <input name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B] transition-all" />
                    </div>

                    {/* Bank Details */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bank Details</label>
                        <input name="bankDetails" value={form.bankDetails} onChange={handleChange}
                            placeholder="e.g. Sort: 12-34-56 | Acc: 12345678"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B] transition-all" />
                    </div>

                    {/* Licence PDF */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Licence PDF</label>
                        <div
                            onClick={() => licenceRef.current.click()}
                            className="flex items-center gap-3 border border-dashed border-gray-300 hover:border-[#C0392B] rounded-xl px-4 py-3 cursor-pointer transition-colors bg-gray-50"
                        >
                            <FiFileText size={18} className={licenceFile ? 'text-[#C0392B]' : 'text-gray-400'} />
                            <span className={`text-sm ${licenceFile ? 'text-[#C0392B] font-semibold' : 'text-gray-400'}`}>
                                {licenceFile ? licenceFile.name : 'Click to upload PDF'}
                            </span>
                            <FiUpload size={14} className="ml-auto text-gray-400" />
                        </div>
                        <input ref={licenceRef} type="file" accept="application/pdf" className="hidden" onChange={handleLicence} />
                    </div>

                    {error && (
                        <p className="text-xs text-[#C0392B] bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
                    <button onClick={handleClose} disabled={loading}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={loading}
                        className="flex-1 py-2.5 rounded-xl bg-[#C0392B] hover:bg-red-800 disabled:opacity-60 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
                        {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                        {loading ? 'Adding...' : 'Add Driver'}
                    </button>
                </div>
            </div>
        </div>
    );
}