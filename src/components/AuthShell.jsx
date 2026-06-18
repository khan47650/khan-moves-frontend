import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

export default function AuthShell({ heading, subheading, features = [], children }) {
    return (
        <div className="min-h-full grid lg:grid-cols-2 bg-white">
            {/* LEFT brand panel */}
            <div className="relative hidden lg:flex flex-col justify-center p-12 text-white overflow-hidden bg-linear-to-br from-[#C0392B] to-[#7d1f15]">
                <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#F1C40F]/10 rounded-full" />
                <div className="absolute -left-16 bottom-10 w-56 h-56 bg-white/5 rounded-full" />

                <div className="relative">
                    <h2 className="text-4xl font-bold leading-tight mb-4">{heading}</h2>
                    <p className="text-white/80 mb-8 max-w-md">{subheading}</p>
                    <ul className="space-y-3">
                        {features.map((f) => (
                            <li key={f} className="flex items-center gap-3 text-white/90">
                                <FiCheckCircle className="text-[#F1C40F] shrink-0" size={20} /> {f}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* RIGHT content */}
            <div className="flex items-center justify-center p-6 sm:p-10 lg:py-16">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}