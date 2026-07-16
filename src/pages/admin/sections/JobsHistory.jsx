import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiX, FiChevronDown, FiEye, FiTrash2,
    FiPhone, FiMail, FiMapPin, FiClock, FiPackage, FiDollarSign
} from 'react-icons/fi';
import api from "../../../api/api";
import DeleteJobDialog from "../../../components/admin/DeleteJobDialog";
import { toast } from "react-toastify";

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

            <p className="text-sm font-semibold text-gray-400">
                Loading Jobs...
            </p>
        </div>
    );
}

export default function JobsHistory() {
    const [historyType, setHistoryType] = useState('completed');
    const [completedJobs, setCompletedJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [trashJobs, setTrashJobs] = useState([]);
    const [deleteOne, setDeleteOne] = useState(null);
    const [deleteAll, setDeleteAll] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const loadCompletedJobs = async () => {
        try {
            setLoading(true);

            const params = {
                page,
                limit: 10,
            };

            if (selectedDate) {
                params.from = selectedDate;
                params.to = selectedDate;
            }

            const { data } = await api.get("/jobs/history", {
                params,
            });

            setCompletedJobs(data.data);
            setTotalPages(data.totalPages);

        } catch (err) {
            toast.error("Failed to load completed jobs");
        } finally {
            setLoading(false);
        }
    };

    const loadTrashJobs = async () => {
        try {
            setLoading(true);

            const params = {
                page,
                limit: 10,
            };

            if (selectedDate) {
                params.from = selectedDate;
                params.to = selectedDate;
            }

            const { data } = await api.get("/jobs/trash", {
                params,
            });

            setTrashJobs(data.data);
            setTotalPages(data.totalPages);

        } catch (err) {
            toast.error("Failed to load trash jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (historyType === "completed") {

            loadCompletedJobs();

        }

        else {

            loadTrashJobs();

        }

    }, [historyType, page, selectedDate]);

    const deleteTrash = async (id) => {

        if (!window.confirm("Delete this job permanently?")) return;

        try {

            await api.delete(`/jobs/trash/${id}`);

            toast.success("Job deleted");

            loadTrashJobs();

        }

        catch (err) {

            toast.error("Delete failed");

        }

    };

    const deleteAllTrash = async () => {

        if (!window.confirm("Delete all trash jobs?")) return;

        try {

            await api.delete("/jobs/trash");

            toast.success("Trash cleared");

            loadTrashJobs();

        }

        catch (err) {

            toast.error("Failed");

        }

    };

    const JobCard = ({ job, type }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-[#1a1a1a]">
                        {job.customer?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                        Ref: <span className="font-semibold text-[#C0392B]">
                            {job.bookingRef}
                        </span>
                    </p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${type === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {type === 'completed' ? 'COMPLETED' : 'DELETED'}
                </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Pickup</p>
                    <p className="text-sm text-gray-700">{job.pickup?.address}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Delivery</p>
                    <p className="text-sm text-gray-700">{job.delivery?.address}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Driver</p>
                    <p className="text-sm font-semibold text-gray-700">{job.assignedDriverName || "Not Assigned"}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Price</p>
                    <p className="text-lg font-bold">
                        £{job.totalPrice}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => setSelectedJob(job)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-semibold"
                >
                    <FiEye size={16} /> View
                </button>

                {type === 'deleted' && (
                    <button
                        onClick={() => setDeleteOne(job)
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
                    >
                        <FiTrash2 size={16} /> Clear
                    </button>
                )}
            </div>
        </div>
    );



    return (
        <div className="relative">
            {/* Header */}
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Jobs History</h1>
            <p className="text-gray-500 mb-8">View completed and deleted jobs.</p>

            {/* Filter Dropdown */}
            <div className="mb-8 flex gap-6 items-end flex-wrap lg:flex-nowrap">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Type</label>
                    <div className="relative w-full md:w-64">
                        <select
                            value={historyType}
                            onChange={(e) => {
                                setHistoryType(e.target.value);
                                setPage(1);

                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20 transition text-gray-700 font-medium"
                        >
                            <option value="completed">Completed Jobs</option>
                            <option value="trash">Trash ({trashJobs.length})</option>
                        </select>
                        <FiChevronDown className="absolute right-4 top-3.5 pointer-events-none text-gray-500" size={20} />
                    </div>
                </div>

                {historyType === 'completed' && (
                    <div className="flex gap-4 items-end">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {

                                    setSelectedDate(e.target.value);

                                    setPage(1);

                                }}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20 transition"
                            />
                        </div>
                        {selectedDate && (
                            <button
                                onClick={() => {

                                    setSelectedDate("");

                                    setPage(1);

                                }}
                                className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="w-full">
                <div className="space-y-4">
                    {loading && <SectionLoader />}
                    {historyType === 'completed' && (
                        completedJobs.length === 0 ? (
                            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                                <div className="py-10 text-center">
                                    <FiPackage size={34} className="mx-auto text-gray-300 mb-3" />

                                    <h3 className="font-bold text-gray-700">
                                        No Completed Jobs
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {selectedDate
                                            ? "No completed jobs found on the selected date."
                                            : "Completed jobs will appear here."}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            !loading && completedJobs.map(job => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    type="completed"
                                />
                            ))
                        )
                    )}

                    {historyType === 'trash' && (
                        <>
                            {trashJobs.length > 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setDeleteAll(true)}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 
                                    transition text-sm font-bold uppercase tracking-wide mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiTrash2 size={18} /> disabled={trashJobs.length === 0}({trashJobs.length})
                                </motion.button>
                            )}

                            {trashJobs.length === 0 ? (
                                <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                                    <div className="py-10 text-center">
                                        <FiTrash2
                                            size={34}
                                            className="mx-auto text-red-200 mb-3"
                                        />

                                        <h3 className="font-bold text-gray-700">
                                            Trash Empty
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            No cancelled jobs available.
                                        </p>
                                    </div>
                                </div>
                            ) : trashJobs.map(job => <JobCard key={job.id} job={job} type="deleted" />)}
                        </>
                    )}
                </div>
                {totalPages > 1 && (

                    <div className="flex justify-center items-center gap-2 mt-8">

                        <button

                            onClick={() => setPage(page - 1)}

                            disabled={page === 1}

                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-40"

                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (

                            <button

                                key={i}

                                onClick={() => setPage(i + 1)}

                                className={`w-10 h-10 rounded-lg font-semibold transition

            ${page === i + 1

                                        ? "bg-[#C0392B] text-white"

                                        : "bg-white border border-gray-300 hover:border-[#C0392B]"

                                    }`}

                            >

                                {i + 1}

                            </button>

                        ))}

                        <button

                            onClick={() => setPage(page + 1)}

                            disabled={page === totalPages}

                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-40"

                        >

                            Next

                        </button>

                    </div>

                )}
            </div>

            {/* Side Panel with Framer Motion */}
            <AnimatePresence>
                {selectedJob && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedJob(null)}
                            className="fixed inset-0 bg-black/50 z-40"
                        />

                        {/* Side Panel */}
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-16 right-0 h-[calc(100vh-64px)] w-96 bg-white z-50 overflow-y-auto shadow-2xl"
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-linear-to-r from-[#C0392B] to-red-700 text-white p-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedJob.customer?.name}</h2>
                                    <p className="text-red-100 text-sm mt-1">Ref: {selectedJob.bookingRef}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="p-2 hover:bg-red-600 rounded-lg transition"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Status Badge */}
                                <span className={`inline-block px-4 py-2 text-xs font-bold rounded-full ${historyType === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {historyType === 'completed' ? 'COMPLETED' : 'CANCELLED'}
                                </span>

                                {/* Contact Section */}
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Contact Information</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#C0392B]/10 rounded-lg">
                                            <FiMail className="text-[#C0392B]" size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Email</p>
                                            <p className="text-sm text-gray-700 font-medium">{selectedJob.customer?.email || "—"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#C0392B]/10 rounded-lg">
                                            <FiPhone className="text-[#C0392B]" size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Phone</p>
                                            <p className="text-sm text-gray-700 font-medium">{selectedJob.customer?.phone || "—"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pickup Section */}
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiMapPin className="text-blue-600" size={18} />
                                        <h4 className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Pickup</h4>
                                    </div>
                                    <p className="text-sm text-blue-900 font-medium mb-2">{selectedJob.pickup?.address}</p>
                                    <p className="text-xs text-blue-700 mb-2">{selectedJob.pickupFloor?.floorLevel}</p>
                                    <div className="flex items-center gap-2 text-xs text-blue-700">
                                        <FiClock size={14} />
                                        <span>{selectedJob.date}

                                            {selectedJob.timeSlot &&
                                                <> · {selectedJob.timeSlot}</>}</span>
                                    </div>
                                </div>

                                {/* Delivery Section */}
                                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiMapPin className="text-orange-600" size={18} />
                                        <h4 className="text-sm font-semibold text-orange-900 uppercase tracking-wide">Delivery</h4>
                                    </div>
                                    <p className="text-sm text-orange-900 font-medium mb-2">{selectedJob.delivery?.address}</p>
                                    <p className="text-xs text-orange-700">{selectedJob.deliveryFloor?.floorLevel}</p>
                                </div>

                                {/* Items Section */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiPackage className="text-[#C0392B]" size={18} />
                                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Items ({selectedJob.items.length})</h4>
                                    </div>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {selectedJob.items.map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
                                            >
                                                <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                                                <span className="text-xs bg-[#C0392B]/10 text-[#C0392B] px-2 py-1 rounded font-semibold">{item.volume?.toFixed(2)} m³</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-sm font-semibold text-gray-700">Total Volume:</span>
                                        <span className="text-lg font-bold text-[#C0392B]">{selectedJob.totalVolume?.toFixed(2)}m³</span>
                                    </div>
                                </div>

                                {/* Price Section */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiDollarSign className="text-green-600" size={18} />
                                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Price</h4>
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-4xl font-bold text-green-600">£{selectedJob.totalPrice}</span>
                                    </div>
                                </div>

                                {/* Driver & Vehicle Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Driver</p>
                                        <p className="text-lg font-bold text-[#C0392B]">{selectedJob.assignedDriverName || "Not Assigned"}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Vehicle</p>
                                        <p className="text-lg font-bold text-[#C0392B]">{selectedJob.assignedVehicleReg || "Not Assigned"}</p>
                                    </div>
                                </div>

                                {/* Special Instructions */}
                                {selectedJob.specialInstructions && (
                                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                        <p className="text-xs text-yellow-700 uppercase font-semibold mb-2">⚠️ Special Instructions</p>
                                        <p className="text-sm text-yellow-800">{selectedJob.specialInstructions}</p>
                                    </div>
                                )}

                                {/* Close Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedJob(null)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-bold uppercase tracking-wide"
                                >
                                    <FiX size={18} /> Close
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <DeleteJobDialog

                open={!!deleteOne}

                title="Delete Job?"

                message={`Delete "${deleteOne?.bookingRef}" permanently?`}

                loading={deleteLoading}

                onCancel={() => setDeleteOne(null)}

                onConfirm={async () => {

                    setDeleteLoading(true);

                    try {

                        await api.delete(`/jobs/trash/${deleteOne._id}`);

                        toast.success("Job deleted");

                        setDeleteOne(null);

                        if (page > 1 && trashJobs.length === 1) {

                            setPage(page - 1);

                        } else {

                            loadTrashJobs();

                        }
                    }

                    catch {

                        toast.error("Delete failed");

                    }

                    finally {

                        setDeleteLoading(false);

                    }

                }}

            />

            <DeleteJobDialog

                open={deleteAll}

                title="Clear Trash?"

                message="Delete all cancelled jobs permanently?"

                loading={deleteLoading}

                onCancel={() => setDeleteAll(false)}

                onConfirm={async () => {

                    setDeleteLoading(true);

                    try {

                        await api.delete("/jobs/trash");

                        toast.success("Trash cleared");

                        setDeleteAll(false);
                        if (page > 1 && trashJobs.length === 1) {

                            setPage(page - 1);

                        } else {

                            loadTrashJobs();

                        }

                    }

                    catch {

                        toast.error("Failed");

                    }

                    finally {

                        setDeleteLoading(false);

                    }

                }}

            />
        </div>
    );
}
