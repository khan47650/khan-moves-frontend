import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiX,
    FiEye,
    FiTrash2,
    FiPhone,
    FiMail,
    FiMapPin,
    FiClock,
    FiPackage,
    FiDollarSign,
    FiLayers,
    FiArrowRight
} from "react-icons/fi";
import api from "../../../api/api";
import DeleteJobDialog from "../../../components/admin/DeleteJobDialog";
import { toast } from "react-toastify";

function SectionLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-4 h-12 w-12">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#C0392B]" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[#C0392B]/20" />
                </div>
            </div>

            <p className="text-sm font-semibold text-gray-400">
                Loading jobs...
            </p>
        </div>
    );
}

const formatJobDate = value => {
    if (!value) return "To be arranged";

    const date = new Date(`${value}T12:00:00`);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};

const formatTimeSlot = value => {
    const timeSlots = {
        early: "6:00 AM – 6:00 PM",
        morning: "8:00 AM – 6:00 PM",
        afternoon: "9:00 AM – 4:00 PM",
        flexible: "Flexible timing"
    };

    return timeSlots[value] || value || "To be arranged";
};

const getJobSchedule = job => {
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

const STATUS_DETAILS = {
    completed: {
        label: "COMPLETED",
        badge: "bg-green-100 text-green-800"
    },
    cancelled: {
        label: "CANCELLED",
        badge: "bg-amber-100 text-amber-800"
    },
    trash: {
        label: "TRASH",
        badge: "bg-red-100 text-red-800"
    }
};

export default function JobsHistory() {
    const [historyType, setHistoryType] = useState("completed");

    const [completedJobs, setCompletedJobs] = useState([]);
    const [cancelledJobs, setCancelledJobs] = useState([]);
    const [trashJobs, setTrashJobs] = useState([]);

    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [deleteOne, setDeleteOne] = useState(null);
    const [deleteAll, setDeleteAll] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [movingToTrash, setMovingToTrash] = useState(false);

    const getRequestParams = () => {
        const params = {
            page,
            limit: 10
        };

        if (selectedDate) {
            params.from = selectedDate;
            params.to = selectedDate;
        }

        return params;
    };

    const loadCompletedJobs = async () => {
        try {
            setLoading(true);

            const { data } = await api.get("/jobs/history", {
                params: getRequestParams()
            });

            setCompletedJobs(data.data || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to load completed jobs"
            );
        } finally {
            setLoading(false);
        }
    };

    const loadCancelledJobs = async () => {
        try {
            setLoading(true);

            const { data } = await api.get("/jobs/cancelled", {
                params: getRequestParams()
            });

            setCancelledJobs(data.data || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to load cancelled jobs"
            );
        } finally {
            setLoading(false);
        }
    };

    const loadTrashJobs = async () => {
        try {
            setLoading(true);

            const { data } = await api.get("/jobs/trash", {
                params: getRequestParams()
            });

            setTrashJobs(data.data || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to load Trash jobs"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setSelectedJob(null);

        if (historyType === "completed") {
            loadCompletedJobs();
        } else if (historyType === "cancelled") {
            loadCancelledJobs();
        } else {
            loadTrashJobs();
        }
    }, [historyType, page, selectedDate]);

    const moveCancelledToTrash = async job => {
        setMovingToTrash(true);

        try {
            await api.patch(`/jobs/${job._id}/trash`);

            setCancelledJobs(current =>
                current.filter(item => item._id !== job._id)
            );

            setSelectedJob(null);

            if (page > 1 && cancelledJobs.length === 1) {
                setPage(current => current - 1);
            }

            toast.success("Job moved to Trash");
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to move job to Trash"
            );
        } finally {
            setMovingToTrash(false);
        }
    };

    const handleDeleteOne = async () => {
        if (!deleteOne) return;

        setDeleteLoading(true);

        try {
            await api.delete(`/jobs/trash/${deleteOne._id}`);

            toast.success("Job permanently deleted");

            setDeleteOne(null);
            setSelectedJob(null);

            if (page > 1 && trashJobs.length === 1) {
                setPage(current => current - 1);
            } else {
                loadTrashJobs();
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to delete job"
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleClearTrash = async () => {
        setDeleteLoading(true);

        try {
            await api.delete("/jobs/trash");

            setTrashJobs([]);
            setDeleteAll(false);
            setSelectedJob(null);
            setPage(1);
            setTotalPages(1);

            toast.success("Trash cleared");
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to clear Trash"
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const currentJobs =
        historyType === "completed"
            ? completedJobs
            : historyType === "cancelled"
                ? cancelledJobs
                : trashJobs;

    const statusDetails =
        STATUS_DETAILS[historyType] ||
        STATUS_DETAILS.completed;

    const getEmptyContent = () => {
        if (historyType === "completed") {
            return {
                title: "No Completed Jobs",
                message: selectedDate
                    ? "No completed jobs found on the selected date."
                    : "Completed jobs will appear here."
            };
        }

        if (historyType === "cancelled") {
            return {
                title: "No Cancelled Jobs",
                message: selectedDate
                    ? "No cancelled jobs found on the selected date."
                    : "Cancelled jobs will appear here."
            };
        }

        return {
            title: "Trash Empty",
            message: "No jobs are currently in Trash."
        };
    };

    const JobCard = ({ job, type }) => {
        const schedule = getJobSchedule(job);
        const details = STATUS_DETAILS[type];

        return (
            <div className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a]">
                            {job.customer?.name || "—"}
                        </h3>

                        <p className="text-sm text-gray-500">
                            Ref:{" "}
                            <span className="font-semibold text-[#C0392B]">
                                {job.bookingRef}
                            </span>
                        </p>
                    </div>

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${details.badge}`}
                    >
                        {details.label}
                    </span>
                </div>

                <div className="mb-4 grid gap-4 border-b border-gray-200 pb-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                            Route
                        </p>

                        <p className="text-sm font-semibold text-gray-700">
                            {job.pickup?.postcode || "—"}
                            {" → "}
                            {job.delivery?.postcode || "—"}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#C0392B]">
                            {Number(job.distance || 0)} miles
                        </p>
                    </div>

                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                            Pickup / Drop-off dates
                        </p>

                        {schedule.type === "flexible" && (
                            <p className="text-sm font-semibold text-gray-700">
                                Flexible
                            </p>
                        )}

                        {schedule.type === "same" && (
                            <p className="text-sm font-semibold text-gray-700">
                                {schedule.label}
                            </p>
                        )}

                        {schedule.type === "different" && (
                            <div className="space-y-1">
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
                        <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
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

                        <p className="mt-1 text-xs text-gray-700">
                            <span className="font-bold">
                                Drop-off:
                            </span>{" "}
                            {formatTimeSlot(job.deliveryTimeSlot)}
                        </p>
                    </div>

                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                            Price
                        </p>

                        <p className="text-lg font-black text-[#1a1a1a]">
                            £{Number(job.totalPrice || 0).toFixed(2)}
                        </p>

                        <p className="text-xs text-gray-500">
                            {job.assignedDriverName || "Driver not assigned"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setSelectedJob(job)}
                        className="flex items-center gap-2 rounded-lg bg-[#C0392B]/10 px-4 py-2 text-sm font-semibold text-[#C0392B] transition hover:bg-[#C0392B]/20"
                    >
                        <FiEye size={16} />
                        View Details
                    </button>

                    {type === "cancelled" && (
                        <button
                            type="button"
                            disabled={movingToTrash}
                            onClick={() => moveCancelledToTrash(job)}
                            className="flex items-center gap-2 rounded-lg bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-200 disabled:opacity-50"
                        >
                            <FiTrash2 size={16} />
                            Move to Trash
                        </button>
                    )}

                    {type === "trash" && (
                        <button
                            type="button"
                            onClick={() => setDeleteOne(job)}
                            className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                        >
                            <FiTrash2 size={16} />
                            Delete Permanently
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const emptyContent = getEmptyContent();

    return (
        <div className="relative">
            <h1 className="mb-2 text-3xl font-bold text-[#1a1a1a]">
                Jobs History
            </h1>

            <p className="mb-6 text-gray-500">
                View completed, cancelled and deleted jobs.
            </p>

            {/* Tabs */}
            <div className="mb-6 flex gap-1 overflow-x-auto border-b border-gray-200">
                {[
                    {
                        id: "completed",
                        label: "Completed"
                    },
                    {
                        id: "cancelled",
                        label: "Cancel"
                    },
                    {
                        id: "trash",
                        label: "Trash"
                    }
                ].map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                            setHistoryType(tab.id);
                            setPage(1);
                            setSelectedDate("");
                            setSelectedJob(null);
                        }}
                        className={`shrink-0 border-b-2 px-5 py-3 text-sm font-bold transition ${historyType === tab.id
                                ? "border-[#C0392B] text-[#C0392B]"
                                : "border-transparent text-gray-500 hover:text-gray-800"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Filters and Clear Trash */}
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-wrap items-end gap-3">
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                            Filter by job date
                        </label>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={event => {
                                setSelectedDate(event.target.value);
                                setPage(1);
                            }}
                            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20"
                        />
                    </div>

                    {selectedDate && (
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedDate("");
                                setPage(1);
                            }}
                            className="rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>

                {historyType === "trash" && trashJobs.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setDeleteAll(true)}
                        className="flex items-center gap-2 rounded-xl bg-[#C0392B] px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"
                    >
                        <FiTrash2 size={17} />
                        Clear Trash ({trashJobs.length})
                    </button>
                )}
            </div>

            {/* Jobs */}
            {loading ? (
                <SectionLoader />
            ) : currentJobs.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                    <FiPackage
                        size={34}
                        className="mx-auto mb-3 text-gray-300"
                    />

                    <h3 className="font-bold text-gray-700">
                        {emptyContent.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        {emptyContent.message}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {currentJobs.map(job => (
                        <JobCard
                            key={job._id}
                            job={job}
                            type={historyType}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            setPage(current => current - 1)
                        }
                        disabled={page === 1}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 disabled:opacity-40"
                    >
                        Previous
                    </button>

                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map(pageNumber => (
                        <button
                            key={pageNumber}
                            type="button"
                            onClick={() => setPage(pageNumber)}
                            className={`h-10 w-10 rounded-lg font-semibold transition ${page === pageNumber
                                    ? "bg-[#C0392B] text-white"
                                    : "border border-gray-300 bg-white hover:border-[#C0392B]"
                                }`}
                        >
                            {pageNumber}
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() =>
                            setPage(current => current + 1)
                        }
                        disabled={page === totalPages}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Side Panel */}
            <AnimatePresence>
                {selectedJob && (
                    <>
                        <motion.button
                            type="button"
                            aria-label="Close details"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedJob(null)}
                            className="fixed inset-0 z-40 bg-black/50"
                        />

                        <motion.div
                            initial={{
                                x: "100%",
                                opacity: 0
                            }}
                            animate={{
                                x: 0,
                                opacity: 1
                            }}
                            exit={{
                                x: "100%",
                                opacity: 0
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                            className="fixed right-0 top-16 z-50 h-[calc(100vh-64px)] w-full max-w-md overflow-y-auto bg-white shadow-2xl"
                        >
                            <div className="sticky top-0 z-10 flex items-center justify-between bg-linear-to-r from-[#C0392B] to-red-700 p-5 text-white">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        {selectedJob.customer?.name || "—"}
                                    </h2>

                                    <p className="mt-0.5 text-sm text-red-100">
                                        Ref: {selectedJob.bookingRef}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSelectedJob(null)}
                                    className="rounded-lg p-2 transition hover:bg-red-600"
                                >
                                    <FiX size={22} />
                                </button>
                            </div>

                            <div className="space-y-4 p-5">
                                <span
                                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${statusDetails.badge}`}
                                >
                                    {statusDetails.label}
                                </span>

                                {/* Contact */}
                                <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                                    <h4 className="text-xs font-bold uppercase text-gray-500">
                                        Contact Information
                                    </h4>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C0392B]/10">
                                            <FiPhone
                                                className="text-[#C0392B]"
                                                size={14}
                                            />
                                        </div>

                                        <p className="text-sm text-gray-700">
                                            {selectedJob.customer?.phone || "—"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C0392B]/10">
                                            <FiMail
                                                className="text-[#C0392B]"
                                                size={14}
                                            />
                                        </div>

                                        <p className="truncate text-sm text-gray-700">
                                            {selectedJob.customer?.email || "—"}
                                        </p>
                                    </div>
                                </div>

                                {/* Pickup */}
                                <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <FiMapPin
                                            className="text-[#C0392B]"
                                            size={17}
                                        />

                                        <h4 className="text-sm font-bold uppercase text-[#C0392B]">
                                            Pickup
                                        </h4>
                                    </div>

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

                                            <p className="text-sm font-semibold text-gray-800">
                                                {selectedJob.pickup?.address || "—"}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {selectedJob.pickup?.postcode || "—"}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-gray-400">
                                                    Pickup date
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
                                                    {selectedJob.pickupFloor?.hasLift
                                                        ? "Yes"
                                                        : "No"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] text-gray-400">
                                                    Parking
                                                </p>

                                                <p className="text-xs font-semibold text-gray-700">
                                                    {selectedJob.pickupFloor?.hasParking
                                                        ? "Yes"
                                                        : "No"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <FiArrowRight
                                        size={18}
                                        className="rotate-90 text-[#C0392B]"
                                    />
                                </div>

                                {/* Delivery */}
                                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <FiMapPin
                                            className="text-green-700"
                                            size={17}
                                        />

                                        <h4 className="text-sm font-bold uppercase text-green-700">
                                            Delivery
                                        </h4>
                                    </div>

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

                                            <p className="text-sm font-semibold text-gray-800">
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
                                                    {formatJobDate(
                                                        selectedJob.deliveryDate
                                                    )}
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
                                                    {selectedJob.deliveryFloor?.hasLift
                                                        ? "Yes"
                                                        : "No"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] text-gray-400">
                                                    Parking
                                                </p>

                                                <p className="text-xs font-semibold text-gray-700">
                                                    {selectedJob.deliveryFloor?.hasParking
                                                        ? "Yes"
                                                        : "No"}
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

                                {/* Items */}
                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <FiPackage
                                            className="text-[#C0392B]"
                                            size={17}
                                        />

                                        <h4 className="text-sm font-bold uppercase text-gray-600">
                                            Items ({selectedJob.items?.length || 0})
                                        </h4>
                                    </div>

                                    {(selectedJob.items || []).length === 0 ? (
                                        <p className="text-sm text-gray-400">
                                            No items recorded.
                                        </p>
                                    ) : (
                                        <div className="max-h-48 space-y-2 overflow-y-auto">
                                            {(selectedJob.items || []).map(
                                                (item, index) => (
                                                    <div
                                                        key={
                                                            item.itemId ||
                                                            `${item.name}-${index}`
                                                        }
                                                        className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-semibold text-gray-700">
                                                                {item.name}
                                                            </p>

                                                            <p className="text-[10px] text-gray-400">
                                                                {Number(
                                                                    item.volume || 0
                                                                ).toFixed(2)}{" "}
                                                                m³ each
                                                            </p>
                                                        </div>

                                                        <span className="ml-2 shrink-0 rounded-full bg-[#C0392B]/10 px-2 py-1 text-xs font-bold text-[#C0392B]">
                                                            ×{item.quantity || 1}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
                                        <span className="text-sm font-semibold text-gray-600">
                                            Total Volume
                                        </span>

                                        <span className="font-bold text-[#C0392B]">
                                            {Number(
                                                selectedJob.totalVolume || 0
                                            ).toFixed(2)}{" "}
                                            m³
                                        </span>
                                    </div>
                                </div>

                                {/* Cancellation reason */}
                                {selectedJob.cancelReason && (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                                        <p className="mb-2 text-xs font-bold uppercase text-amber-700">
                                            Cancellation Reason
                                        </p>

                                        <p className="text-sm text-amber-800">
                                            {selectedJob.cancelReason}
                                        </p>
                                    </div>
                                )}

                                {/* Price */}
                                <div className="rounded-xl bg-[#1a1a1a] p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <FiDollarSign
                                            className="text-[#F1C40F]"
                                            size={17}
                                        />

                                        <p className="text-xs font-bold uppercase text-gray-400">
                                            Total Price
                                        </p>
                                    </div>

                                    <p className="text-3xl font-black text-[#F1C40F]">
                                        £{Number(
                                            selectedJob.totalPrice || 0
                                        ).toFixed(2)}
                                    </p>
                                </div>

                                {/* Driver & Vehicle */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                        <p className="mb-1 text-xs font-semibold uppercase text-gray-500">
                                            Driver
                                        </p>

                                        <p className="text-sm font-bold text-[#1a1a1a]">
                                            {selectedJob.assignedDriverName ||
                                                "Not Assigned"}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                        <p className="mb-1 text-xs font-semibold uppercase text-gray-500">
                                            Vehicle
                                        </p>

                                        <p className="text-sm font-bold text-[#1a1a1a]">
                                            {selectedJob.assignedVehicleReg ||
                                                "Not Assigned"}
                                        </p>
                                    </div>
                                </div>

                                {selectedJob.specialInstructions && (
                                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                                        <p className="mb-2 text-xs font-bold uppercase text-yellow-700">
                                            Special Instructions
                                        </p>

                                        <p className="text-sm text-yellow-800">
                                            {selectedJob.specialInstructions}
                                        </p>
                                    </div>
                                )}

                                {historyType === "cancelled" && (
                                    <button
                                        type="button"
                                        disabled={movingToTrash}
                                        onClick={() =>
                                            moveCancelledToTrash(selectedJob)
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-100 px-4 py-3 text-sm font-bold text-amber-800 transition hover:bg-amber-200 disabled:opacity-50"
                                    >
                                        <FiTrash2 size={17} />

                                        {movingToTrash
                                            ? "Moving..."
                                            : "Move to Trash"}
                                    </button>
                                )}

                                {historyType === "trash" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDeleteOne(selectedJob)
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-200"
                                    >
                                        <FiTrash2 size={17} />
                                        Delete Permanently
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setSelectedJob(null)}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                                >
                                    <FiX size={17} />
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <DeleteJobDialog
                open={Boolean(deleteOne)}
                title="Delete Job Permanently?"
                message={`Delete "${deleteOne?.bookingRef}" permanently? This action cannot be undone.`}
                loading={deleteLoading}
                onCancel={() => {
                    if (!deleteLoading) {
                        setDeleteOne(null);
                    }
                }}
                onConfirm={handleDeleteOne}
            />

            <DeleteJobDialog
                open={deleteAll}
                title="Clear Trash?"
                message="Permanently delete every job currently in Trash? This action cannot be undone."
                loading={deleteLoading}
                onCancel={() => {
                    if (!deleteLoading) {
                        setDeleteAll(false);
                    }
                }}
                onConfirm={handleClearTrash}
            />
        </div>
    );
}