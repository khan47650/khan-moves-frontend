import React, { useState, useEffect, useRef } from 'react';
import {
    FiTruck, FiPlus, FiCheckCircle, FiAlertCircle,
    FiEdit2, FiCheck, FiX, FiTrash2, FiFileText,
    FiUpload, FiSearch, FiChevronsRight, FiChevronsLeft
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../../api/api';
import AddVehicleModal from '../../../components/admin/AddVehicleModal';
import DeleteVehicleModal from '../../../components/admin/DeleteVehicleModal';

// ── Helpers ───────────────────
const getDaysLeft = (dateStr) => {
    if (!dateStr) return null;
    const exp = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
};

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const ExpiryCard = ({ label, dateStr }) => {
    const days = getDaysLeft(dateStr);
    const isExpired = days !== null && days <= 0;
    const isWarning = days !== null && days > 0 && days <= 30;
    const isOk = days !== null && days > 30;
    const color = isExpired || isWarning ? 'red' : 'green';

    return (
        <div className={`p-4 rounded-lg border-2 flex items-center justify-between
            ${color === 'red' ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
            <div>
                <p className={`text-xs uppercase font-bold mb-1 ${color === 'red' ? 'text-red-600' : 'text-green-600'}`}>{label}</p>
                <p className={`text-sm font-semibold ${color === 'red' ? 'text-red-800' : 'text-green-800'}`}>
                    Expires: {formatDate(dateStr)}
                </p>
                {days !== null && (
                    <p className={`text-xs font-semibold mt-0.5 ${color === 'red' ? 'text-red-500' : 'text-green-500'}`}>
                        {isExpired ? 'EXPIRED' : `${days} days left`}
                    </p>
                )}
            </div>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${color === 'red' ? 'bg-red-100' : 'bg-green-100'}`}>
                <FiCheckCircle className={color === 'red' ? 'text-red-500' : 'text-green-500'} size={22} />
            </div>
        </div>
    );
};

// ── Loader ───────────
function VehiclesLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-16 h-16 mb-5">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C0392B] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#C0392B]/20 animate-pulse" />
                </div>
            </div>
            <p className="text-sm font-semibold text-gray-400 tracking-wide">Loading Vehicles...</p>
        </div>
    );
}

