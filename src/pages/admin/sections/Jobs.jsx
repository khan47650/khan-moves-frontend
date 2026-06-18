import React, { useState } from 'react';
import {
    FiEdit, FiDelete, FiArrowRight, FiCheckCircle, FiXCircle,
    FiMessageSquare
} from 'react-icons/fi';
import { dummyActiveJobs, dummyOnWayJobs, dummyCompletedJobs } from '../adminDummyData';

export default function Jobs() {
    const [activeTab, setActiveTab] = useState('active');
    const [activeJobs, setActiveJobs] = useState(dummyActiveJobs);
    const [onWayJobs, setOnWayJobs] = useState(dummyOnWayJobs);
    const [completedJobs, setCompletedJobs] = useState(dummyCompletedJobs);
    const [deletedJobs, setDeletedJobs] = useState([]);

    const JobCard = ({ job, tab }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-[#1a1a1a]">{job.customerName}</h3>
                    <p className="text-sm text-gray-500">
                        Ref: <span className="font-semibold text-[#C0392B]">{job.avNumber}</span>
                    </p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${tab === 'active' ? 'bg-blue-100 text-blue-800' :
                        tab === 'on-way' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                    }`}>
                    {tab === 'active' ? 'ACTIVE' : tab === 'on-way' ? 'ON-WAY' : 'COMPLETED'}
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
                {tab !== 'completed' && (
                    <>
                        <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-semibold">
                            <FiEdit size={16} /> Edit
                        </button>
                        {tab === 'on-way' && (
                            <>
                                <button className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-semibold">
                                    <FiCheckCircle size={16} /> Complete
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-semibold">
                                    <FiXCircle size={16} /> Cancel
                                </button>
                            </>
                        )}
                        {tab === 'active' && (
                            <button
                                onClick={() => {
                                    const job = activeJobs.find(j => j.id === job.id);
                                    if (job) {
                                        setActiveJobs(activeJobs.filter(j => j.id !== job.id));
                                        setOnWayJobs([...onWayJobs, { ...job, status: 'on-way' }]);
                                        alert(`Job ${job.avNumber} moved to On-Way`);
                                    }
                                }}
                                className="flex items-center gap-2 px-3 py-2 bg-[#C0392B] text-white rounded-lg hover:bg-red-800 transition text-sm font-semibold"
                            >
                                <FiArrowRight size={16} /> Go
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (tab === 'active') {
                                    setDeletedJobs([...deletedJobs, job]);
                                    setActiveJobs(activeJobs.filter(j => j.id !== job.id));
                                } else if (tab === 'on-way') {
                                    setDeletedJobs([...deletedJobs, job]);
                                    setOnWayJobs(onWayJobs.filter(j => j.id !== job.id));
                                }
                                alert(`Job ${job.avNumber} deleted`);
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-semibold"
                        >
                            <FiDelete size={16} /> Delete
                        </button>
                    </>
                )}
                {tab === 'on-way' && (
                    <button className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-semibold">
                        <FiMessageSquare size={16} /> Message
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Jobs Management</h1>
            <p className="text-gray-500 mb-8">Manage all customer jobs across different stages.</p>

            <div className="flex gap-2 mb-8 border-b border-gray-200">
                {[
                    { id: 'active', label: 'Active', count: activeJobs.length },
                    { id: 'on-way', label: 'On-Way', count: onWayJobs.length },
                    { id: 'completed', label: 'Completed', count: completedJobs.length },
                    { id: 'deleted', label: 'Trash', count: deletedJobs.length },
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

                {activeTab === 'completed' && (
                    completedJobs.length === 0 ? (
                        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                            <p className="text-gray-500">No completed jobs yet</p>
                        </div>
                    ) : completedJobs.map(job => <JobCard key={job.id} job={job} tab="completed" />)
                )}

                {activeTab === 'deleted' && (
                    deletedJobs.length === 0 ? (
                        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                            <p className="text-gray-500">No deleted jobs</p>
                        </div>
                    ) : deletedJobs.map(job => (
                        <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-6 opacity-75">
                            <p className="text-gray-600">{job.customerName} - {job.avNumber}</p>
                            <p className="text-xs text-gray-400">Deleted from {job.status}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
