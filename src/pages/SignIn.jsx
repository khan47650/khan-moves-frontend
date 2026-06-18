import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle,
} from 'react-icons/fi';
import AuthShell from '../components/AuthShell';
import { loginAdmin } from '../utils/adminAuth';

export default function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setTimeout(() => {
            if (loginAdmin(email, password)) {
                navigate('/admin');
            } else {
                setError('Invalid email or password. Please try again.');
            }
            setLoading(false);
        }, 400);
    };

    return (
        <AuthShell
            heading={<>Welcome back to <span className="text-[#F1C40F]">Khan Moves</span></>}
            subheading="Sign in to manage bookings, quotes and your removals operations."
            features={[
                'Manage all bookings in one place',
                'Track quotes & customer requests',
                'UK-wide removals dashboard',
            ]}
        >
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Sign in</h1>
            <p className="text-gray-500 mb-8">Enter your credentials to access your account.</p>

            {error && (
                <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    <FiAlertCircle size={16} className="shrink-0" /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Email address</label>
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@khanmoves.co.uk"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#C0392B] outline-none transition"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Password</label>
                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type={showPw ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full pl-10 pr-11 py-3 rounded-lg border-2 border-gray-200 focus:border-[#C0392B] outline-none transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C0392B]"
                        >
                            {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-[#C0392B]" /> Remember me
                    </label>
                    <button type="button" className="text-[#C0392B] font-semibold hover:underline">
                        Forgot password?
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C0392B] text-white font-bold py-3 rounded-lg hover:bg-red-800 transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {loading ? 'Signing in…' : <>Sign in <FiArrowRight size={18} /></>}
                </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#C0392B] font-semibold hover:underline">Sign up</Link>
            </p>

        </AuthShell>
    );
}