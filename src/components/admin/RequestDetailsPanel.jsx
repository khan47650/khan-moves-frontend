import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    FiCheck, FiClock, FiEdit2, FiMail,
    FiMessageSquare, FiPackage, FiPhone, FiX
} from "react-icons/fi";
import RequestEditForm from "./RequestEditForm";

export default function RequestDetailsPanel({
    request,
    accepting,
    onClose,
    onUpdated,
    onAccept,
    onReject
}) {
    const [editing, setEditing] = useState(false);

    const close = () => {
        setEditing(false);
        onClose();
    };

    const updated = booking => {
        setEditing(false);
        onUpdated(booking);
    };

    return (
        <AnimatePresence>
            {request && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={close}
                        className="fixed inset-0 z-40 bg-black/50"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-16 z-50 h-[calc(100vh-64px)] w-full overflow-y-auto bg-white shadow-2xl sm:w-110"
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between bg-linear-to-r from-[#C0392B] to-red-700 p-5 text-white">
                            <div>
                                <h2 className="text-xl font-bold">{request.customer?.name || "—"}</h2>
                                <p className="text-sm text-red-100">Ref: {request.bookingRef}</p>
                            </div>
                            <button onClick={close} className="rounded-lg p-2 hover:bg-red-600">
                                <FiX size={22} />
                            </button>
                        </div>

                        <div className="space-y-4 p-5">
                            <div className="flex items-center justify-between">
                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${request.status === "in_progress"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}>
                                    {request.status === "in_progress" ? "IN PROGRESS" : "PENDING"}
                                </span>

                                {!editing && (
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                                    >
                                        <FiEdit2 size={14} /> Edit
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                                <h4 className="text-xs font-bold uppercase text-gray-500">Contact</h4>

                                {[
                                    [FiPhone, request.customer?.phone],
                                    [FiMail, request.customer?.email],
                                    [FiMessageSquare, request.customer?.whatsapp]
                                ].map(([Icon, value], index) => value && (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C0392B]/10">
                                            <Icon size={15} className="text-[#C0392B]" />
                                        </div>
                                        <p className="truncate text-sm text-gray-700">{value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-xl bg-gray-50 p-4">
                                <h4 className="mb-2 text-xs font-bold uppercase text-gray-500">Service</h4>
                                <p className="text-sm font-semibold">{request.serviceType || "—"}</p>
                            </div>

                            {editing ? (
                                <RequestEditForm
                                    booking={request}
                                    onUpdated={updated}
                                    onCancel={() => setEditing(false)}
                                />
                            ) : (
                                <>
                                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                        <h4 className="mb-3 text-xs font-bold uppercase text-blue-500">Route</h4>
                                        <p className="text-xs text-gray-500">Pickup</p>
                                        <p className="text-sm font-bold">{request.pickup?.address || "—"}</p>
                                        <p className="text-xs text-gray-500">{request.pickup?.postcode}</p>

                                        <div className="my-2 text-[#C0392B]">↓</div>

                                        <p className="text-xs text-gray-500">Delivery</p>
                                        <p className="text-sm font-bold">{request.delivery?.address || "—"}</p>
                                        <p className="text-xs text-gray-500">{request.delivery?.postcode}</p>

                                        <p className="mt-2 text-xs text-gray-400">
                                            {request.distance || 0} miles
                                        </p>
                                    </div>

                                    <div className="rounded-xl border p-4">
                                        <h4 className="mb-2 text-xs font-bold uppercase text-gray-500">Date & Time</h4>
                                        <div className="flex items-center gap-2">
                                            <FiClock size={14} className="text-gray-400" />
                                            <p className="text-sm text-gray-700">
                                                {request.dateType === "flexible" ? "Flexible dates" : request.date || "—"}
                                                {request.timeSlot && ` · ${request.timeSlot}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <FiPackage size={15} className="text-[#C0392B]" />
                                            <h4 className="text-xs font-bold uppercase text-gray-500">
                                                Items ({request.items?.length || 0})
                                            </h4>
                                        </div>

                                        <div className="max-h-40 space-y-1.5 overflow-y-auto">
                                            {(request.items || []).map((item, index) => (
                                                <div key={index} className="flex justify-between rounded-lg bg-gray-50 px-3 py-1.5 text-sm">
                                                    <span className="truncate">{item.name}</span>
                                                    <span className="font-bold text-gray-500">x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-3 flex justify-between border-t pt-3">
                                            <span className="text-xs text-gray-500">Total Volume</span>
                                            <span className="text-sm font-bold">
                                                {Number(request.totalVolume || 0).toFixed(2)} m³
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between rounded-xl bg-[#1a1a1a] p-4">
                                        <span className="text-sm text-gray-400">Total Price</span>
                                        <span className="text-2xl font-black text-[#F1C40F]">
                                            £{request.totalPrice || 0}
                                        </span>
                                    </div>

                                    {request.specialInstructions && (
                                        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                                            <p className="mb-2 text-xs font-bold uppercase text-amber-700">
                                                Special Instructions
                                            </p>
                                            <p className="text-sm text-amber-800">
                                                {request.specialInstructions}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onAccept(request)}
                                            disabled={accepting}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                                        >
                                            {accepting ? "Accepting..." : <><FiCheck size={16} /> Accept</>}
                                        </button>

                                        <button
                                            onClick={() => onReject(request)}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-700"
                                        >
                                            <FiX size={16} /> Reject
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}