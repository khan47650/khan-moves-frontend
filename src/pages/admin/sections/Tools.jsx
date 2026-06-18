import React, { useState } from 'react';
import { FiMessageSquare, FiLink, FiFileText, FiCopy } from 'react-icons/fi';
import { FaCalculator } from 'react-icons/fa';

export default function Tools() {
    const [calculatorBase, setCalculatorBase] = useState(100);
    const [calculatorDiscount, setCalculatorDiscount] = useState(0);

    const final = calculatorBase - calculatorDiscount;

    const messages = [
        {
            title: 'Job Accepted',
            text: 'Hi [CUSTOMER], your booking [AV-NUMBER] has been accepted. We will contact you 24 hours before pickup. Thank you!'
        },
        {
            title: 'Driver Assigned',
            text: 'Hi [CUSTOMER], your driver [DRIVER-NAME] will pick up at [TIME] on [DATE]. Contact: [PHONE]'
        },
        {
            title: 'On-Way',
            text: 'Hi [CUSTOMER], our driver is now on the way with your items. Expected delivery: [TIME]'
        },
        {
            title: 'Completed',
            text: 'Hi [CUSTOMER], your move has been completed successfully. Invoice: [AV-NUMBER]. Thank you!'
        },
    ];

    const links = [
        { title: 'AnyVan', url: 'https://www.anyvan.com', desc: 'Reference competitor' },
        { title: 'Khan Moves Home', url: '#', desc: 'Main website' },
        { title: 'Email Support', url: 'mailto:admin@khanmoves.co.uk', desc: 'Contact admin' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Quick Tools</h1>
            <p className="text-gray-500 mb-8">Useful tools for daily operations.</p>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <FaCalculator className="text-[#C0392B]" size={24} />
                        <h2 className="text-xl font-bold text-[#1a1a1a]">Price Calculator</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Base Price (£)</label>
                            <input
                                type="number"
                                value={calculatorBase}
                                onChange={(e) => setCalculatorBase(parseFloat(e.target.value))}
                                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#C0392B] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Discount (£)</label>
                            <input
                                type="number"
                                value={calculatorDiscount}
                                onChange={(e) => setCalculatorDiscount(parseFloat(e.target.value))}
                                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#C0392B] outline-none"
                            />
                        </div>

                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-xs text-red-600 uppercase font-semibold mb-1">Final Price</p>
                            <p className="text-3xl font-bold text-[#C0392B]">£{final.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <FiLink className="text-[#C0392B]" size={24} />
                        <h2 className="text-xl font-bold text-[#1a1a1a]">Quick Links</h2>
                    </div>

                    <div className="space-y-3">
                        {links.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                            >
                                <p className="font-semibold text-[#C0392B]">{link.title}</p>
                                <p className="text-xs text-gray-500">{link.desc}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <FiMessageSquare className="text-[#C0392B]" size={24} />
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Quick Messages</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    {messages.map((msg, i) => (
                        <div key={i} className="p-4 border border-gray-200 rounded-lg">
                            <p className="font-semibold text-[#1a1a1a] mb-2">{msg.title}</p>
                            <p className="text-sm text-gray-600 mb-3 italic">"{msg.text}"</p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(msg.text);
                                    alert('Message copied!');
                                }}
                                className="text-sm flex items-center gap-2 text-[#C0392B] font-semibold hover:text-red-800 transition"
                            >
                                <FiCopy size={14} /> Copy
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <FiFileText className="text-[#C0392B]" size={24} />
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Terms & Conditions</h2>
                </div>

                <p className="text-gray-600 mb-4">
                    Standard Khan Moves Limited terms are available for reference.
                </p>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#C0392B] text-white rounded-lg hover:bg-red-800 transition font-semibold">
                        <FiFileText size={16} /> View T&C
                    </button>
                </div>
            </div>
        </div>
    );
}