// ── Edit fields config ────────────────────────────────────────────────────────
const EDIT_GROUPS = [
    {
        title: 'Basic Info',
        fields: [
            { name: 'regNumber', label: 'Reg Number', mono: true },
            { name: 'makeModel', label: 'Make / Model' },
            { name: 'type', label: 'Type' },
            { name: 'category', label: 'Category' },
        ]
    },
    {
        title: 'Specifications',
        fields: [
            { name: 'loadingCapacity', label: 'Loading Capacity' },
            { name: 'payload', label: 'Payload' },
            { name: 'maxLength', label: 'Max Length' },
            { name: 'motorbikesCapacity', label: 'Motorbikes Capacity' },
            { name: 'tailLift', label: 'Tail Lift' },
        ]
    },
    {
        title: 'Other Info',
        fields: [
            { name: 'fuelType', label: 'Fuel Type' },
            { name: 'seats', label: 'Seats' },
            { name: 'useOfTrailer', label: 'Use of Trailer' },
            { name: 'location', label: 'Location' },
            { name: 'assignedDriver', label: 'Assigned Driver' },
        ]
    },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [detailCollapsed, setDetailCollapsed] = useState(false);

    // ── Edit state ──
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [editMotFile, setEditMotFile] = useState(null);
    const editMotRef = useRef();

    // ── Modal state ──
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteVehicle, setDeleteVehicle] = useState(null);

    // ── Fetch ──
    useEffect(() => {
        const fetchVehicles = async () => {
            setPageLoading(true);
            try {
                const res = await api.get('/vehicles');
                setVehicles(res.data.data);
            } catch (err) {
                toast.error('Failed to load vehicles.');
            } finally {
                setPageLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    const filteredVehicles = vehicles.filter(v =>
        v.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.makeModel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ── Select ──
    const handleSelect = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsEditing(false);
        setEditMotFile(null);
        setDetailCollapsed(false);
    };

    // ── Edit ──
    const startEdit = () => {
        setEditForm({
            regNumber: selectedVehicle.regNumber || '',
            makeModel: selectedVehicle.makeModel || '',
            type: selectedVehicle.type || '',
            category: selectedVehicle.category || '',
            loadingCapacity: selectedVehicle.loadingCapacity || '',
            payload: selectedVehicle.payload || '',
            maxLength: selectedVehicle.maxLength || '',
            motorbikesCapacity: selectedVehicle.motorbikesCapacity || '',
            tailLift: selectedVehicle.tailLift || '',
            fuelType: selectedVehicle.fuelType || '',
            seats: selectedVehicle.seats || '',
            useOfTrailer: selectedVehicle.useOfTrailer || '',
            location: selectedVehicle.location || '',
            assignedDriver: selectedVehicle.assignedDriver || '',
            taxExpiry: selectedVehicle.taxExpiry || '',
            motExpiry: selectedVehicle.motExpiry || '',
        });
        setIsEditing(true);
    };

    const cancelEdit = () => { setIsEditing(false); setEditMotFile(null); };

    const saveEdit = async () => {
        if (!editForm.regNumber.trim()) { toast.error('Reg number is required.'); return; }
        setActionLoading(true);
        try {
            const formData = new FormData();
            Object.entries(editForm).forEach(([k, v]) => formData.append(k, v));
            if (editMotFile) formData.append('motPdf', editMotFile);

            const res = await api.put(`/vehicles/${selectedVehicle._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const updated = res.data.data;
            setVehicles(prev => prev.map(v => v._id === updated._id ? updated : v));
            setSelectedVehicle(updated);
            setIsEditing(false);
            setEditMotFile(null);
            toast.success('Vehicle updated.');
        } catch (err) {
            toast.error('Failed to update vehicle.');
        } finally {
            setActionLoading(false);
        }
    };

    // ── Add ──
    const handleAddVehicle = async (formData) => {
        setActionLoading(true);
        try {
            const res = await api.post('/vehicles', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const newVehicle = res.data.data;
            setVehicles(prev => [newVehicle, ...prev]);
            setShowAddModal(false);
            setSelectedVehicle(newVehicle);
            toast.success(`"${newVehicle.regNumber}" added.`);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to add vehicle.';
            toast.error(msg);
        } finally {
            setActionLoading(false);
        }
    };

    // ── Delete ──
    const handleDeleteVehicle = async () => {
        setActionLoading(true);
        try {
            await api.delete(`/vehicles/${deleteVehicle._id}`);
            setVehicles(prev => prev.filter(v => v._id !== deleteVehicle._id));
            if (selectedVehicle?._id === deleteVehicle._id) setSelectedVehicle(null);
            toast.success(`"${deleteVehicle.regNumber}" removed.`);
            setDeleteVehicle(null);
        } catch (err) {
            toast.error('Failed to remove vehicle.');
        } finally {
            setActionLoading(false);
        }
    };

    if (pageLoading) return <VehiclesLoader />;

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Vehicle Management</h1>
            <p className="text-gray-500 mb-8">Manage van specifications, MOT, and assignments.</p>

            <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#C0392B] text-white rounded-lg hover:bg-red-800 transition font-semibold mb-8"
            >
                <FiPlus size={18} /> Add Vehicle
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Vehicle List ── */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-1 max-h-64 lg:max-h-175 overflow-y-auto">
                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">
                        Vehicles <span className="text-sm font-normal text-gray-400">({vehicles.length})</span>
                    </h3>

                    {/* Search */}
                    <div className="relative mb-3">
                        <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search vehicles..."
                            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B] transition-all"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <FiX size={13} />
                            </button>
                        )}
                    </div>

                    {filteredVehicles.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">
                            {searchQuery ? 'No vehicles found.' : 'No vehicles yet. Add one!'}
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {filteredVehicles.map(vehicle => {
                                const taxDays = getDaysLeft(vehicle.taxExpiry);
                                const motDays = getDaysLeft(vehicle.motExpiry);
                                const hasWarning = (taxDays !== null && taxDays <= 30) || (motDays !== null && motDays <= 30);
                                return (
                                    <button
                                        key={vehicle._id}
                                        onClick={() => handleSelect(vehicle)}
                                        className={`w-full text-left p-3 rounded-lg border-2 transition ${selectedVehicle?._id === vehicle._id
                                            ? 'border-[#C0392B] bg-red-50'
                                            : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                                    >
                                        <p className="font-semibold text-[#1a1a1a] flex items-center gap-2">
                                            <FiTruck size={15} />
                                            {vehicle.regNumber}
                                            {hasWarning && (
                                                <span className="ml-auto w-2 h-2 rounded-full bg-red-500 shrink-0" title="Expiry warning" />
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">{vehicle.makeModel || '—'}</p>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Vehicle Detail ── */}
                <div className="lg:col-span-2">
                    {selectedVehicle ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">

                            {/* Header */}
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-6 pb-6 border-b border-gray-200">
                                <div>
                                    {isEditing ? (
                                        <input
                                            value={editForm.regNumber}
                                            onChange={e => setEditForm(p => ({ ...p, regNumber: e.target.value }))}
                                            className="text-2xl font-bold text-[#1a1a1a] border-b-2 border-[#C0392B] focus:outline-none bg-transparent font-mono uppercase w-full"
                                        />
                                    ) : (
                                        <h2 className="text-2xl font-bold text-[#1a1a1a] font-mono">{selectedVehicle.regNumber}</h2>
                                    )}
                                    <p className="text-gray-500 text-sm mt-0.5">{selectedVehicle.makeModel || '—'}</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Collapse toggle */}
                                    <button
                                        onClick={() => setDetailCollapsed(p => !p)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                                        title={detailCollapsed ? 'Expand' : 'Collapse'}
                                    >
                                        {detailCollapsed ? <FiChevronsLeft size={15} /> : <FiChevronsRight size={15} />}
                                    </button>

                                    {!isEditing ? (
                                        <>
                                            {selectedVehicle.motPdfUrl ? (

                                                <a href={`http://localhost:5000/api/vehicles/mot-proxy?url=${encodeURIComponent(selectedVehicle.motPdfUrl)}`}
                                                    download="MOT.pdf"
                                                    className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition"
                                                >
                                                    <FiFileText size={15} /> MOT
                                                </a>
                                            ) : (
                                                <button disabled className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-400 rounded-lg font-semibold text-sm cursor-not-allowed">
                                                    <FiFileText size={15} /> No MOT
                                                </button>
                                            )}
                                            <button onClick={startEdit}
                                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm">
                                                <FiEdit2 size={15} /> Edit
                                            </button>
                                            <button onClick={() => setDeleteVehicle(selectedVehicle)}
                                                className="flex items-center gap-2 px-3 py-2 bg-red-50 text-[#C0392B] rounded-lg hover:bg-red-100 transition font-semibold text-sm">
                                                <FiTrash2 size={15} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={saveEdit} disabled={actionLoading}
                                                className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white rounded-lg font-semibold text-sm transition">
                                                {actionLoading
                                                    ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                    : <FiCheck size={15} />
                                                }
                                                Save
                                            </button>
                                            <button onClick={cancelEdit}
                                                className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 font-semibold text-sm transition">
                                                <FiX size={15} /> Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Collapsible body */}
                            {!detailCollapsed && (<>

                                {/* Tax & MOT Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    {isEditing ? (
                                        <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tax Expiry</label>
                                                <input type="date" value={editForm.taxExpiry}
                                                    onChange={e => setEditForm(p => ({ ...p, taxExpiry: e.target.value }))}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B]" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">MOT Expiry</label>
                                                <input type="date" value={editForm.motExpiry}
                                                    onChange={e => setEditForm(p => ({ ...p, motExpiry: e.target.value }))}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B]" />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <ExpiryCard label="TAX" dateStr={selectedVehicle.taxExpiry} />
                                            <ExpiryCard label="MOT" dateStr={selectedVehicle.motExpiry} />
                                        </>
                                    )}
                                </div>

                                {/* Edit fields */}
                                {isEditing ? (
                                    <div className="space-y-6 mb-6">
                                        {EDIT_GROUPS.map(group => (
                                            <div key={group.title}>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">{group.title}</p>
                                                <div className="space-y-3">
                                                    {group.fields.map(f => (
                                                        <div key={f.name} className="grid grid-cols-2 gap-2 items-center">
                                                            <p className="text-xs text-gray-500 font-semibold uppercase">{f.label}</p>
                                                            <input
                                                                value={editForm[f.name] || ''}
                                                                onChange={e => setEditForm(p => ({ ...p, [f.name]: e.target.value }))}
                                                                className={`border-b border-gray-300 focus:border-[#C0392B] focus:outline-none text-sm py-1 bg-transparent text-gray-700 font-semibold ${f.mono ? 'font-mono uppercase' : ''}`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        {/* MOT PDF replace */}
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Replace MOT PDF</p>
                                            <div
                                                onClick={() => editMotRef.current.click()}
                                                className="flex items-center gap-3 border border-dashed border-gray-300 hover:border-[#C0392B] rounded-xl px-4 py-2.5 cursor-pointer transition-colors bg-gray-50"
                                            >
                                                <FiFileText size={16} className={editMotFile ? 'text-[#C0392B]' : 'text-gray-400'} />
                                                <span className={`text-sm ${editMotFile ? 'text-[#C0392B] font-semibold' : 'text-gray-400'}`}>
                                                    {editMotFile ? editMotFile.name : 'Click to replace MOT PDF'}
                                                </span>
                                                <FiUpload size={13} className="ml-auto text-gray-400" />
                                            </div>
                                            <input ref={editMotRef} type="file" accept="application/pdf" className="hidden"
                                                onChange={e => { if (e.target.files[0]) setEditMotFile(e.target.files[0]); }} />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* View mode details */}
                                        <div className="mb-8 pb-8 border-b border-gray-200">
                                            <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Vehicle Details</h3>
                                            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                                                <p className="text-gray-500">Type</p><p className="font-semibold text-gray-700">{selectedVehicle.type || '—'}</p>
                                                <p className="text-gray-500">Category</p><p className="font-semibold text-gray-700">{selectedVehicle.category || '—'}</p>
                                                <p className="text-gray-500">Make / Model</p><p className="font-semibold text-gray-700">{selectedVehicle.makeModel || '—'}</p>
                                            </div>
                                        </div>

                                        <div className="mb-8 pb-8 border-b border-gray-200">
                                            <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Van Specifications</h3>
                                            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                                                <p className="text-gray-500">Loading Capacity</p><p className="font-semibold text-gray-700">{selectedVehicle.loadingCapacity || '—'}</p>
                                                <p className="text-gray-500">Payload</p><p className="font-semibold text-gray-700">{selectedVehicle.payload || '—'}</p>
                                                <p className="text-gray-500">Max Length</p><p className="font-semibold text-gray-700">{selectedVehicle.maxLength || '—'}</p>
                                                <p className="text-gray-500">Motorbikes Capacity</p><p className="font-semibold text-gray-700">{selectedVehicle.motorbikesCapacity || '—'}</p>
                                                <p className="text-gray-500">Tail Lift</p><p className="font-semibold text-gray-700">{selectedVehicle.tailLift || '—'}</p>
                                            </div>
                                        </div>

                                        <div className="mb-8">
                                            <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Other Information</h3>
                                            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                                                <p className="text-gray-500">Fuel Type</p><p className="font-semibold text-gray-700">{selectedVehicle.fuelType || '—'}</p>
                                                <p className="text-gray-500">Seats</p><p className="font-semibold text-gray-700">{selectedVehicle.seats || '—'}</p>
                                                <p className="text-gray-500">Use of Trailer</p><p className="font-semibold text-gray-700">{selectedVehicle.useOfTrailer || '—'}</p>
                                                <p className="text-gray-500">Location</p><p className="font-semibold text-gray-700">{selectedVehicle.location || '—'}</p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-3">
                                            <FiAlertCircle className="text-gray-400 shrink-0" size={18} />
                                            <p className="text-sm text-gray-600">
                                                Assigned to driver: <span className="font-semibold text-[#C0392B]">{selectedVehicle.assignedDriver || 'Unassigned'}</span>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </>)}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <FiTruck size={40} className="text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-500">Select a vehicle to view details</p>
                        </div>
                    )}
                </div>
            </div>

            <AddVehicleModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddVehicle}
                loading={actionLoading}
            />

            <DeleteVehicleModal
                vehicle={deleteVehicle}
                onCancel={() => setDeleteVehicle(null)}
                onConfirm={handleDeleteVehicle}
                loading={actionLoading}
            />
        </div >
    );
}