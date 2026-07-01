import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiEdit, FiX, FiCheckCircle,
    FiMessageSquare, FiEye, FiTrash2, FiChevronDown, FiArrowRight,
    FiPhone, FiMail, FiMapPin, FiPackage, FiDollarSign, FiClock, FiLayers, FiCheck
} from 'react-icons/fi';
import { dummyActiveJobs, dummyOnWayJobs, dummyCompletedJobs } from '../../../data/adminDummyData';

export default function Jobs() {
    const [activeTab, setActiveTab] = useState('active');
    const [activeJobs, setActiveJobs] = useState(dummyActiveJobs);
    const [onWayJobs, setOnWayJobs] = useState(dummyOnWayJobs);
    const [completedJobs, setCompletedJobs] = useState(dummyCompletedJobs);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');

    const availableDrivers = ['Ahmad Hassan', 'Hassan Khan', 'John Smith', 'Michael Brown'];
    const availableVehicles = ['Van A1', 'Van A2', 'Van B1', 'Van B2', 'Van C1'];

    // ── Outer job card — Ref only (no customer name), locations + floor/lift/parking ──
    const JobCard = ({ job, tab }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-gray-500">
                    Ref: <span className="font-bold text-[#C0392B] text-base">{job.avNumber}</span>
                </p>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${tab === 'active' ? 'bg-blue-100 text-blue-800' :
                    tab === 'on-way' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                    {tab === 'active' ? 'ACTIVE' : tab === 'on-way' ? 'ON-WAY' : 'COMPLETED'}
                </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                {/* Pickup */}
                <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#C0392B] shrink-0" />
                        <p className="text-xs text-gray-500 uppercase font-semibold">Pickup</p>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{job.pickupAddr}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                        {job.pickupFloor && (
                            <span className="flex items-center gap-1"><FiLayers size={11} /> {job.pickupFloor}</span>
                        )}
                        {job.pickupLift !== undefined && (
                            <span className="flex items-center gap-1">
                                <FiCheck size={11} className={job.pickupLift ? 'text-green-600' : 'text-gray-300'} />
                                Lift {job.pickupLift ? 'available' : 'unavailable'}
                            </span>
                        )}
                        {job.pickupParking !== undefined && (
                            <span className="flex items-center gap-1">
                                <FiCheck size={11} className={job.pickupParking ? 'text-green-600' : 'text-gray-300'} />
                                Parking {job.pickupParking ? 'available' : 'unavailable'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Delivery */}
                <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-600 shrink-0" />
                        <p className="text-xs text-gray-500 uppercase font-semibold">Delivery</p>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{job.deliveryAddr}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                        {job.deliveryFloor && (
                            <span className="flex items-center gap-1"><FiLayers size={11} /> {job.deliveryFloor}</span>
                        )}
                        {job.deliveryLift !== undefined && (
                            <span className="flex items-center gap-1">
                                <FiCheck size={11} className={job.deliveryLift ? 'text-green-600' : 'text-gray-300'} />
                                Lift {job.deliveryLift ? 'available' : 'unavailable'}
                            </span>
                        )}
                        {job.deliveryParking !== undefined && (
                            <span className="flex items-center gap-1">
                                <FiCheck size={11} className={job.deliveryParking ? 'text-green-600' : 'text-gray-300'} />
                                Parking {job.deliveryParking ? 'available' : 'unavailable'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => {
                        setSelectedJob(job);
                        setSelectedDriver(job.driver);
                        setSelectedVehicle(job.vehicle);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-semibold"
                >
                    <FiEye size={16} /> View
                </button>

                <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-semibold">
                    <FiEdit size={16} /> Edit
                </button>

                {tab === 'on-way' && (
                    <button className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-semibold">
                        <FiMessageSquare size={16} /> Message
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="relative">
            {/* Main Content */}
            <div className="w-full">
                <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Jobs Management</h1>
                <p className="text-gray-500 mb-8">Manage all customer jobs across different stages.</p>

                <div className="flex gap-2 mb-8 border-b border-gray-200">
                    {[
                        { id: 'active', label: 'Active', count: activeJobs.length },
                        { id: 'on-way', label: 'On-Way', count: onWayJobs.length },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 font-semibold text-sm border-b-2 transition ${activeTab === tab.id
                                ? 'border-[#C0392B] text-[#C0392B]'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {activeTab === 'active' && (
                        activeJobs.length === 0 ? (
                            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                                <p className="text-gray-500">No active jobs</p>
                            </div>
                        ) : activeJobs.map(job => <JobCard key={job.id} job={job} tab="active" />)
                    )}

                    {activeTab === 'on-way' && (
                        onWayJobs.length === 0 ? (
                            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                                <p className="text-gray-500">No jobs on-way</p>
                            </div>
                        ) : onWayJobs.map(job => <JobCard key={job.id} job={job} tab="on-way" />)
                    )}
                </div>
            </div>

            {/* Side Panel with Framer Motion */}
            <AnimatePresence>
                {selectedJob && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedJob(null)}
                            className="fixed inset-0 bg-black/50 z-40"
                        />

                        {/* Side Panel */}
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-16 right-0 h-[calc(100vh-64px)] w-96 bg-white z-50 overflow-y-auto shadow-2xl"
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-linear-to-r from-[#C0392B] to-red-700 text-white p-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedJob.customerName}</h2>
                                    <p className="text-red-100 text-sm mt-1">Ref: {selectedJob.avNumber}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="p-2 hover:bg-red-600 rounded-lg transition"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Status Badge */}
                                <span className={`inline-block px-4 py-2 text-xs font-bold rounded-full ${activeTab === 'active' ? 'bg-blue-100 text-blue-800' :
                                    'bg-orange-100 text-orange-800'
                                    }`}>
                                    {activeTab === 'active' ? 'ACTIVE' : 'ON-WAY'}
                                </span>

                                {/* Contact Section */}
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Contact Information</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#C0392B]/10 rounded-lg">
                                            <FiMail className="text-[#C0392B]" size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Email</p>
                                            <p className="text-sm text-gray-700 font-medium">{selectedJob.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#C0392B]/10 rounded-lg">
                                            <FiPhone className="text-[#C0392B]" size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Phone</p>
                                            <p className="text-sm text-gray-700 font-medium">{selectedJob.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Pickup ── */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#C0392B] shrink-0" />
                                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Pickup</h4>
                                    </div>
                                    <p className="text-sm text-gray-800 font-medium mb-2">{selectedJob.pickupAddr}</p>
                                    <div className="space-y-1.5">
                                        {selectedJob.pickupFloor && (
                                            <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                                <FiLayers size={13} className="text-gray-400" /> {selectedJob.pickupFloor}
                                            </p>
                                        )}
                                        {selectedJob.pickupLift !== undefined && (
                                            <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                                <FiCheck size={13} className={selectedJob.pickupLift ? 'text-green-600' : 'text-gray-300'} />
                                                Lift {selectedJob.pickupLift ? 'available' : 'unavailable'}
                                            </p>
                                        )}
                                        {selectedJob.pickupParking !== undefined && (
                                            <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                                <FiCheck size={13} className={selectedJob.pickupParking ? 'text-green-600' : 'text-gray-300'} />
                                                Parking {selectedJob.pickupParking ? 'available' : 'unavailable'}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                            <FiClock size={13} className="text-gray-400" />
                                            {selectedJob.date} · {selectedJob.time}
                                        </p>
                                    </div>
                                </div>

                                {/* ── Delivery ── */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-2.5 h-2.5 rounded-full bg-green-600 shrink-0" />
                                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Delivery</h4>
                                    </div>
                                    <p className="text-sm text-gray-800 font-medium mb-2">{selectedJob.deliveryAddr}</p>
                                    <div className="space-y-1.5">
                                        {selectedJob.deliveryFloor && (
                                            <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                                <FiLayers size={13} className="text-gray-400" /> {selectedJob.deliveryFloor}
                                            </p>
                                        )}
                                        {selectedJob.deliveryLift !== undefined && (
                                            <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                                <FiCheck size={13} className={selectedJob.deliveryLift ? 'text-green-600' : 'text-gray-300'} />
                                                Lift {selectedJob.deliveryLift ? 'available' : 'unavailable'}
                                            </p>
                                        )}
                                        {selectedJob.deliveryParking !== undefined && (
                                            <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                                <FiCheck size={13} className={selectedJob.deliveryParking ? 'text-green-600' : 'text-gray-300'} />
                                                Parking {selectedJob.deliveryParking ? 'available' : 'unavailable'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Items Section */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiPackage className="text-[#C0392B]" size={18} />
                                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Items ({selectedJob.items.length})</h4>
                                    </div>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {selectedJob.items.map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
                                            >
                                                <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                                                <span className="text-xs bg-[#C0392B]/10 text-[#C0392B] px-2 py-1 rounded font-semibold">{(item.volume / 1000).toFixed(1)} m³</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-sm font-semibold text-gray-700">Total Volume:</span>
                                        <span className="text-lg font-bold text-[#C0392B]">{selectedJob.volume}</span>
                                    </div>
                                </div>

                                {/* Price Section */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiDollarSign className="text-green-600" size={18} />
                                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Price</h4>
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-4xl font-bold text-green-600">£{selectedJob.finalPrice}</span>
                                        {selectedJob.discount > 0 && (
                                            <span className="text-sm text-green-700 font-semibold">-£{selectedJob.discount}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Driver & Vehicle - Conditional */}
                                {activeTab === 'active' && (
                                    <>
                                        {/* Driver Selection */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">Assign Driver</label>
                                            <div className="relative">
                                                <select
                                                    value={selectedDriver}
                                                    onChange={(e) => setSelectedDriver(e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20 transition"
                                                >
                                                    <option value="">Select Driver</option>
                                                    {availableDrivers.map(driver => (
                                                        <option key={driver} value={driver}>{driver}</option>
                                                    ))}
                                                </select>
                                                <FiChevronDown className="absolute right-3 top-3 pointer-events-none text-gray-500" size={18} />
                                            </div>
                                        </div>

                                        {/* Vehicle Selection */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">Assign Vehicle</label>
                                            <div className="relative">
                                                <select
                                                    value={selectedVehicle}
                                                    onChange={(e) => setSelectedVehicle(e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20 transition"
                                                >
                                                    <option value="">Select Vehicle</option>
                                                    {availableVehicles.map(vehicle => (
                                                        <option key={vehicle} value={vehicle}>{vehicle}</option>
                                                    ))}
                                                </select>
                                                <FiChevronDown className="absolute right-3 top-3 pointer-events-none text-gray-500" size={18} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* On-Way: Read-only Driver & Vehicle */}
                                {activeTab === 'on-way' && (
                                    <>
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Assigned Driver</p>
                                            <p className="text-lg font-bold text-[#C0392B]">{selectedJob.driver}</p>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Assigned Vehicle</p>
                                            <p className="text-lg font-bold text-[#C0392B]">{selectedJob.vehicle}</p>
                                        </div>
                                    </>
                                )}

                                {/* Special Instructions */}
                                {selectedJob.specialInstructions && (
                                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                        <p className="text-xs text-yellow-700 uppercase font-semibold mb-2">⚠️ Special Instructions</p>
                                        <p className="text-sm text-yellow-800">{selectedJob.specialInstructions}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-3 pt-4 border-t border-gray-200">
                                    {activeTab === 'active' && (
                                        <>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition text-sm font-bold uppercase tracking-wide"
                                            >
                                                <FiCheckCircle size={18} /> Complete Job
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition text-sm font-bold uppercase tracking-wide"
                                            >
                                                <FiArrowRight size={18} /> Go (On-Way)
                                            </motion.button>
                                        </>
                                    )}

                                    {activeTab === 'on-way' && (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition text-sm font-bold uppercase tracking-wide"
                                        >
                                            <FiCheckCircle size={18} /> Complete Job
                                        </motion.button>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            if (activeTab === 'active') {
                                                setActiveJobs(activeJobs.filter(j => j.id !== selectedJob.id));
                                            } else if (activeTab === 'on-way') {
                                                setOnWayJobs(onWayJobs.filter(j => j.id !== selectedJob.id));
                                            }
                                            setSelectedJob(null);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-bold uppercase tracking-wide"
                                    >
                                        Cancel Job
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}