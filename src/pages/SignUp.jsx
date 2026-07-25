import React, {
    useEffect,
    useState
} from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
import {
    FiUser,
    FiMail,
    FiPhone,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiAlertCircle
} from "react-icons/fi";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../contexts/AuthContext";

export default function SignUp() {
    const navigate = useNavigate();

    const {
        signup,
        user,
        isAuthenticated,
        loading: authLoading
    } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirm: ""
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {
        if (
            !authLoading &&
            isAuthenticated &&
            user
        ) {
            navigate(
                user.role === "admin"
                    ? "/admin"
                    : "/",
                {
                    replace: true
                }
            );
        }
    }, [
        authLoading,
        isAuthenticated,
        user,
        navigate
    ]);

    const updateField = (
        field,
        value
    ) => {
        setForm(current => ({
            ...current,
            [field]: value
        }));

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async event => {
        event.preventDefault();

        setError("");

        const name =
            form.name.trim();

        const email =
            form.email
                .trim()
                .toLowerCase();

        const phone =
            form.phone.trim();

        if (
            !name ||
            !email ||
            !form.password ||
            !form.confirm
        ) {
            setError(
                "Please fill in all required fields."
            );
            return;
        }

        if (
            form.password.length < 6
        ) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (
            form.password !==
            form.confirm
        ) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        try {
            setLoading(true);

            const authenticatedUser =
                await signup({
                    name,
                    email,
                    phone,
                    password:
                        form.password
                });

            navigate(
                authenticatedUser.role ===
                    "admin"
                    ? "/admin"
                    : "/",
                {
                    replace: true
                }
            );
        } catch (requestError) {
            setError(
                requestError.response?.data
                    ?.message ||
                requestError.message ||
                "Failed to create account."
            );
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#DC2626]" />

                    <p className="text-sm font-semibold text-gray-500">
                        Checking your session...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <AuthShell
            heading={
                <>
                    Create your{" "}
                    <span className="text-yellow-400">
                        Khan Moves
                    </span>{" "}
                    account
                </>
            }
            subheading="Join us to book moves faster and track all your removals in one place."
            features={[
                "Faster repeat bookings",
                "Save your addresses & items",
                "Quote history & tracking"
            ]}
        >
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Sign up
            </h1>

            <p className="mb-8 text-gray-600">
                Create an account in less than a minute.
            </p>

            {error && (
                <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <FiAlertCircle
                        size={17}
                        className="mt-0.5 shrink-0"
                    />

                    <span>{error}</span>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <Field
                    icon={FiUser}
                    label="Full name"
                    value={form.name}
                    onChange={value =>
                        updateField(
                            "name",
                            value
                        )
                    }
                    placeholder="John Doe"
                    autoComplete="name"
                />

                <Field
                    icon={FiMail}
                    label="Email address"
                    type="email"
                    value={form.email}
                    onChange={value =>
                        updateField(
                            "email",
                            value
                        )
                    }
                    placeholder="john@example.com"
                    autoComplete="email"
                />

                <Field
                    icon={FiPhone}
                    label="Phone number"
                    type="tel"
                    value={form.phone}
                    onChange={value =>
                        updateField(
                            "phone",
                            value
                        )
                    }
                    placeholder="0121 555 6666"
                    autoComplete="tel"
                    required={false}
                />

                <PasswordField
                    label="Password"
                    value={form.password}
                    onChange={value =>
                        updateField(
                            "password",
                            value
                        )
                    }
                    showPassword={
                        showPassword
                    }
                    onToggle={() =>
                        setShowPassword(
                            current =>
                                !current
                        )
                    }
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                />

                <PasswordField
                    label="Confirm password"
                    value={form.confirm}
                    onChange={value =>
                        updateField(
                            "confirm",
                            value
                        )
                    }
                    showPassword={
                        showConfirmPassword
                    }
                    onToggle={() =>
                        setShowConfirmPassword(
                            current =>
                                !current
                        )
                    }
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#DC2626] py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Creating account...
                        </>
                    ) : (
                        <>
                            Create account
                            <FiArrowRight
                                size={18}
                            />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                    to="/signin"
                    className="font-semibold text-[#DC2626] transition hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </AuthShell>
    );
}

function Field({
    icon: Icon,
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    autoComplete,
    required = true
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
                {label}
            </label>

            <div className="relative">
                <Icon
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    type={type}
                    value={value}
                    onChange={event =>
                        onChange(
                            event.target.value
                        )
                    }
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required={required}
                    className="w-full rounded-lg border-2 border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
                />
            </div>
        </div>
    );
}

function PasswordField({
    label,
    value,
    onChange,
    showPassword,
    onToggle,
    placeholder,
    autoComplete
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
                {label}
            </label>

            <div className="relative">
                <FiLock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    value={value}
                    onChange={event =>
                        onChange(
                            event.target.value
                        )
                    }
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required
                    className="w-full rounded-lg border-2 border-gray-300 py-3 pl-10 pr-11 outline-none transition focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
                />

                <button
                    type="button"
                    aria-label={
                        showPassword
                            ? "Hide password"
                            : "Show password"
                    }
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#DC2626]"
                >
                    {showPassword ? (
                        <FiEyeOff size={18} />
                    ) : (
                        <FiEye size={18} />
                    )}
                </button>
            </div>
        </div>
    );
}