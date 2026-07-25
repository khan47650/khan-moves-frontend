import React, {
    useState
} from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiAlertCircle
} from "react-icons/fi";
import AuthShell from "../components/AuthShell";
import ForgotPasswordDialog from "../components/ForgotPasswordDialog";
import { useAuth } from "../contexts/AuthContext";

export default function SignIn() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPw, setShowPw] =
        useState(false);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [
        forgotPasswordOpen,
        setForgotPasswordOpen
    ] = useState(false);

    const handleSubmit = async event => {
        event.preventDefault();

        setError("");

        try {
            setLoading(true);

            const user = await login({
                email,
                password
            });

            navigate(
                user.role === "admin"
                    ? "/admin"
                    : "/"
            );
        } catch (requestError) {
            setError(
                requestError.response?.data
                    ?.message ||
                requestError.message ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AuthShell
                heading={
                    <>
                        Welcome back to{" "}
                        <span className="text-yellow-400">
                            Khan Moves
                        </span>
                    </>
                }
                subheading="Sign in to manage bookings, quotes and your removals operations."
                features={[
                    "Manage all bookings in one place",
                    "Track quotes & customer requests",
                    "UK-wide removals dashboard"
                ]}
            >
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    Sign in
                </h1>

                <p className="mb-8 text-gray-600">
                    Enter your credentials to access your account.
                </p>

                {error && (
                    <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        <FiAlertCircle
                            size={16}
                            className="shrink-0"
                        />

                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-900">
                            Email address
                        </label>

                        <div className="relative">
                            <FiMail
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="email"
                                value={email}
                                onChange={event =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your Email"
                                required
                                className="w-full rounded-lg border-2 border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-900">
                            Password
                        </label>

                        <div className="relative">
                            <FiLock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type={
                                    showPw
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={event =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="••••••••"
                                required
                                className="w-full rounded-lg border-2 border-gray-300 py-3 pl-10 pr-11 outline-none transition focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPw(
                                        current =>
                                            !current
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#DC2626]"
                            >
                                {showPw ? (
                                    <FiEyeOff size={18} />
                                ) : (
                                    <FiEye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex cursor-pointer items-center gap-2 text-gray-600">
                            <input
                                type="checkbox"
                                checked
                                readOnly
                                className="h-4 w-4 rounded accent-[#DC2626]"
                            />

                            Remember me
                        </label>

                        <button
                            type="button"
                            onClick={() =>
                                setForgotPasswordOpen(
                                    true
                                )
                            }
                            className="font-semibold text-[#DC2626] transition hover:underline"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#DC2626] py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign in
                                <FiArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="font-semibold text-[#DC2626] transition hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </AuthShell>

            <ForgotPasswordDialog
                open={forgotPasswordOpen}
                onClose={() =>
                    setForgotPasswordOpen(false)
                }
            />
        </>
    );
}