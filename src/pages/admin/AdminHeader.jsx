import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiHome, FiMenu, FiX } from 'react-icons/fi';
import { logoutAdmin } from '../../utils/adminAuth';

export default function AdminHeader({ isSidebarOpen, setIsSidebarOpen }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutAdmin();
        navigate('/signin');
    };

    return (
        <header className="bg-[#1a1a1a] text-white px-6 py-4 flex items-center justify-between shadow-lg border-b border-white/10">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
                <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-white/20 shrink-0 p-1.5 hover:ring-[#F1C40F]/60 transition-all duration-300">
                    <img src="/Khan_Logo_transparent.png" alt="Khan Logo" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="font-bold tracking-wide text-base leading-none text-white">Khan Moves</span>
                    <span className="text-[#F1C40F] text-[9px] font-semibold tracking-[0.15em] uppercase mt-0.5">Admin</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-red-700 transition-colors">
                    {isSidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                </button>

                <button onClick={() => navigate('/')} className="hidden sm:flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
                    <FiHome size={16} /> Home
                </button>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm bg-[#C0392B] hover:bg-red-800 px-4 py-2 rounded-lg transition font-semibold">
                    <FiLogOut size={16} /> Logout
                </button>
            </div>
        </header>
    );
}
