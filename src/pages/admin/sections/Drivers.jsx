import React, { useState, useEffect, useRef } from 'react';
import {
    FiUser, FiPhone, FiEdit2, FiPlus, FiFileText, FiCheck, FiX, FiTrash2, FiUpload,
    FiSearch, FiChevronsRight, FiChevronsLeft
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../../api/api';
import AddDriverModal from '../../../components/admin/AddDriverModal';
import DeleteDriverModal from '../../../components/admin/DeleteDriverModal';

// ── Loader ──
function DriversLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-16 h-16 mb-5">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C0392B] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#C0392B]/20 animate-pulse" />
                </div>
            </div>
            <p className="text-sm font-semibold text-gray-400 tracking-wide">Loading Drivers...</p>
        </div>
    );
}

export default function Drivers() {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [detailCollapsed, setDetailCollapsed] = useState(false);

    // ── Edit state ──
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [editLicenceFile, setEditLicenceFile] = useState(null);
    const editLicenceRef = useRef();

    // ── Modal state ──
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteDriver, setDeleteDriver] = useState(null);

    // ── Fetch drivers ──
    useEffect(() => {
        const fetchDrivers = async () => {
            setPageLoading(true);
            try {
                const res = await api.get('/drivers');
                setDrivers(res.data.data);
            } catch (err) {
                toast.error('Failed to load drivers.');
            } finally {
                setPageLoading(false);
            }
        };
        fetchDrivers();
    }, []);

    // ── Select driver ──
    const handleSelectDriver = (driver) => {
        setSelectedDriver(driver);
        setIsEditing(false);
        setEditLicenceFile(null);
        setDetailCollapsed(false);
    };

    // ── Start editing ──
    const startEdit = () => {
        setEditForm({
            name: selectedDriver.name || '',
            phone: selectedDriver.phone || '',
            licenseNumber: selectedDriver.licenseNumber || '',
            joiningDate: selectedDriver.joiningDate || '',
            bankDetails: selectedDriver.bankDetails || '',
        });
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditLicenceFile(null);
    };

    // ── Save edit ──
    const saveEdit = async () => {
        if (!editForm.name.trim()) { toast.error('Driver name is required.'); return; }

        setActionLoading(true);
        try {
            const formData = new FormData();
            Object.entries(editForm).forEach(([k, v]) => formData.append(k, v));
            if (editLicenceFile) formData.append('licence', editLicenceFile);

            const res = await api.put(`/drivers/${selectedDriver._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const updated = res.data.data;
            setDrivers(prev => prev.map(d => d._id === updated._id ? updated : d));
            setSelectedDriver(updated);
            setIsEditing(false);
            setEditLicenceFile(null);
            toast.success('Driver updated.');
        } catch (err) {
            toast.error('Failed to update driver.');
        } finally {
            setActionLoading(false);
        }
    };

    // ── Add driver ──
    const handleAddDriver = async (formData) => {
        setActionLoading(true);
        try {
            const res = await api.post('/drivers', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const newDriver = res.data.data;
            setDrivers(prev => [newDriver, ...prev]);
            setShowAddModal(false);
            setSelectedDriver(newDriver);
            toast.success(`"${newDriver.name}" added.`);
        } catch (err) {
            toast.error('Failed to add driver.');
        } finally {
            setActionLoading(false);
        }
    };

    // ── Delete driver ──
    const handleDeleteDriver = async () => {
        setActionLoading(true);
        try {
            await api.delete(`/drivers/${deleteDriver._id}`);
            setDrivers(prev => prev.filter(d => d._id !== deleteDriver._id));
            if (selectedDriver?._id === deleteDriver._id) setSelectedDriver(null);
            toast.success(`"${deleteDriver.name}" removed.`);
            setDeleteDriver(null);
        } catch (err) {
            toast.error('Failed to remove driver.');
        } finally {
            setActionLoading(false);
        }
    };

    if (pageLoading) return <DriversLoader />;

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Driver Management</h1>
            <p className="text-gray-500 mb-8">Manage driver details, earnings, and assignments.</p>

            <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#C0392B] text-white rounded-lg hover:bg-red-800 transition font-semibold mb-8"
            >
                <FiPlus size={18} /> Add Driver
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Driver List ── */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-1 max-h-64 lg:max-h-150 overflow-y-auto">
                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">
                        Drivers <span className="text-sm font-normal text-gray-400">({drivers.length})</span>
                    </h3>

                    {/* Search */}
                    <div className="relative mb-3">
                        <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search drivers..."
                            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B] transition-all"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <FiX size={13} />
                            </button>
                        )}
                    </div>

                    {drivers.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">No drivers yet. Add one!</p>
                    ) : (
                        <div className="space-y-2">
                            {drivers.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">No drivers found.</p>
                            ) : null}
                            {drivers.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map(driver => (
                                <button
                                    key={driver._id}
                                    onClick={() => handleSelectDriver(driver)}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition flex items-center gap-3 ${selectedDriver?._id === driver._id
                                        ? 'border-[#C0392B] bg-red-50'
                                        : 'border-gray-200 bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="w-9 h-9 rounded-full shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center">
                                        <FiUser size={16} className="text-gray-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-[#1a1a1a] truncate">{driver.name}</p>
                                        <p className="text-xs text-gray-500">{driver.totalJobs} jobs completed</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Driver Detail ── */}
                <div className="lg:col-span-2">
                    {selectedDriver ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">

                            {/* Header */}
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    {/* Avatar large */}

                                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center shrink-0">
                                        <FiUser size={20} className="text-gray-400" />
                                    </div>
                                    <div>
                                        {isEditing ? (
                                            <input
                                                value={editForm.name}
                                                onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                                                className="text-lg lg:text-xl font-bold text-[#1a1a1a] border-b-2 border-[#C0392B] focus:outline-none bg-transparent w-full max-w-40"
                                            />
                                        ) : (
                                            <h2 className="text-2xl font-bold text-[#1a1a1a]">{selectedDriver.name}</h2>
                                        )}
                                        <p className="text-gray-500 text-sm">Driver ID: #{selectedDriver._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => setDetailCollapsed(p => !p)}
                                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                                        title={detailCollapsed ? 'Expand' : 'Collapse'}
                                    >
                                        {detailCollapsed ? <FiChevronsLeft size={15} /> : <FiChevronsRight size={15} />}
                                    </button>
                                    {!isEditing ? (
                                        <>
                                            {selectedDriver.licensePdfUrl ? (
                                                <a href={`http://localhost:5000/api/drivers/licence-proxy?url=${encodeURIComponent(selectedDriver.licensePdfUrl)}`}
                                                    download="licence.pdf"
                                                    className="flex items-center gap-2 px-3 py-2 bg-[#C0392B] text-white rounded-lg hover:bg-red-800 transition font-semibold text-sm">
                                                    <FiFileText size={15} /> View Licence
                                                </a>
                                            ) : (
                                                <button disabled className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-400 rounded-lg font-semibold text-sm cursor-not-allowed">
                                                    <FiFileText size={15} /> No Licence
                                                </button>
                                            )}
                                            <button onClick={startEdit}
                                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm">
                                                <FiEdit2 size={15} /> Edit
                                            </button>
                                            <button onClick={() => setDeleteDriver(selectedDriver)}
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



                            {!detailCollapsed && (<>

                                {/* Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-xs text-blue-600 uppercase font-semibold mb-2">Total Jobs</p>
                                        <p className="text-3xl font-bold text-blue-900">{selectedDriver.totalJobs}</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-xs text-green-600 uppercase font-semibold mb-2">Earnings</p>
                                        <p className="text-3xl font-bold text-green-900">£{selectedDriver.earnings}</p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <p className="text-xs text-yellow-600 uppercase font-semibold mb-2">Current Job</p>
                                        <p className="text-lg font-bold text-yellow-900">{selectedDriver.assignedNow || 'None'}</p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="mb-8 pb-8 border-b border-gray-200">
                                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Contact Information</h3>
                                    <div className="flex items-center gap-3">
                                        <FiPhone className="text-gray-400 shrink-0" size={18} />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                                            {isEditing ? (
                                                <input value={editForm.phone}
                                                    onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                                                    placeholder="+44 7700 900000"
                                                    className="w-full border-b border-gray-300 focus:border-[#C0392B] focus:outline-none text-sm py-1 bg-transparent text-gray-700 font-semibold" />
                                            ) : (
                                                <p className="text-gray-700 font-semibold">{selectedDriver.phone || '—'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Employment */}
                                <div className="mb-8 pb-8 border-b border-gray-200">
                                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Employment Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Driving Licence Number</p>
                                            {isEditing ? (
                                                <input value={editForm.licenseNumber}
                                                    onChange={e => setEditForm(p => ({ ...p, licenseNumber: e.target.value }))}
                                                    placeholder="KHANA123456"
                                                    className="w-full border-b border-gray-300 focus:border-[#C0392B] focus:outline-none text-sm py-1 font-mono bg-transparent text-gray-700 font-semibold" />
                                            ) : (
                                                <p className="text-gray-700 font-mono font-semibold">{selectedDriver.licenseNumber || '—'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Joining Date</p>
                                            {isEditing ? (
                                                <input type="date" value={editForm.joiningDate}
                                                    onChange={e => setEditForm(p => ({ ...p, joiningDate: e.target.value }))}
                                                    className="border-b border-gray-300 focus:border-[#C0392B] focus:outline-none text-sm py-1 bg-transparent text-gray-700 font-semibold" />
                                            ) : (
                                                <p className="text-gray-700 font-semibold">{selectedDriver.joiningDate || '—'}</p>
                                            )}
                                        </div>

                                        {/* Licence PDF upload in edit mode */}
                                        {isEditing && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Replace Licence PDF</p>
                                                <div
                                                    onClick={() => editLicenceRef.current.click()}
                                                    className="flex items-center gap-3 border border-dashed border-gray-300 hover:border-[#C0392B] rounded-xl px-4 py-2.5 cursor-pointer transition-colors bg-gray-50"
                                                >
                                                    <FiFileText size={16} className={editLicenceFile ? 'text-[#C0392B]' : 'text-gray-400'} />
                                                    <span className={`text-sm ${editLicenceFile ? 'text-[#C0392B] font-semibold' : 'text-gray-400'}`}>
                                                        {editLicenceFile ? editLicenceFile.name : 'Click to replace PDF'}
                                                    </span>
                                                    <FiUpload size={13} className="ml-auto text-gray-400" />
                                                </div>
                                                <input ref={editLicenceRef} type="file" accept="application/pdf" className="hidden"
                                                    onChange={e => { if (e.target.files[0]) setEditLicenceFile(e.target.files[0]); }} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bank Details */}
                                <div>
                                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Bank Details</h3>
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-xs text-red-600 uppercase font-semibold mb-2">Bank Account</p>
                                        {isEditing ? (
                                            <input value={editForm.bankDetails}
                                                onChange={e => setEditForm(p => ({ ...p, bankDetails: e.target.value }))}
                                                placeholder="Sort: 12-34-56 | Acc: 12345678"
                                                className="w-full bg-transparent border-b border-red-300 focus:border-red-600 focus:outline-none text-sm font-mono text-red-900 py-1" />
                                        ) : (
                                            <p className="text-red-900 font-mono text-sm">{selectedDriver.bankDetails || '—'}</p>
                                        )}
                                    </div>
                                </div>
                            </>)}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <FiUser size={40} className="text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-500">Select a driver to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modals ── */}
            <AddDriverModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddDriver}
                loading={actionLoading}
            />

            <DeleteDriverModal
                driver={deleteDriver}
                onCancel={() => setDeleteDriver(null)}
                onConfirm={handleDeleteDriver}
                loading={actionLoading}
            />
        </div>
    );
}