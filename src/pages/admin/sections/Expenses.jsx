import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { dummyExpenses } from '../adminDummyData';

export default function Expenses() {
    const [expenses, setExpenses] = useState(dummyExpenses);
    const [filterType, setFilterType] = useState('all');

    const expenseTypes = [
        { id: 'fuel', label: 'Fuel', color: 'blue' },
        { id: 'repair', label: 'Repair', color: 'red' },
        { id: 'miscellaneous', label: 'Miscellaneous', color: 'yellow' },
    ];

    const filteredExpenses = filterType === 'all'
        ? expenses
        : expenses.filter(e => e.type === filterType);

    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    const expensesByType = {};
    expenses.forEach(e => {
        if (!expensesByType[e.type]) {
            expensesByType[e.type] = 0;
        }
        expensesByType[e.type] += e.amount;
    });

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Expense Tracking</h1>
            <p className="text-gray-500 mb-8">Track all business expenses (fuel, repairs, etc).</p>

            <button className="flex items-center gap-2 px-4 py-2 bg-[#C0392B] text-white rounded-lg hover:bg-red-800 transition font-semibold mb-8">
                <FiPlus size={18} /> Add Expense
            </button>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Total Expenses</p>
                    <p className="text-3xl font-bold text-red-600">£{expenses.reduce((sum, e) => sum + e.amount, 0)}</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Fuel Cost</p>
                    <p className="text-3xl font-bold text-blue-600">£{expensesByType['fuel'] || 0}</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Repairs</p>
                    <p className="text-3xl font-bold text-red-600">£{expensesByType['repair'] || 0}</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Other</p>
                    <p className="text-3xl font-bold text-yellow-600">£{expensesByType['miscellaneous'] || 0}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-[#1a1a1a] mb-6">Expense Breakdown</h2>

                    <div className="space-y-4">
                        {expenseTypes.map(type => {
                            const amount = expensesByType[type.id] || 0;
                            const totalAll = Object.values(expensesByType).reduce((a, b) => a + b, 0);
                            const percentage = (amount / totalAll) * 100 || 0;
                            return (
                                <div key={type.id}>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-semibold text-gray-700">{type.label}</p>
                                        <p className="font-bold text-gray-900">£{amount}</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: type.color === 'blue' ? '#3b82f6' :
                                                    type.color === 'red' ? '#ef4444' : '#f59e0b'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Filter</h3>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-[#C0392B] outline-none"
                        >
                            <option value="all">All Types</option>
                            {expenseTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <p className="text-xs text-red-600 uppercase font-semibold mb-2">Filtered Total</p>
                        <p className="text-3xl font-bold text-red-900">£{totalExpenses}</p>
                        <p className="text-xs text-red-600 mt-2">{filteredExpenses.length} transactions</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-[#1a1a1a] mb-6">Recent Transactions</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Driver</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map(expense => (
                                <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-700">{expense.date}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${expense.type === 'fuel' ? 'bg-blue-100 text-blue-800' :
                                                expense.type === 'repair' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {expenseTypes.find(t => t.id === expense.type)?.label}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-700">{expense.description}</td>
                                    <td className="py-3 px-4 text-gray-700">{expense.driver || '-'}</td>
                                    <td className="py-3 px-4 text-right font-bold text-red-600">£{expense.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
