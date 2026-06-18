import React, { useState } from 'react';
import { FiTrendingUp } from 'react-icons/fi';
import { dummyCompletedJobs } from '../adminDummyData';

export default function Earnings() {
    const [dummyJobs] = useState(dummyCompletedJobs);

    const totalEarnings = dummyJobs.reduce((sum, job) => sum + job.finalPrice, 0);
    const avgJobValue = (totalEarnings / dummyJobs.length).toFixed(2);
    const completedCount = dummyJobs.length;

    const earningsByDriver = {};
    dummyJobs.forEach(job => {
        if (!earningsByDriver[job.driver]) {
            earningsByDriver[job.driver] = 0;
        }
        earningsByDriver[job.driver] += job.finalPrice;
    });

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Earnings Dashboard</h1>
            <p className="text-gray-500 mb-8">Track revenue from completed jobs.</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Total Earnings</p>
                    <p className="text-3xl font-bold text-[#C0392B]">£{totalEarnings}</p>
                    <p className="text-xs text-gray-500 mt-2">{completedCount} jobs completed</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Average Job Value</p>
                    <p className="text-3xl font-bold text-green-600">£{avgJobValue}</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Jobs Completed</p>
                    <p className="text-3xl font-bold text-blue-600">{completedCount}</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">This Month</p>
                    <p className="text-3xl font-bold text-yellow-600">£{totalEarnings * 0.6}</p>
                    <p className="text-xs text-gray-500 mt-2">{Math.floor(completedCount * 0.6)} jobs</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
                        <FiTrendingUp className="text-[#C0392B]" size={22} />
                        Earnings by Driver
                    </h2>

                    <div className="space-y-4">
                        {Object.entries(earningsByDriver).map(([driver, amount]) => (
                            <div key={driver}>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-semibold text-gray-700">{driver}</p>
                                    <p className="font-bold text-[#C0392B]">£{amount}</p>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-[#C0392B] h-2 rounded-full transition-all"
                                        style={{ width: `${(amount / totalEarnings) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
                        <FiTrendingUp className="text-green-600" size={22} />
                        Quick Stats
                    </h2>

                    <div className="space-y-4">
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-xs text-green-600 uppercase font-semibold mb-1">Highest Revenue Job</p>
                            <p className="text-xl font-bold text-green-900">£{Math.max(...dummyJobs.map(j => j.finalPrice))}</p>
                        </div>

                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-600 uppercase font-semibold mb-1">Lowest Revenue Job</p>
                            <p className="text-xl font-bold text-blue-900">£{Math.min(...dummyJobs.map(j => j.finalPrice))}</p>
                        </div>

                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-xs text-yellow-600 uppercase font-semibold mb-1">Most Productive Driver</p>
                            <p className="text-lg font-bold text-yellow-900">
                                {Object.entries(earningsByDriver).sort(([, a], [, b]) => b - a)[0][0]}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-[#1a1a1a] mb-6">Completed Jobs</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Ref</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Driver</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyJobs.map(job => (
                                <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-semibold text-[#C0392B]">{job.avNumber}</td>
                                    <td className="py-3 px-4 text-gray-700">{job.customerName}</td>
                                    <td className="py-3 px-4 text-gray-700">{job.driver}</td>
                                    <td className="py-3 px-4 text-gray-700">{job.date}</td>
                                    <td className="py-3 px-4 text-right font-bold text-green-600">£{job.finalPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
