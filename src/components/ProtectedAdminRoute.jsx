import React from "react";
import {
    Navigate,
    Outlet
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedAdminRoute() {
    const {
        loading,
        isAuthenticated,
        isAdmin
    } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#C0392B]" />

                    <p className="text-sm font-semibold text-gray-500">
                        Checking admin session...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/signin"
                replace
            />
        );
    }

    if (!isAdmin) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <Outlet />;
}