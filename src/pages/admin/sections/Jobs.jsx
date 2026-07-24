import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiX,
    FiEye,
    FiPackage,
    FiPhone,
    FiMail,
    FiClock,
    FiCheck,
    FiArrowRight,
    FiLayers,
    FiMessageSquare,
    FiCalendar,
    FiSave
} from "react-icons/fi";
import { toast } from 'react-toastify';
import api from '../../../api/api';
import CancelJobDialog from "../../../components/admin/CancelJobDialog";

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
        afternoon: "9:00 AM – 4:00 PM",
        flexible: "Flexible timing"
    };

    return labels[value] || value || "To be arranged";
};

const getJobCardSchedule = job => {
    if (job.dateType === "flexible") {
        return {
            type: "flexible",
            label: "Flexible"
        };
    }

    const pickupDate = job.date || "";
    const deliveryDate = job.deliveryDate || "";

    if (
        pickupDate &&
        deliveryDate &&
        pickupDate === deliveryDate
    ) {
        return {
            type: "same",
            label: formatJobDate(pickupDate)
        };
    }

    return {
        type: "different",
        pickup: formatJobDate(pickupDate),
        delivery: formatJobDate(deliveryDate)
    };
};

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

    const [cancelTarget, setCancelTarget] = useState(null);
    const [savingSchedule, setSavingSchedule] = useState(false);

    const [scheduleData, setScheduleData] = useState({
        date: "",
        dateType: "specific",
        timeSlot: "",
        deliveryDate: "",
        deliveryTimeSlot: ""
    });

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

        setScheduleData({
            date: job.date || "",
            dateType: job.dateType || "specific",
            timeSlot: job.timeSlot || "",
            deliveryDate: job.deliveryDate || "",
            deliveryTimeSlot: job.deliveryTimeSlot || ""
        });

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

    const handleSaveSchedule = async () => {
        if (!selectedJob) return;

        if (
            scheduleData.dateType === "specific" &&
            !scheduleData.date
        ) {
            toast.error("Please select a pickup date");
            return;
        }

        setSavingSchedule(true);

        try {
            const response = await api.patch(
                `/jobs/${selectedJob._id}/schedule`,
                {
                    date: scheduleData.date,
                    dateType: scheduleData.dateType,
                    timeSlot: scheduleData.timeSlot,
                    deliveryDate: scheduleData.deliveryDate,
                    deliveryTimeSlot:
                        scheduleData.deliveryTimeSlot
                }
            );

            const updatedJob = response.data?.data;

            if (!updatedJob) {
                throw new Error("Updated job was not returned");
            }

            setSelectedJob(updatedJob);

            setJobs(previous => ({
                ...previous,
                [activeTab]: previous[activeTab].map(job =>
                    job._id === updatedJob._id
                        ? updatedJob
                        : job
                )
            }));

            toast.success("Job schedule updated");
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                err.message ||
                "Failed to update schedule"
            );
        } finally {
            setSavingSchedule(false);
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
                        const schedule = getJobCardSchedule(job);

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

                                <div className="grid gap-3 mb-4 pb-4 border-b border-gray-100 text-sm sm:grid-cols-2 xl:grid-cols-4">
                                    <div>
                                        <p className="text-xs text-gray-400 font-semibold mb-0.5">
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
                                        <p className="text-xs text-gray-400 font-semibold mb-0.5">
                                            Pickup / Drop-off dates
                                        </p>

                                        {schedule.type === "flexible" && (
                                            <p className="font-semibold text-gray-700">
                                                Flexible
                                            </p>
                                        )}

                                        {schedule.type === "same" && (
                                            <p className="font-semibold text-gray-700">
                                                {schedule.label}
                                            </p>
                                        )}

                                        {schedule.type === "different" && (
                                            <div className="space-y-0.5">
                                                <p className="text-xs text-gray-700">
                                                    <span className="font-bold">
                                                        Pickup:
                                                    </span>{" "}
                                                    {schedule.pickup}
                                                </p>

                                                <p className="text-xs text-gray-700">
                                                    <span className="font-bold">
                                                        Drop-off:
                                                    </span>{" "}
                                                    {schedule.delivery}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400 font-semibold mb-0.5">
                                            Time windows
                                        </p>

                                        <p className="text-xs text-gray-700">
                                            <span className="font-bold">
                                                Pickup:
                                            </span>{" "}
                                            {job.dateType === "flexible"
                                                ? "Flexible"
                                                : formatTimeSlot(job.timeSlot)}
                                        </p>

                                        <p className="text-xs text-gray-700">
                                            <span className="font-bold">
                                                Drop-off:
                                            </span>{" "}
                                            {formatTimeSlot(job.deliveryTimeSlot)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400 font-semibold mb-0.5">
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

                                <button
                                    onClick={() => openJob(job)}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-xs font-semibold"
                                >
                                    <FiEye size={14} /> View Details
                                </button>
                            </div>
                        );
                    })}
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
                                {/* Pickup */}
                                <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                                    <h4 className="mb-3 text-xs font-bold uppercase text-[#C0392B]">
                                        Pickup
                                    </h4>

                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-gray-400">
                                                Customer
                                            </p>

                                            <p className="text-sm font-bold text-[#1a1a1a]">
                                                {selectedJob.customer?.name || "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-gray-400">
                                                Address
                                            </p>

                                            <p className="text-sm font-bold text-[#1a1a1a]">
                                                {selectedJob.pickup?.address || "—"}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {selectedJob.pickup?.postcode || "—"}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-gray-400">
                                                    Date
                                                </p>

                                                <p className="text-xs font-semibold text-gray-700">
                                                    {selectedJob.dateType === "flexible"
                                                        ? "Flexible"
                                                        : formatJobDate(selectedJob.date)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-gray-400">
                                                    Time window
                                                </p>

                                                <p className="text-xs font-semibold text-gray-700">
                                                    {selectedJob.dateType === "flexible"
                                                        ? "Flexible"
                                                        : formatTimeSlot(selectedJob.timeSlot)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 border-t border-red-100 pt-2">
                                            <div>
                                                <p className="text-[10px] text-gray-400">
                                                    Floor
                                                </p>

                                                <p className="text-xs font-semibold capitalize text-gray-700">
                                                    {selectedJob.pickupFloor?.floorLevel || "Ground"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] text-gray-400">
                                                    Lift
                                                </p>

                                                <p className="text-xs font-semibold text-gray-700">
                                                    {selectedJob.pickupFloor?.hasLift ? "Yes" : "No"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] text-gray-400">
                                                    Parking
                                                </p>

                                                <p className="text-xs font-semibold text-gray-700">
                                                    {selectedJob.pickupFloor?.hasParking ? "Yes" : "No"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery */}
                                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                                    <h4 className="mb-3 text-xs font-bold uppercase text-green-700">
                                        Delivery
                                    </h4>

                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-gray-400">
                                                Customer
                                            </p>

                                            <p className="text-sm font-bold text-[#1a1a1a]">
                                                {selectedJob.customer?.name || "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-gray-400">
                                                Address
                                            </p>

                                            <p className="text-sm font-bold text-[#1a1a1a]">
                                                {selectedJob.delivery?.address || "—"}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {selectedJob.delivery?.postcode || "—"}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-gray-400">
                                                    Delivery date
                                                </p>

                                                <p className="text-xs font-semibold text-gray-700">
                                                    {formatJobDate(selectedJob.deliveryDate)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-gray-400">
                                                    Time window
                                                </p>

                                                <p className="text-xs font-semibold text-gray-700">
                                                    {formatTimeSlot(
                                                        selectedJob.deliveryTimeSlot
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 border-t border-green-100 pt-2">
                                            <div>
                                                <p className="text-[10px] text-gray-400">
                                                    Floor
                                                </p>

                                                <p className="text-xs font-semibold capitalize text-gray-700">
                                                    {selectedJob.deliveryFloor?.floorLevel || "Ground"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] text-gray-400">
                                                    Lift
                                                </p>

                                                <p className="text-xs font-semibold text-gray-700">
                                                    {selectedJob.deliveryFloor?.hasLift ? "Yes" : "No"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] text-gray-400">
                                                    Parking
                                                </p>

                                                <p className="text-xs font-semibold text-gray-700">
                                                    {selectedJob.deliveryFloor?.hasParking ? "Yes" : "No"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Distance */}
                                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4">
                                    <span className="text-sm text-gray-500">
                                        Total distance
                                    </span>

                                    <span className="text-base font-black text-[#C0392B]">
                                        {Number(selectedJob.distance || 0)} miles
                                    </span>
                                </div>

                                {/* Schedule editor */}
                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                    <div className="mb-4 flex items-center gap-2">
                                        <FiCalendar
                                            size={15}
                                            className="text-[#C0392B]"
                                        />

                                        <h4 className="text-xs font-bold uppercase text-gray-600">
                                            Manage schedule
                                        </h4>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-gray-600">
                                                Pickup date type
                                            </label>

                                            <select
                                                value={scheduleData.dateType}
                                                onChange={event =>
                                                    setScheduleData(current => ({
                                                        ...current,
                                                        dateType: event.target.value,
                                                        date:
                                                            event.target.value === "flexible"
                                                                ? ""
                                                                : current.date
                                                    }))
                                                }
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C0392B]"
                                            >
                                                <option value="specific">
                                                    Specific date
                                                </option>

                                                <option value="flexible">
                                                    Flexible
                                                </option>
                                            </select>
                                        </div>

                                        {scheduleData.dateType === "specific" && (
                                            <>
                                                <div>
                                                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                                                        Pickup date
                                                    </label>

                                                    <input
                                                        type="date"
                                                        value={scheduleData.date}
                                                        onChange={event =>
                                                            setScheduleData(current => ({
                                                                ...current,
                                                                date: event.target.value
                                                            }))
                                                        }
                                                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C0392B]"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                                                        Pickup time window
                                                    </label>

                                                    <select
                                                        value={scheduleData.timeSlot}
                                                        onChange={event =>
                                                            setScheduleData(current => ({
                                                                ...current,
                                                                timeSlot: event.target.value
                                                            }))
                                                        }
                                                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C0392B]"
                                                    >
                                                        <option value="">
                                                            To be arranged
                                                        </option>
                                                        <option value="early">
                                                            6:00 AM – 6:00 PM
                                                        </option>
                                                        <option value="morning">
                                                            8:00 AM – 6:00 PM
                                                        </option>
                                                        <option value="afternoon">
                                                            9:00 AM – 4:00 PM
                                                        </option>
                                                        <option value="flexible">
                                                            Flexible timing
                                                        </option>
                                                    </select>
                                                </div>
                                            </>
                                        )}

                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-gray-600">
                                                Delivery date
                                            </label>

                                            <input
                                                type="date"
                                                value={scheduleData.deliveryDate}
                                                onChange={event =>
                                                    setScheduleData(current => ({
                                                        ...current,
                                                        deliveryDate: event.target.value
                                                    }))
                                                }
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C0392B]"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-gray-600">
                                                Delivery time window
                                            </label>

                                            <select
                                                value={scheduleData.deliveryTimeSlot}
                                                onChange={event =>
                                                    setScheduleData(current => ({
                                                        ...current,
                                                        deliveryTimeSlot: event.target.value
                                                    }))
                                                }
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C0392B]"
                                            >
                                                <option value="">
                                                    To be arranged
                                                </option>
                                                <option value="early">
                                                    6:00 AM – 6:00 PM
                                                </option>
                                                <option value="morning">
                                                    8:00 AM – 6:00 PM
                                                </option>
                                                <option value="afternoon">
                                                    9:00 AM – 4:00 PM
                                                </option>
                                                <option value="flexible">
                                                    Flexible timing
                                                </option>
                                            </select>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={savingSchedule}
                                            onClick={handleSaveSchedule}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C0392B] py-2.5 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-50"
                                        >
                                            {savingSchedule ? (
                                                <>
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <FiSave size={15} />
                                                    Save Schedule
                                                </>
                                            )}
                                        </button>
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
                                        type="button"
                                        onClick={() => setCancelTarget(selectedJob)}
                                        disabled={updatingStatus}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-bold text-sm transition disabled:opacity-50"
                                    >
                                        <FiX size={16} />
                                        Cancel Job
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

            </AnimatePresence>
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