import React from 'react';
import {
    FiInbox, FiLayers, FiFileText, FiTool,
    FiUsers, FiTrendingUp, FiCreditCard, FiArchive, FiTruck
} from 'react-icons/fi';

export default function AdminSidebar({ activeSection, setActiveSection, isSidebarOpen, setIsSidebarOpen }) {
    const tabs = [
        { id: 'requests', label: 'Requests', icon: FiInbox },
        { id: 'jobs', label: 'Jobs', icon: FiLayers },
        { id: 'jobsHistory', label: 'Jobs History', icon: FiArchive },
        { id: 'invoice', label: 'Invoice', icon: FiFileText },
        { id: 'drivers', label: 'Drivers', icon: FiUsers },
        { id: 'vehicles', label: 'Vehicles', icon: FiTruck },
        { id: 'earnings', label: 'Earnings', icon: FiTrendingUp },
        { id: 'expenses', label: 'Expenses', icon: FiCreditCard },
        { id: 'tools', label: 'Tools', icon: FiTool },
    ];

    return (
        <>
            {/* Sidebar */}
            <aside className={`w-64 shrink-0 bg-white shadow-lg border-r border-gray-200 overflow-y-auto fixed md:sticky top-16 left-0 h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] z-40 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <nav className="p-4 space-y-2">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => {
                                setActiveSection(id);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${activeSection === id
                                ? 'bg-[#C0392B] text-white font-semibold'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <Icon size={20} />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Mobile Backdrop */}
            <div
                className={`fixed inset-0 bg-black/30 z-30 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsSidebarOpen(false)}
            />
        </>
    );
}
