import React, { useState } from 'react';
import { FiSearch, FiDownload, FiCopy, FiX } from 'react-icons/fi';
import { dummyActiveJobs, dummyCompletedJobs } from '../adminDummyData';

export default function Invoice() {
    const allJobs = [...dummyActiveJobs, ...dummyCompletedJobs];
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [invoiceData, setInvoiceData] = useState({
        notes: '',
        discount: 0,
        tax: 0,
    });

    const filteredJobs = allJobs.filter(job =>
        job.avNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectJob = (job) => {
        setSelectedJob(job);
        setInvoiceData({
            notes: '',
            discount: job.discount || 0,
            tax: 0,
        });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Generate Invoice</h1>
            <p className="text-gray-500 mb-8">Search for a job and generate an invoice.</p>

            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <label className="block text-sm font-semibold text-[#1a1a1a] mb-3">Search Job</label>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by AV number or customer name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#C0392B] outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredJobs.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No jobs found</div>
                        ) : (
                            filteredJobs.map(job => (
                                <button
                                    key={job.id}
                                    onClick={() => handleSelectJob(job)}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition ${selectedJob?.id === job.id
                                            ? 'border-[#C0392B] bg-red-50'
                                            : 'border-gray-200 bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    <p className="font-semibold text-[#1a1a1a]">{job.avNumber}</p>
                                    <p className="text-sm text-gray-600">{job.customerName}</p>
                                    <p className="text-xs text-gray-500">£{job.finalPrice}</p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    {selectedJob ? (
                        <>
                            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Base Price</label>
                                    <p className="text-2xl font-bold text-[#C0392B]">£{selectedJob.basePrice.toFixed(2)}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Discount (£)</label>
                                        <input
                                            type="number"
                                            value={invoiceData.discount}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, discount: parseFloat(e.target.value) })}
                                            className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#C0392B] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Tax (£)</label>
                                        <input
                                            type="number"
                                            value={invoiceData.tax}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, tax: parseFloat(e.target.value) })}
                                            className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#C0392B] outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Total</p>
                                    <p className="text-3xl font-bold text-[#C0392B]">
                                        £{(selectedJob.basePrice - invoiceData.discount + invoiceData.tax).toFixed(2)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Additional Notes</label>
                                    <textarea
                                        value={invoiceData.notes}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                                        placeholder="Any additional notes for the invoice..."
                                        className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#C0392B] outline-none resize-none"
                                        rows="3"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#C0392B] text-white rounded-lg hover:bg-red-800 transition font-semibold">
                                    <FiDownload size={18} /> Download PDF
                                </button>
                                <button
                                    onClick={() => {
                                        alert('Invoice copied to clipboard!');
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                                >
                                    <FiCopy size={18} /> Copy
                                </button>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <p className="text-gray-500">Select a job to generate invoice</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
