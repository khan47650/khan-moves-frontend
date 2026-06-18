import React, { useState } from 'react';
import { FiMail, FiCheck, FiX } from 'react-icons/fi';
import { dummyRequests } from '../adminDummyData';

export default function Requests() {
    const [requests, setRequests] = useState(dummyRequests);

    const handleAccept = (id) => {
        const req = requests.find(r => r.id === id);
        alert(`Request ${req.avNumber} accepted! Moving to Active Jobs...`);
        setRequests(requests.filter(r => r.id !== id));
    };

    const handleDecline = (id) => {
        const req = requests.find(r => r.id === id);
        alert(`Request ${req.avNumber} declined.`);
        setRequests(requests.filter(r => r.id !== id));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Booking Requests</h1>
            <p className="text-gray-500 mb-8">Pending customer booking requests waiting for approval.</p>

            {requests.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                    <p className="text-gray-500">No pending requests</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => (
                        <div
                            key={req.id}
                            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-[#1a1a1a]">{req.customerName}</h3>
                                    <p className="text-sm text-gray-500">
                                        Ref: <span className="font-semibold text-[#C0392B]">{req.avNumber}</span> • {req.submittedAt}
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                    PENDING
                                </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Contact</p>
                                    <p className="text-sm text-gray-700">{req.email}</p>
                                    <p className="text-sm text-gray-700">{req.phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Route</p>
                                    <p className="text-sm text-gray-700">{req.pickupPostcode} → {req.deliveryPostcode}</p>
                                    <p className="text-xs text-gray-500">Date: {req.date} ({req.time})</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Items</p>
                                    <p className="text-sm text-gray-700">{req.items.join(', ')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Volume</p>
                                    <p className="text-lg font-bold text-[#C0392B]">{req.totalVolume}</p>
                                </div>
                            </div>

                            {req.specialInstructions && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs text-blue-600 font-semibold mb-1">SPECIAL INSTRUCTIONS</p>
                                    <p className="text-sm text-blue-900">{req.specialInstructions}</p>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-3 items-center">
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-semibold">
                                    <FiMail size={16} /> Send Invoice
                                </button>
                                <button
                                    onClick={() => handleAccept(req.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-semibold"
                                >
                                    <FiCheck size={16} /> Accept
                                </button>
                                <button
                                    onClick={() => handleDecline(req.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
                                >
                                    <FiX size={16} /> Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
