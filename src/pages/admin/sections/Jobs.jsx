import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiX, FiEye, FiPackage, FiPhone, FiMail,
    FiClock, FiCheck, FiArrowRight, FiLayers, FiMessageSquare
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../../api/api';

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
            <p className="text-sm font-semibold text-gray-400">Loading jobs...</p>
        </div>
    );
}

const getId = value =>
    typeof value === "string" ? value : value?._id || "";

export default function Jobs() {
    const [activeTab, setActiveTab] = useState('active');
    const [jobs, setJobs] = useState({ active: [], on_way: [] });
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [assigning, setAssigning] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [activeRes, onWayRes] = await Promise.all([
                api.get('/jobs?status=active'),
                api.get('/jobs?status=on_way'),
            ]);
            setJobs({
                active: activeRes.data?.data || [],
                on_way: onWayRes.data?.data || [],
            });
        } catch {
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const openJob = async job => {
        setSelectedJob(job);

        const driverId = getId(job.assignedDriver);
        const vehicleId = getId(job.assignedVehicle);

        setSelectedDriverId(driverId);
        setSelectedVehicleId(vehicleId);

        try {
            const res = await api.get("/jobs/available-resources", {
                params: {
                    date: job.date || "",
                    timeSlot: job.timeSlot || "",
                    jobId: job._id
                }
            });

            let availableDrivers = res.data?.data?.drivers || [];
            let availableVehicles = res.data?.data?.vehicles || [];

            if (
                driverId &&
                !availableDrivers.some(driver => driver._id === driverId)
            ) {
                const assignedDriver =
                    typeof job.assignedDriver === "object"
                        ? job.assignedDriver
                        : {
                            _id: driverId,
                            name: job.assignedDriverName || "Assigned Driver",
                            phone: job.assignedDriverPhone || ""
                        };

                availableDrivers = [assignedDriver, ...availableDrivers];
            }

            if (
                vehicleId &&
                !availableVehicles.some(vehicle => vehicle._id === vehicleId)
            ) {
                const assignedVehicle =
                    typeof job.assignedVehicle === "object"
                        ? job.assignedVehicle
                        : {
                            _id: vehicleId,
                            regNumber: job.assignedVehicleReg || "Assigned Vehicle",
                            makeModel: job.assignedVehicleModel || ""
                        };

                availableVehicles = [assignedVehicle, ...availableVehicles];
            }

            setDrivers(availableDrivers);
            setVehicles(availableVehicles);
        } catch {
            setDrivers(
                driverId
                    ? [{
                        _id: driverId,
                        name: job.assignedDriverName || "Assigned Driver",
                        phone: job.assignedDriverPhone || ""
                    }]
                    : []
            );

            setVehicles(
                vehicleId
                    ? [{
                        _id: vehicleId,
                        regNumber: job.assignedVehicleReg || "Assigned Vehicle",
                        makeModel: job.assignedVehicleModel || ""
                    }]
                    : []
            );
        }
    };

    const handleAssign = async () => {
        if (!selectedJob) return;
        if (!selectedDriverId && !selectedVehicleId) { toast.error('Select driver or vehicle'); return; }
        setAssigning(true);
        try {
            const res = await api.patch(`/jobs/${selectedJob._id}/assign`, {
                driverId: selectedDriverId || undefined,
                vehicleId: selectedVehicleId || undefined,
            });
            const updated = res.data.data;
            setJobs(prev => ({
                ...prev,
                active: prev.active.map(j => j._id === updated._id ? updated : j),
            }));

            setSelectedJob(updated);
            setSelectedDriverId(getId(updated.assignedDriver));
            setSelectedVehicleId(getId(updated.assignedVehicle));
            toast.success('Driver/Vehicle assigned & WhatsApp sent!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to assign');
        } finally {
            setAssigning(false);
        }
    };

    const handleStatusUpdate = async (jobId, status, currentTab) => {
        setUpdatingStatus(true);
        try {
            await api.patch(`/jobs/${jobId}/status`, { status });
            setJobs(prev => {
                const updated = { ...prev };
                // Remove from current tab
                updated[currentTab] = prev[currentTab].filter(j => j._id !== jobId);
                // Add to new tab if applicable
                if (status === 'on_way') {
                    const job = prev[currentTab].find(j => j._id === jobId);
                    if (job) updated.on_way = [{ ...job, status: 'on_way' }, ...prev.on_way];
                }
                return updated;
            });
            setSelectedJob(null);
            toast.success(status === 'on_way' ? 'Job moved to On-Way!' : 'Job cancelled.');
        } catch {
            toast.error('Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };
    const handleCompleteJob = async (jobId) => {
        setUpdatingStatus(true);

        try {
            await api.patch(`/jobs/${jobId}/status`, {
                status: "completed"
            });

            setJobs(prev => ({
                ...prev,
                on_way: prev.on_way.filter(j => j._id !== jobId)
            }));

            setSelectedJob(null);

            toast.success("Job completed!");

            await api.post(`/jobs/${jobId}/complete-email`);

        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to complete job"
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    const currentJobs = activeTab === 'active' ? jobs.active : jobs.on_way;

    return (
        <div className="relative">
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Jobs Management</h1>
            <p className="text-gray-500 mb-6">Manage all customer jobs across different stages.</p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                {[
                    { id: 'active', label: 'Active', count: jobs.active.length },
                    { id: 'on_way', label: 'On-Way', count: jobs.on_way.length },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 font-semibold text-sm border-b-2 transition ${activeTab === tab.id ? 'border-[#C0392B] text-[#C0392B]' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {loading ? <SectionLoader /> : currentJobs.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                    <FiPackage size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No {activeTab === 'active' ? 'active' : 'on-way'} jobs</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {currentJobs.map(job => (
                        <div key={job._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-sm text-gray-500">Ref: <span className="font-bold text-[#C0392B] text-base">{job.bookingRef}</span></p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {job.serviceType || "—"}
                                    </p>
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${activeTab === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {activeTab === 'active' ? 'ACTIVE' : 'ON-WAY'}
                                </span>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100 text-sm">
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold mb-0.5">Route</p>
                                    <p className="text-gray-700">{job.pickup?.postcode || '—'} → {job.delivery?.postcode || '—'}</p>
                                    <p className="text-xs text-gray-500">{job.distance || 0} miles</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold mb-0.5">Date</p>
                                    <p className="text-gray-700">{job.dateType === 'flexible' ? 'Flexible' : job.date || '—'}</p>
                                    <p className="text-xs text-gray-500 capitalize">{job.timeSlot || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold mb-0.5">Driver / Vehicle</p>
                                    <p className="text-gray-700">{job.assignedDriverName || 'Not assigned'}</p>
                                    <p className="text-xs text-gray-500">{job.assignedVehicleReg || '—'}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => openJob(job)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-xs font-semibold"
                            >
                                <FiEye size={14} /> View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Side Panel */}
            <AnimatePresence>
                {selectedJob && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedJob(null)}
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
                                    <h2 className="text-xl font-bold">{selectedJob.customer?.name || '—'}</h2>
                                    <p className="text-red-100 text-sm mt-0.5">Ref: {selectedJob.bookingRef}</p>
                                </div>
                                <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-red-600 rounded-lg transition">
                                    <FiX size={22} />
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${activeTab === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {activeTab === 'active' ? 'ACTIVE' : 'ON-WAY'}
                                </span>

                                {/* Contact */}
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase">Contact</h4>
                                    {selectedJob.customer?.phone && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#C0392B]/10 rounded-lg flex items-center justify-center shrink-0"><FiPhone className="text-[#C0392B]" size={14} /></div>
                                            <p className="text-sm text-gray-700">{selectedJob.customer.phone}</p>
                                        </div>
                                    )}
                                    {selectedJob.customer?.email && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#C0392B]/10 rounded-lg flex items-center justify-center shrink-0"><FiMail className="text-[#C0392B]" size={14} /></div>
                                            <p className="text-sm text-gray-700 truncate">{selectedJob.customer.email}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Route */}
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                    <h4 className="text-xs font-bold text-blue-500 uppercase mb-3">Route</h4>
                                    <div className="mb-2">
                                        <p className="text-xs text-gray-500 mb-0.5">Pickup</p>
                                        <p className="text-sm font-bold text-[#1a1a1a]">{selectedJob.pickup?.address || '—'}</p>
                                        <p className="text-xs text-gray-500">{selectedJob.pickup?.postcode}</p>
                                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                                            {selectedJob.pickupFloor?.floorLevel && selectedJob.pickupFloor.floorLevel !== 'ground' && (
                                                <span className="flex items-center gap-1"><FiLayers size={11} /> {selectedJob.pickupFloor.floorLevel}</span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <FiCheck size={11} className={selectedJob.pickupFloor?.hasLift ? 'text-green-500' : 'text-gray-300'} />
                                                Lift {selectedJob.pickupFloor?.hasLift ? 'Yes' : 'No'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiCheck size={11} className={selectedJob.pickupFloor?.hasParking ? 'text-green-500' : 'text-gray-300'} />
                                                Parking {selectedJob.pickupFloor?.hasParking ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-[#C0392B] text-sm my-1 ml-1">↓</div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Delivery</p>
                                        <p className="text-sm font-bold text-[#1a1a1a]">{selectedJob.delivery?.address || '—'}</p>
                                        <p className="text-xs text-gray-500">{selectedJob.delivery?.postcode}</p>
                                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                                            {selectedJob.deliveryFloor?.floorLevel && selectedJob.deliveryFloor.floorLevel !== 'ground' && (
                                                <span className="flex items-center gap-1"><FiLayers size={11} /> {selectedJob.deliveryFloor.floorLevel}</span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <FiCheck size={11} className={selectedJob.deliveryFloor?.hasLift ? 'text-green-500' : 'text-gray-300'} />
                                                Lift {selectedJob.deliveryFloor?.hasLift ? 'Yes' : 'No'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiCheck size={11} className={selectedJob.deliveryFloor?.hasParking ? 'text-green-500' : 'text-gray-300'} />
                                                Parking {selectedJob.deliveryFloor?.hasParking ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">{selectedJob.distance || 0} miles</p>
                                </div>

                                {/* Date & Time */}
                                <div className="border border-gray-100 rounded-xl p-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Date & Time</h4>
                                    <div className="flex items-center gap-2">
                                        <FiClock size={14} className="text-gray-400" />
                                        <p className="text-sm text-gray-700">
                                            {selectedJob.dateType === 'flexible' ? 'Flexible dates' : selectedJob.date || '—'}
                                            {selectedJob.timeSlot && <span className="ml-2 capitalize text-gray-500">· {selectedJob.timeSlot}</span>}
                                        </p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="border border-gray-100 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiPackage size={14} className="text-[#C0392B]" />
                                        <h4 className="text-xs font-bold text-gray-500 uppercase">Items ({selectedJob.items?.length || 0})</h4>
                                    </div>
                                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                                        {(selectedJob.items || []).map((it, i) => (
                                            <div key={i} className="flex justify-between text-sm bg-gray-50 px-3 py-1.5 rounded-lg">
                                                <span className="text-gray-700 truncate flex-1">{it.name}</span>
                                                <span className="text-gray-500 font-bold shrink-0 ml-2">x{it.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="bg-[#1a1a1a] rounded-xl p-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-400">Total Price</p>
                                    <p className="text-2xl font-black text-[#F1C40F]">£{selectedJob.totalPrice || 0}</p>
                                </div>

                                {/* Special Instructions */}
                                {selectedJob.specialInstructions && (
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                        <p className="text-xs font-bold text-amber-700 uppercase mb-2">Special Instructions</p>
                                        <p className="text-sm text-amber-800">{selectedJob.specialInstructions}</p>
                                    </div>
                                )}

                                {/* Assign Driver & Vehicle — Active only */}
                                {activeTab === 'active' && (
                                    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase">Assign Driver & Vehicle</h4>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Driver</label>
                                            <select
                                                value={selectedDriverId}
                                                onChange={e => setSelectedDriverId(e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C0392B] transition"
                                            >
                                                <option value="">Select Driver</option>
                                                {drivers.map(d => (
                                                    <option key={d._id} value={d._id}>{d.name} — {d.phone}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Vehicle</label>
                                            <select
                                                value={selectedVehicleId}
                                                onChange={e => setSelectedVehicleId(e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C0392B] transition"
                                            >
                                                <option value="">Select Vehicle</option>
                                                {vehicles.map(v => (
                                                    <option key={v._id} value={v._id}>{v.regNumber} — {v.makeModel}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={handleAssign}
                                            disabled={assigning || (!selectedDriverId && !selectedVehicleId)}
                                            className="w-full py-2.5 bg-[#1a1a1a] hover:bg-black text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {assigning
                                                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Assigning...</>
                                                : <><FiMessageSquare size={14} /> Assign & Notify Driver</>}
                                        </button>
                                    </div>
                                )}

                                {/* On-Way: show assigned info */}
                                {activeTab === 'on_way' && (
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Assigned</h4>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Driver</span>
                                            <span className="font-semibold text-[#1a1a1a]">{selectedJob.assignedDriverName || '—'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Vehicle</span>
                                            <span className="font-semibold text-[#1a1a1a]">{selectedJob.assignedVehicleReg || '—'}</span>
                                        </div>
                                    </div>
                                )}
                                {/* Action Buttons */}
                                <div className="space-y-2 pt-2 border-t border-gray-100">
                                    {activeTab === 'active' && (
                                        <button
                                            onClick={() => handleStatusUpdate(selectedJob._id, 'on_way', 'active')}
                                            disabled={updatingStatus}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition disabled:opacity-50"
                                        >
                                            {updatingStatus ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</> : <><FiArrowRight size={16} /> Go On-Way</>}
                                        </button>
                                    )}
                                    {activeTab === 'on_way' && (
                                        <button
                                            onClick={() => handleCompleteJob(selectedJob._id)}
                                            disabled={updatingStatus}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition disabled:opacity-50"
                                        >
                                            {updatingStatus ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Completing...</> : <><FiCheck size={16} /> Complete Job</>}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleStatusUpdate(selectedJob._id, 'in_trash', activeTab)}
                                        disabled={updatingStatus}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-bold text-sm transition disabled:opacity-50"
                                    >
                                        <FiX size={16} /> Cancel Job
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