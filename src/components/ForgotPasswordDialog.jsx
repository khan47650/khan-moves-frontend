import React, {
    useEffect,
    useState
} from "react";
import {
    FiAlertCircle,
    FiCheckCircle,
    FiMail,
    FiX
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";

export default function ForgotPasswordDialog({
    open,
    onClose
}) {
    const { forgotPassword } =
        useAuth();

    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    useEffect(() => {
        if (open) {
            setEmail("");
            setError("");
            setSuccess("");
        }
    }, [open]);

    if (!open) return null;

    const handleSubmit = async event => {
        event.preventDefault();

        setError("");
        setSuccess("");

        try {
            setLoading(true);

            const message =
                await forgotPassword(
                    email
                );

            setSuccess(message);
        } catch (requestError) {
            setError(
                requestError.response?.data
                    ?.message ||
                requestError.message ||
                "Failed to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

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
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Forgot password?
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            Enter your registered email address.
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={onClose}
                        className="rounded-lg p-2 transition hover:bg-gray-100 disabled:opacity-50"
                    >
                        <FiX size={19} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-5"
                >
                    {error && (
                        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            <FiAlertCircle
                                size={17}
                                className="mt-0.5 shrink-0"
                            />

                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            <FiCheckCircle
                                size={17}
                                className="mt-0.5 shrink-0"
                            />

                            <span>{success}</span>
                        </div>
                    )}

                    {!success && (
                        <>
                            <label className="mb-2 block text-sm font-semibold text-gray-900">
                                Registered email
                            </label>

                            <div className="relative">
                                <FiMail
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={event =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your registered email"
                                    className="w-full rounded-lg border-2 border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
                                />
                            </div>
                        </>
                    )}

                    <div className="mt-5 flex gap-3">
                        <button
                            type="button"
                            disabled={loading}
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            Close
                        </button>

                        {!success && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 rounded-lg bg-[#DC2626] py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                            >
                                {loading
                                    ? "Sending..."
                                    : "Send New Password"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}