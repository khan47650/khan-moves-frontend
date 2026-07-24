import React, { useEffect, useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function CancelJobDialog({
    open,
    job,
    loading,
    onClose,
    onConfirm
}) {
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (open) setReason("");
    }, [open]);

    if (!open) return null;

    const isValid = reason.trim().length >= 5;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/50"
            />

            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <FiAlertTriangle
                                size={19}
                                className="text-red-600"
                            />
                        </div>

                        <div>
                            <h3 className="font-bold text-[#1a1a1a]">
                                Cancel job?
                            </h3>

                            <p className="text-xs text-gray-500">
                                {job?.bookingRef || "—"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                <div className="p-5">
                    <p className="mb-4 text-sm text-gray-600">
                        The job will move to the Cancel section. It will not be
                        permanently deleted.
                    </p>

                    <label className="mb-1.5 block text-xs font-bold text-gray-600">
                        Cancellation reason *
                    </label>

                    <textarea
                        rows={4}
                        maxLength={500}
                        value={reason}
                        onChange={event => setReason(event.target.value)}
                        placeholder="Enter a clear reason for cancelling this job..."
                        className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C0392B]"
                    />

                    <p className="mt-1 text-right text-[10px] text-gray-400">
                        {reason.length}/500
                    </p>
                </div>

                <div className="flex gap-3 border-t border-gray-100 p-5">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Keep Job
                    </button>

                    <button
                        type="button"
                        disabled={loading || !isValid}
                        onClick={() => onConfirm(reason.trim())}
                        className="flex-1 rounded-xl bg-[#C0392B] py-2.5 text-sm font-bold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Cancelling..." : "Confirm Cancellation"}
                    </button>
                </div>
            </div>
        </div>
    );
}