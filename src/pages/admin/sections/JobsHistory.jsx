import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiX, FiChevronDown, FiEye, FiTrash2,
    FiPhone, FiMail, FiMapPin, FiClock, FiPackage, FiDollarSign
} from 'react-icons/fi';
import { dummyCompletedJobs } from '../../../data/adminDummyData';

export default function JobsHistory() {
    const [historyType, setHistoryType] = useState('completed');
    const [completedJobs, setCompletedJobs] = useState(dummyCompletedJobs);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');

    const filteredCompletedJobs = selectedDate
        ? completedJobs.filter(job => job.date === selectedDate)
        : completedJobs;
    const [trashJobs, setTrashJobs] = useState([
        {
            id: 5,
            avNumber: 'AV1650',
            customerName: 'Robert Taylor',
            email: 'robert@example.com',
            phone: '+44 7700 900128',
            pickupAddr: '55 Willow Road, Sheffield, S11 8NE',
            deliveryAddr: '8 Oak Crescent, Leeds, LS2 7AE',
            driver: 'Hassan Khan',
            vehicle: 'Van C1',
            finalPrice: 280,
            discount: 0,
            date: '2026-06-15',
            time: '10:00 AM - 4:00 PM',
            pickupFloor: 'Ground floor',
            deliveryFloor: '2nd floor',
            items: [
                { name: 'Office Desk', volume: 2000 },
                { name: 'Office Chair', volume: 800 }
            ],
            specialInstructions: 'Handle with care - fragile items',
            volume: '2.8 m³'
        }
    ]);

    const JobCard = ({ job, type }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-[#1a1a1a]">{job.customerName}</h3>
                    <p className="text-sm text-gray-500">
                        Ref: <span className="font-semibold text-[#C0392B]">{job.avNumber}</span>
                    </p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${type === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {type === 'completed' ? 'COMPLETED' : 'DELETED'}
                </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Pickup</p>
                    <p className="text-sm text-gray-700">{job.pickupAddr}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Delivery</p>
                    <p className="text-sm text-gray-700">{job.deliveryAddr}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Driver</p>
                    <p className="text-sm font-semibold text-gray-700">{job.driver}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Price</p>
                    <p className="text-lg font-bold">
                        £{job.finalPrice}
                        {job.discount > 0 && <span className="text-xs text-green-600 ml-2">-£{job.discount}</span>}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => setSelectedJob(job)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-semibold"
                >
                    <FiEye size={16} /> View
                </button>

                {type === 'deleted' && (
                    <button
                        onClick={() => {
                            setTrashJobs(trashJobs.filter(j => j.id !== job.id));
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
                    >
                        <FiTrash2 size={16} /> Clear
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="relative">
            {/* Header */}
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Jobs History</h1>
            <p className="text-gray-500 mb-8">View completed and deleted jobs.</p>

            {/* Filter Dropdown */}
            {/* Filters */}
            <div className="mb-8 flex gap-6 items-end flex-wrap lg:flex-nowrap">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Type</label>
                    <div className="relative w-full md:w-64">
                        <select
                            value={historyType}
                            onChange={(e) => setHistoryType(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20 transition text-gray-700 font-medium"
                        >
                            <option value="completed">Completed Jobs</option>
                            <option value="trash">Trash ({trashJobs.length})</option>
                        </select>
                        <FiChevronDown className="absolute right-4 top-3.5 pointer-events-none text-gray-500" size={20} />
                    </div>
                </div>

                {historyType === 'completed' && (
                    <div className="flex gap-4 items-end">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20 transition"
                            />
                        </div>
                        {selectedDate && (
                            <button
                                onClick={() => setSelectedDate('')}
                                className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="w-full">
                <div className="space-y-4">
                    {historyType === 'completed' && (
                        filteredCompletedJobs.length === 0 ? (
                            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                                <p className="text-gray-500">{selectedDate ? 'No jobs on this date' : 'No completed jobs'}</p>
                            </div>
                        ) : filteredCompletedJobs.map(job => <JobCard key={job.id} job={job} type="completed" />)
                    )}

                    {historyType === 'trash' && (
                        <>
                            {trashJobs.length > 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setTrashJobs([])}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-bold uppercase tracking-wide mb-4"
                                >
                                    <FiTrash2 size={18} /> Clear All Trash ({trashJobs.length})
                                </motion.button>
                            )}

                            {trashJobs.length === 0 ? (
                                <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                                    <p className="text-gray-500">No deleted jobs</p>
                                </div>
                            ) : trashJobs.map(job => <JobCard key={job.id} job={job} type="deleted" />)}
                        </>
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
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
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
                                <span className={`inline-block px-4 py-2 text-xs font-bold rounded-full ${historyType === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {historyType === 'completed' ? 'COMPLETED' : 'DELETED'}
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

                                {/* Pickup Section */}
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiMapPin className="text-blue-600" size={18} />
                                        <h4 className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Pickup</h4>
                                    </div>
                                    <p className="text-sm text-blue-900 font-medium mb-2">{selectedJob.pickupAddr}</p>
                                    <p className="text-xs text-blue-700 mb-2">📍 {selectedJob.pickupFloor}</p>
                                    <div className="flex items-center gap-2 text-xs text-blue-700">
                                        <FiClock size={14} />
                                        <span>{selectedJob.date} · {selectedJob.time}</span>
                                    </div>
                                </div>

                                {/* Delivery Section */}
                                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiMapPin className="text-orange-600" size={18} />
                                        <h4 className="text-sm font-semibold text-orange-900 uppercase tracking-wide">Delivery</h4>
                                    </div>
                                    <p className="text-sm text-orange-900 font-medium mb-2">{selectedJob.deliveryAddr}</p>
                                    <p className="text-xs text-orange-700">📍 {selectedJob.deliveryFloor}</p>
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
                                <div className="bg-[#C0392B]/5 border border-[#C0392B]/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiDollarSign className="text-[#C0392B]" size={18} />
                                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Price</h4>
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-4xl font-bold text-[#C0392B]">£{selectedJob.finalPrice}</span>
                                        {selectedJob.discount > 0 && (
                                            <span className="text-sm text-green-600 font-semibold">-£{selectedJob.discount}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Driver & Vehicle Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Driver</p>
                                        <p className="text-lg font-bold text-[#C0392B]">{selectedJob.driver}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Vehicle</p>
                                        <p className="text-lg font-bold text-[#C0392B]">{selectedJob.vehicle}</p>
                                    </div>
                                </div>

                                {/* Special Instructions */}
                                {selectedJob.specialInstructions && (
                                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                        <p className="text-xs text-yellow-700 uppercase font-semibold mb-2">⚠️ Special Instructions</p>
                                        <p className="text-sm text-yellow-800">{selectedJob.specialInstructions}</p>
                                    </div>
                                )}

                                {/* Close Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedJob(null)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-bold uppercase tracking-wide"
                                >
                                    <FiX size={18} /> Close
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
