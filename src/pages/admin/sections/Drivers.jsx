import React, { useState } from 'react';
import { FiUser, FiPhone, FiEdit, FiPlus, FiFileText, FiDownload } from 'react-icons/fi';
import { dummyDrivers } from '../adminDummyData';

export default function Drivers() {
    const [drivers] = useState(dummyDrivers);
    const [selectedDriver, setSelectedDriver] = useState(null);

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Driver Management</h1>
            <p className="text-gray-500 mb-8">Manage driver details, earnings, and assignments.</p>

            <button className="flex items-center gap-2 px-4 py-2 bg-[#C0392B] text-white rounded-lg hover:bg-red-800 transition font-semibold mb-8">
                <FiPlus size={18} /> Add Driver
            </button>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-1 max-h-96 overflow-y-auto">
                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Drivers</h3>
                    <div className="space-y-2">
                        {drivers.map(driver => (
                            <button
                                key={driver.id}
                                onClick={() => setSelectedDriver(driver)}
                                className={`w-full text-left p-3 rounded-lg border-2 transition ${selectedDriver?.id === driver.id
                                    ? 'border-[#C0392B] bg-red-50'
                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                                    }`}
                            >
                                <p className="font-semibold text-[#1a1a1a]">{driver.name}</p>
                                <p className="text-xs text-gray-500">{driver.totalJobs} jobs completed</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {selectedDriver ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#1a1a1a]">{selectedDriver.name}</h2>
                                    <p className="text-gray-500">Driver ID: #{selectedDriver.id}</p>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold">
                                    <FiEdit size={16} /> Edit
                                </button>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4 mb-8">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-xs text-blue-600 uppercase font-semibold mb-2">Total Jobs</p>
                                    <p className="text-3xl font-bold text-blue-900">{selectedDriver.totalJobs}</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-xs text-green-600 uppercase font-semibold mb-2">Earnings</p>
                                    <p className="text-3xl font-bold text-green-900">£{selectedDriver.earnings}</p>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <p className="text-xs text-yellow-600 uppercase font-semibold mb-2">Current Job</p>
                                    <p className="text-lg font-bold text-yellow-900">{selectedDriver.assignedNow}</p>
                                </div>
                            </div>

                            <div className="mb-8 pb-8 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Contact Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <FiPhone className="text-gray-400" size={18} />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                                            <p className="text-gray-700 font-semibold">{selectedDriver.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8 pb-8 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Employment Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Driving License</p>
                                        <div className="flex items-center justify-between gap-3 bg-gray-50 p-3 rounded-lg">
                                            <p className="text-gray-700 font-mono">{selectedDriver.licenseNumber}</p>
                                            {selectedDriver.licensePdfUrl && (

                                                <a href={selectedDriver.licensePdfUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download
                                                    className="flex items-center gap-2 px-3 py-2 bg-[#C0392B] text-white rounded-lg hover:bg-red-800 transition text-sm font-semibold shrink-0"
                                                >
                                                    <FiFileText size={16} /> View / Download
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Joining Date</p>
                                        <p className="text-gray-700 font-semibold">{selectedDriver.joiningDate}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Bank Details</h3>
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-xs text-red-600 uppercase font-semibold mb-2">Bank Account</p>
                                    <p className="text-red-900 font-mono text-sm">{selectedDriver.bankDetails}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <p className="text-gray-500">Select a driver to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
