import React from "react";
import { FiCheck, FiEye, FiSend, FiX } from "react-icons/fi";

export default function RequestCard({
    request,
    accepting,
    onView,
    onInvoice,
    onAccept,
    onReject
}) {
    const inProgress = request.status === "in_progress";

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-bold text-[#1a1a1a]">
                        {request.customer?.name || "—"}
                    </h3>
                    <p className="text-sm text-gray-500">
                        Ref: <span className="font-semibold text-[#C0392B]">{request.bookingRef}</span>
                        {request.createdAt && (
                            <span className="ml-2">
                                · {new Date(request.createdAt).toLocaleDateString("en-GB")}
                            </span>
                        )}
                    </p>
                </div>

                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${inProgress
                        ? "bg-purple-100 text-purple-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {inProgress ? "IN PROGRESS" : "PENDING"}
                </span>
            </div>

            <div className="mb-4 grid gap-3 border-b border-gray-100 pb-4 text-sm sm:grid-cols-3">
                <div>
                    <p className="text-xs font-semibold text-gray-400">Customer</p>
                    <p className="text-gray-700">{request.customer?.phone || "—"}</p>
                    <p className="truncate text-xs text-gray-500">{request.customer?.email || "—"}</p>
                </div>

                <div>
                    <p className="text-xs font-semibold text-gray-400">Route</p>
                    <p className="text-gray-700">
                        {request.pickup?.postcode || "—"} → {request.delivery?.postcode || "—"}
                    </p>
                    <p className="text-xs text-gray-500">
                        {request.serviceType || "—"} · {request.distance || 0} mi
                    </p>
                </div>

                <div>
                    <p className="text-xs font-semibold text-gray-400">Date & Price</p>
                    <p className="text-gray-700">
                        {request.dateType === "flexible" ? "Flexible" : request.date || "—"}
                    </p>
                    <p className="font-bold text-[#C0392B]">£{request.totalPrice || 0}</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <button onClick={onView} className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100">
                    <FiEye size={14} /> View Details
                </button>

                <button onClick={onInvoice} className="flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100">
                    <FiSend size={14} />
                    {inProgress ? "Send Invoice Again" : "Send Invoice"}
                </button>

                <button
                    onClick={onAccept}
                    disabled={accepting}
                    className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-60"
                >
                    {accepting ? (
                        <>
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-green-700/30 border-t-green-700" />
                            Accepting...
                        </>
                    ) : (
                        <><FiCheck size={14} /> Accept</>
                    )}
                </button>

                <button onClick={onReject} className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">
                    <FiX size={14} /> Reject
                </button>
            </div>
        </div>
    );
}