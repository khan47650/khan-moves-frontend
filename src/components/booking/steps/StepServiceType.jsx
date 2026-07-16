import React, { useState, useEffect } from 'react';
import { FiCheck } from 'react-icons/fi';
import api from '../../../api/api';

function ServiceLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-12 h-12 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1a1a1a] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#1a1a1a]/20 animate-pulse" />
                </div>
            </div>
            <p className="text-sm font-semibold text-gray-400">Loading services...</p>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="relative flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-gray-100 bg-white animate-pulse">
            <div className="flex-1 min-w-0">
                <div className="h-3.5 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-2.5 bg-gray-100 rounded w-1/2" />
            </div>
        </div>
    );
}

export default function StepServiceType({ value, onChange, error }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const res = await api.get('/inventory/services');
                const data = res.data?.data;
                if (Array.isArray(data)) setServices(data);
            } catch (err) {
                // silent fail
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
            {/* Heading */}
            <div className="max-w-7xl mx-auto mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">
                    What are you moving?
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                    Pick the service that best matches your move
                </p>
            </div>

            {error && (
                <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
                    {error}
                </div>
            )}

            {/* Service cards grid */}
            <div className="max-w-7xl mx-auto">
                <div
                    className="bg-white rounded-2xl p-4 md:p-6"
                    style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                >
                    {loading ? (
                        <ServiceLoader />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {services.map((service) => {
                                const isSelected = value === service.slug;
                                return (
                                    <button
                                        key={service._id}
                                        type="button"
                                        onClick={() => onChange(service.slug)}
                                        className={`relative flex items-center gap-3 px-4 py-4 rounded-xl border-2 text-left transition group ${isSelected
                                            ? 'border-[#1a1a1a] bg-[#F9F8F6]'
                                            : 'border-gray-200 hover:border-gray-400 bg-white'
                                            }`}
                                    >
                                        {/* Text */}
                                        <div className="flex-1 min-w-0 pr-5">
                                            <p className="font-bold text-sm text-[#1a1a1a] leading-tight">
                                                {service.label}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 leading-snug">
                                                {service.items?.length || 0} items available
                                            </p>
                                        </div>

                                        {/* Selected check badge */}
                                        {isSelected && (
                                            <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                                                <FiCheck size={12} className="text-white" strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {!loading && services.length === 0 && (
                        <p className="text-center text-gray-400 text-sm py-8">No services available.</p>
                    )}

                    <p className="text-xs text-gray-500 mt-5 text-center">
                        Don't worry — you can refine the details in the next steps.
                    </p>
                </div>
            </div>
        </div>
    );
}
