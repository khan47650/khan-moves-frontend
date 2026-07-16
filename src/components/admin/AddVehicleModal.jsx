import React, { useState, useRef } from 'react';
import { FiX, FiTruck, FiFileText, FiUpload } from 'react-icons/fi';
import PostCodeInput from '../../components/PostCodeInput';

const FIELD_GROUPS = [
    {
        title: 'Basic Info',
        fields: [
            { name: 'regNumber', label: 'Reg Number *', placeholder: 'e.g. AB12 CDE', mono: true },
            { name: 'makeModel', label: 'Make / Model', placeholder: 'e.g. Ford Transit' },
            { name: 'type', label: 'Type', placeholder: 'e.g. Van' },
            { name: 'category', label: 'Category', placeholder: 'e.g. Large Van' },
        ]
    },
    {
        title: 'Specifications',
        fields: [
            { name: 'loadingCapacity', label: 'Loading Capacity', placeholder: 'e.g. 14 cubic metres' },
            { name: 'payload', label: 'Payload', placeholder: 'e.g. 1200 kg' },
            { name: 'maxLength', label: 'Max Length', placeholder: 'e.g. 4.0m' },
            { name: 'motorbikesCapacity', label: 'Motorbikes Capacity', placeholder: 'e.g. 2' },
            { name: 'tailLift', label: 'Tail Lift', placeholder: 'e.g. Yes / No' },
        ]
    },
    {
        title: 'Other Info',
        fields: [
            { name: 'fuelType', label: 'Fuel Type', placeholder: 'e.g. Diesel' },
            { name: 'seats', label: 'Seats', placeholder: 'e.g. 3' },
            { name: 'useOfTrailer', label: 'Use of Trailer', placeholder: 'e.g. Yes / No' },
        ]
    },
];

export default function AddVehicleModal({ show, onClose, onAdd, loading }) {
    const [form, setForm] = useState({
        regNumber: '', makeModel: '', type: '', category: '',
        loadingCapacity: '', payload: '', maxLength: '', motorbikesCapacity: '',
        tailLift: '', fuelType: '', seats: '', useOfTrailer: '',
        location: '', assignedDriver: '', taxExpiry: '', motExpiry: '',
    });
    const [motPdfFile, setMotPdfFile] = useState(null);
    const [error, setError] = useState('');
    const [detectedRegion, setDetectedRegion] = useState('');
    const motRef = useRef();

    if (!show) return null;

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handlePostcodeResolved = (d) => {
        const region = d.region || d.district || '';
        setDetectedRegion(region);
        setForm(prev => ({ ...prev, location: `${d.postcode} — ${region}` }));
    };

    const handleSubmit = () => {
        if (!form.regNumber.trim()) { setError('Registration number is required.'); return; }
        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));
        if (motPdfFile) data.append('motPdf', motPdfFile);
        onAdd(data);
    };

    const handleClose = () => {
        setForm({
            regNumber: '', makeModel: '', type: '', category: '',
            loadingCapacity: '', payload: '', maxLength: '', motorbikesCapacity: '',
            tailLift: '', fuelType: '', seats: '', useOfTrailer: '',
            location: '', assignedDriver: '', taxExpiry: '', motExpiry: '',
        });
        setMotPdfFile(null);
        setDetectedRegion('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#C0392B]/10 flex items-center justify-center">
                            <FiTruck size={15} className="text-[#C0392B]" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-base">Add New Vehicle</h3>
                    </div>
                    <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                        <FiX size={16} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-6">
                    {FIELD_GROUPS.map(group => (
                        <div key={group.title}>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">{group.title}</p>
                            <div className="space-y-3">
                                {group.fields.map(f => (
                                    <div key={f.name}>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                                        <input
                                            name={f.name}
                                            value={form[f.name]}
                                            onChange={handleChange}
                                            placeholder={f.placeholder}
                                            className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B] transition-all ${f.mono ? 'font-mono uppercase' : ''}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Location via Postcode */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Location</p>
                        <PostCodeInput
                            label="Postcode"
                            value=""
                            onChange={() => { }}
                            onResolved={handlePostcodeResolved}
                            placeholder="e.g. B1 1AA"
                        />
                    </div>

                    {/* Expiry Dates */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Expiry Dates</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tax Expiry</label>
                                <input type="date" name="taxExpiry" value={form.taxExpiry} onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B] transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">MOT Expiry</label>
                                <input type="date" name="motExpiry" value={form.motExpiry} onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B] transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* MOT PDF */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">MOT Document</p>
                        <div
                            onClick={() => motRef.current.click()}
                            className="flex items-center gap-3 border border-dashed border-gray-300 hover:border-[#C0392B] rounded-xl px-4 py-3 cursor-pointer transition-colors bg-gray-50"
                        >
                            <FiFileText size={18} className={motPdfFile ? 'text-[#C0392B]' : 'text-gray-400'} />
                            <span className={`text-sm ${motPdfFile ? 'text-[#C0392B] font-semibold' : 'text-gray-400'}`}>
                                {motPdfFile ? motPdfFile.name : 'Click to upload MOT PDF'}
                            </span>
                            <FiUpload size={14} className="ml-auto text-gray-400" />
                        </div>
                        <input ref={motRef} type="file" accept="application/pdf" className="hidden"
                            onChange={e => { if (e.target.files[0]) setMotPdfFile(e.target.files[0]); }} />
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
                        {loading ? 'Adding...' : 'Add Vehicle'}
                    </button>
                </div>
            </div>
        </div>
    );
}