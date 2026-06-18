import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiPackage, FiCheck } from 'react-icons/fi';

export default function QuoteServiceDropDown({ options, value, onChange, label }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selected = options.find((o) => o.slug === value) || null;
    const SelIcon = selected?.icon || FiPackage;

    return (
        <div className="relative" ref={ref}>
            {label && (
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">{label}</label>
            )}

            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 bg-white text-left transition-all duration-200 ${open
                        ? 'border-[#C0392B] shadow-lg shadow-[#C0392B]/10'
                        : 'border-gray-200 hover:border-[#C0392B]/50 hover:shadow-md'
                    }`}
            >
                <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-red-50 text-[#C0392B] shrink-0">
                    <SelIcon size={22} />
                </span>
                <span className="grow min-w-0">
                    <span className="block font-bold text-sm text-[#1a1a1a] truncate">
                        {selected ? selected.title : "Select what you're moving…"}
                    </span>
                    {selected?.description && (
                        <span className="block text-xs text-gray-500 truncate">{selected.description}</span>
                    )}
                </span>
                <FiChevronDown
                    size={20}
                    className={`text-gray-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-[#C0392B]' : ''
                        }`}
                />
            </button>

            {/* List */}
            {open && (
                <ul className="absolute z-40 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-2xl p-1.5 max-h-80 overflow-y-auto">
                    {options.map((option) => {
                        const Icon = option.icon || FiPackage;
                        const isSel = value === option.slug;
                        return (
                            <li key={option.slug}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(option.slug);
                                        setOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${isSel ? 'bg-red-50' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <span
                                        className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors ${isSel ? 'bg-[#C0392B] text-white' : 'bg-gray-100 text-gray-500'
                                            }`}
                                    >
                                        <Icon size={18} />
                                    </span>
                                    <span className="grow min-w-0">
                                        <span
                                            className={`block font-semibold text-sm ${isSel ? 'text-[#C0392B]' : 'text-[#1a1a1a]'
                                                }`}
                                        >
                                            {option.title}
                                        </span>
                                        {option.description && (
                                            <span className="block text-xs text-gray-500 truncate">
                                                {option.description}
                                            </span>
                                        )}
                                    </span>
                                    {isSel && (
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#C0392B] text-white shrink-0">
                                            <FiCheck size={13} />
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}