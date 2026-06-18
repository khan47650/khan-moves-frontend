import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiArrowRight,
    FiAlertCircle, FiCheckCircle,
} from 'react-icons/fi';
import AuthShell from '../components/AuthShell';

export default function SignUp() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!form.name || !form.email || !form.password) {
            setError('Please fill in all required fields.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (form.password !== form.confirm) {
            setError('Passwords do not match.');
            return;
        }
        // Backend abhi nahi — sirf demo success
        setDone(true);
    };

    return (
        <AuthShell
            heading={<>Create your <span className="text-[#F1C40F]">Khan Moves</span> account</>}
            subheading="Join us to book moves faster and track all your removals in one place."
            features={['Faster repeat bookings', 'Save your addresses & items', 'Quote history & tracking']}
        >

            {done ? (
                <div className="text-center py-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <FiCheckCircle size={36} className="text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Account ready (demo)</h1>
                    <p className="text-gray-500 mb-6">
                        Sign-up isn't connected to a backend yet, but your details look good. You can sign in once accounts go live.
                    </p>
                    <Link
                        to="/signin"
                        className="inline-flex items-center justify-center gap-2 bg-[#C0392B] text-white font-bold px-6 py-3 rounded-lg hover:bg-red-800 transition"
                    >
                        Go to Sign in <FiArrowRight size={18} />
                    </Link>
                </div>
            ) : (
                <>
                    <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Sign up</h1>
                    <p className="text-gray-500 mb-8">Create an account in less than a minute.</p>

                    {error && (
                        <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            <FiAlertCircle size={16} className="shrink-0" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Field icon={FiUser} label="Full name" value={form.name} onChange={(v) => set('name', v)} placeholder="John Doe" />
                        <Field icon={FiMail} label="Email address" type="email" value={form.email} onChange={(v) => set('email', v)} placeholder="john@example.com" />
                        <Field icon={FiPhone} label="Phone number" type="tel" value={form.phone} onChange={(v) => set('phone', v)} placeholder="0121 555 6666" />

                        <div>
                            <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => set('password', e.target.value)}
                                    placeholder="At least 6 characters"
                                    className="w-full pl-10 pr-11 py-3 rounded-lg border-2 border-gray-200 focus:border-[#C0392B] outline-none transition"
                                />
                                <button type="button" onClick={() => setShowPw((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C0392B]">
                                    {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Field icon={FiLock} label="Confirm password" type={showPw ? 'text' : 'password'} value={form.confirm} onChange={(v) => set('confirm', v)} placeholder="Re-enter password" />

                        <button
                            type="submit"
                            className="w-full bg-[#C0392B] text-white font-bold py-3 rounded-lg hover:bg-red-800 transition flex items-center justify-center gap-2"
                        >
                            Create account <FiArrowRight size={18} />
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/signin" className="text-[#C0392B] font-semibold hover:underline">Sign in</Link>
                    </p>
                </>
            )}
        </AuthShell>
    );
}

/* chhota reusable input */
function Field({ icon: Icon, label, value, onChange, placeholder, type = 'text' }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">{label}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#C0392B] outline-none transition"
                />
            </div>
        </div>
    );
}