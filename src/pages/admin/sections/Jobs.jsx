import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiX,
    FiEye,
    FiPackage,
    FiPhone,
    FiMail,
    FiCheck,
    FiArrowRight,
    FiMessageSquare
} from "react-icons/fi";
import { toast } from 'react-toastify';
import api from '../../../api/api';
import CancelJobDialog from "../../../components/admin/CancelJobDialog";
import EditJobForm from "../../../components/admin/EditJobForm";
import JobDetailsPanel from "../../../components/admin/JobDetailsPanel";

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

const formatJobDate = value => {
    if (!value) return "To be arranged";

    const parsedDate = new Date(`${value}T12:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return value;
    }

    return parsedDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};


const formatTimeSlot = value => {
    const labels = {
        early: "6:00 AM – 6:00 PM",
        morning: "8:00 AM – 6:00 PM",

        nine_to_five: "9:00 AM – 5:00 PM",
        nineToFive: "9:00 AM – 5:00 PM",
        "9_to_5": "9:00 AM – 5:00 PM",
        "9-5": "9:00 AM – 5:00 PM",

        afternoon: "9:00 AM – 4:00 PM",

        flexible: "I'm flexible with timing"
    };

    return labels[value] || value || "To be arranged";
};
const getId = value =>
    typeof value === "string" ? value : value?._id || "";




export default function Jobs() {
    const [activeTab, setActiveTab] = useState('active');
    const [jobs, setJobs] = useState({ active: [], on_way: [] });
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [editingJob, setEditingJob] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [assigning, setAssigning] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [cancelTarget, setCancelTarget] = useState(null);

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


    const handleUpdated = updatedJob => {

        setJobs(current => ({

            active: current.active.map(job =>
                job._id === updatedJob._id
                    ? updatedJob
                    : job
            ),

            on_way: current.on_way.map(job =>
                job._id === updatedJob._id
                    ? updatedJob
                    : job
            )

        }));

        setSelectedJob(updatedJob);

        setEditingJob(null);

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
            const response = await api.patch(
                `/jobs/${jobId}/status`,
                { status }
            );

            const updatedJob = response.data?.data;

            setJobs(previous => {
                const next = {
                    active: [...previous.active],
                    on_way: [...previous.on_way]
                };

                next[currentTab] = next[currentTab].filter(
                    job => job._id !== jobId
                );

                if (status === "on_way" && updatedJob) {
                    next.on_way = [
                        updatedJob,
                        ...next.on_way.filter(
                            job => job._id !== updatedJob._id
                        )
                    ];
                }

                return next;
            });

            setSelectedJob(null);

            toast.success("Job moved to On-Way!");
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to update job status"
            );
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


    const handleCancelJob = async reason => {
        if (!cancelTarget) return;

        setUpdatingStatus(true);

        try {
            await api.patch(
                `/jobs/${cancelTarget._id}/cancel`,
                { reason }
            );

            setJobs(previous => ({
                active: previous.active.filter(
                    job => job._id !== cancelTarget._id
                ),
                on_way: previous.on_way.filter(
                    job => job._id !== cancelTarget._id
                )
            }));

            setSelectedJob(null);
            setCancelTarget(null);

            toast.success("Job moved to Cancel section");
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to cancel job"
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
                    {currentJobs.map(job => {
                        return (
                            <div
                                key={job._id}
                                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
                            >
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

                                <div className="mb-4 grid gap-3 border-b border-gray-100 pb-4 text-sm sm:grid-cols-2 xl:grid-cols-5">
                                    <div>
                                        <p className="mb-0.5 text-xs font-semibold text-gray-400">
                                            Route
                                        </p>

                                        <p className="text-gray-700">
                                            {job.pickup?.postcode || "—"}
                                            {" → "}
                                            {job.delivery?.postcode || "—"}
                                        </p>

                                        <p className="text-xs font-semibold text-[#C0392B]">
                                            {Number(job.distance || 0)} miles
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-0.5 text-xs font-semibold text-gray-400">
                                            Pickup Date
                                        </p>

                                        <p className="font-semibold text-gray-700">
                                            {job.dateType === "flexible"
                                                ? "Flexible"
                                                : formatJobDate(job.date)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-0.5 text-xs font-semibold text-gray-400">
                                            Pickup Time
                                        </p>

                                        <p className="font-semibold text-gray-700">
                                            {job.dateType === "flexible"
                                                ? "Flexible"
                                                : formatTimeSlot(job.timeSlot)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-0.5 text-xs font-semibold text-gray-400">
                                            Estimated Delivery
                                        </p>

                                        <p className="font-semibold text-green-700">
                                            {job.estimatedDeliveryTime ||
                                                "To be arranged"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-0.5 text-xs font-semibold text-gray-400">
                                            Driver / Vehicle
                                        </p>

                                        <p className="text-gray-700">
                                            {job.assignedDriverName || "Not assigned"}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {job.assignedVehicleReg || "—"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openJob(job)}
                                        className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                    >
                                        <FiEye size={14} />
                                        View Details
                                    </button>

                                    {["active", "on_way"].includes(activeTab) && (
                                        <button
                                            type="button"
                                            disabled={updatingStatus}
                                            onClick={() => setCancelTarget(job)}
                                            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                                        >
                                            <FiX size={14} />
                                            Cancel Job
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedJob && (

                editingJob ? (

                    <>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingJob(null)}
                            className="fixed inset-0 bg-black/50 z-40"
                        />

                        <motion.div
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                            className="fixed top-16 right-0 h-[calc(100vh-64px)] w-96 bg-white z-50 overflow-y-auto shadow-2xl"
                        >

                            {/* Header */}

                            <div className="sticky top-0 bg-linear-to-r from-[#C0392B] to-red-700 text-white p-5 flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-bold">
                                        Edit Job
                                    </h2>

                                    <p className="text-red-100 text-sm mt-0.5">
                                        Ref: {editingJob.bookingRef}
                                    </p>

                                </div>

                                <button
                                    onClick={() => setEditingJob(null)}
                                    className="p-2 hover:bg-red-600 rounded-lg transition"
                                >
                                    <FiX size={22} />
                                </button>

                            </div>

                            <div className="p-5">

                                <EditJobForm
                                    job={editingJob}
                                    onUpdated={handleUpdated}
                                    onCancel={() => setEditingJob(null)}
                                />

                            </div>

                        </motion.div>

                    </>

                ) : (

                    <JobDetailsPanel
                        selectedJob={selectedJob}
                        activeTab={activeTab}

                        drivers={drivers}
                        vehicles={vehicles}

                        selectedDriverId={selectedDriverId}
                        selectedVehicleId={selectedVehicleId}

                        setSelectedDriverId={setSelectedDriverId}
                        setSelectedVehicleId={setSelectedVehicleId}

                        assigning={assigning}
                        updatingStatus={updatingStatus}

                        handleAssign={handleAssign}
                        handleStatusUpdate={handleStatusUpdate}
                        handleCompleteJob={handleCompleteJob}

                        onClose={() => setSelectedJob(null)}

                        onEdit={() => setEditingJob(selectedJob)}

                        setCancelTarget={setCancelTarget}

                        onUpdated={handleUpdated}
                    />

                )

            )}

            <CancelJobDialog
                open={Boolean(cancelTarget)}
                job={cancelTarget}
                loading={updatingStatus}
                onClose={() => {
                    if (!updatingStatus) {
                        setCancelTarget(null);
                    }
                }}
                onConfirm={handleCancelJob}
            />
        </div>
    );
}