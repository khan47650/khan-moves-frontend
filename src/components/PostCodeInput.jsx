import React, { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiLoader, FiCheckCircle } from 'react-icons/fi';

export default function PostCodeInput({
    label = 'Postcode',
    value = '',
    onChange,
    onResolved,
    placeholder = 'e.g. B1 1AA',
    error,
}) {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resolved, setResolved] = useState(null);
    const [open, setOpen] = useState(false);
    const boxRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => setQuery(value), [value]);

    useEffect(() => {
        const handler = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        const q = query.trim();
        if (q.length < 2) {
            setSuggestions([]);
            return;
        }
        debounceRef.current = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `https://api.postcodes.io/postcodes/${encodeURIComponent(q)}/autocomplete`
                );
                const data = await res.json();
                setSuggestions(Array.isArray(data.result) ? data.result : []);
                setOpen(true);
            } catch {
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [query]);

    const lookup = async (pc) => {
        try {
            setLoading(true);
            const res = await fetch(
                `https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`
            );
            const data = await res.json();
            if (data.status === 200 && data.result) {
                const r = data.result;
                const details = {
                    postcode: r.postcode,
                    town: r.admin_ward || r.parish || r.admin_district,
                    district: r.admin_district,
                    region: r.region || r.country,
                    country: r.country,
                    lat: r.latitude,
                    lng: r.longitude,
                };
                setResolved(details);
                onResolved && onResolved(details);
            } else {
                setResolved(null);
            }
        } catch {
            setResolved(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (pc) => {
        setQuery(pc);
        onChange && onChange(pc);
        setOpen(false);
        setSuggestions([]);
        lookup(pc);
    };

    const handleChange = (e) => {
        const v = e.target.value.toUpperCase();
        setQuery(v);
        onChange && onChange(v);
        setResolved(null);
    };

    return (
        <div className="relative" ref={boxRef}>
            {/* Label OUTSIDE input - neutral color */}
            <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
            <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => suggestions.length && setOpen(true)}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-10 py-3 rounded-lg border outline-none transition text-sm font-medium text-[#1a1a1a] placeholder:text-gray-400 placeholder:font-normal bg-white ${error ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'
                        }`}
                />
                {loading && (
                    <FiLoader className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 animate-spin" size={18} />
                )}
                {!loading && resolved && (
                    <FiCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600" size={18} />
                )}
            </div>

            {open && suggestions.length > 0 && (
                <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((pc) => (
                        <li
                            key={pc}
                            onClick={() => handleSelect(pc)}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 hover:text-[#1a1a1a] flex items-center gap-2"
                        >
                            <FiMapPin size={14} className="text-gray-400" /> {pc}
                        </li>
                    ))}
                </ul>
            )}

            {resolved && (
                <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-[#1a1a1a]">{resolved.district}</span>
                    {resolved.region ? `, ${resolved.region}` : ''} — {resolved.country}
                </p>
            )}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}