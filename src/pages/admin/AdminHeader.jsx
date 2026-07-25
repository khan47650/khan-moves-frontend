import React from "react";
import { useNavigate } from "react-router-dom";
import {
    FiLogOut,
    FiHome,
    FiMenu,
    FiX
} from "react-icons/fi";

export default function AdminHeader({
    isSidebarOpen,
    setIsSidebarOpen
}) {
    const navigate = useNavigate();

    const handleHome = () => {
        setIsSidebarOpen(false);
        navigate("/");
    };
    const handleLogout = () => {
        setIsSidebarOpen(false);

        localStorage.removeItem(
            "khanmoves_token"
        );

        localStorage.removeItem(
            "khanmoves_user"
        );

        sessionStorage.removeItem(
            "khanmoves_admin"
        );

        window.location.replace("/");
    };

    return (
        <header className="flex items-center justify-between border-b border-white/10 bg-[#1a1a1a] px-3 py-4 text-white shadow-lg sm:px-6">
            <button
                type="button"
                onClick={() => navigate("/admin")}
                className="flex items-center gap-3 transition-opacity hover:opacity-90"
            >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5 shadow-lg ring-2 ring-white/20 transition-all duration-300 hover:ring-[#F1C40F]/60">
                    <img
                        src="/Khan_Logo_transparent.png"
                        alt="Khan Moves Logo"
                        className="max-h-full max-w-full object-contain"
                    />
                </div>

                <div className="hidden flex-col text-left leading-tight xs:flex sm:flex">
                    <span className="text-base font-bold leading-none tracking-wide text-white">
                        Khan Moves
                    </span>

                    <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#F1C40F]">
                        Admin
                    </span>
                </div>
            </button>

            <div className="flex items-center gap-2 sm:gap-4">
                <button
                    type="button"
                    onClick={handleHome}
                    className="flex h-10 items-center justify-center gap-2 rounded-lg bg-white/10 px-3 text-sm transition hover:bg-white/20 sm:px-4"
                >
                    <FiHome size={16} />

                    <span className="hidden sm:inline">
                        Home
                    </span>
                </button>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#C0392B] px-3 text-sm font-semibold transition hover:bg-red-800 sm:px-4"
                >
                    <FiLogOut size={16} />

                    <span className="hidden sm:inline">
                        Logout
                    </span>
                </button>

                <button
                    type="button"
                    aria-label={
                        isSidebarOpen
                            ? "Close sidebar"
                            : "Open sidebar"
                    }
                    onClick={() =>
                        setIsSidebarOpen(
                            current => !current
                        )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10 md:hidden"
                >
                    {isSidebarOpen ? (
                        <FiX size={22} />
                    ) : (
                        <FiMenu size={22} />
                    )}
                </button>
            </div>
        </header>
    );
}