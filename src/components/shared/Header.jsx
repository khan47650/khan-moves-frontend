import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPhone,
  FiMenu,
  FiX,
  FiLogOut,
  FiGrid
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const [isOpen, setIsOpen] =
    useState(false);

  const navigate = useNavigate();

  const {
    isAuthenticated,
    isAdmin,
    logout
  } = useAuth();

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleCall = () => {
    window.location.href = "tel:07424153126";
    closeMenu();
  };

  const handleSignIn = () => {
    navigate("/signin");
    closeMenu();
  };

  const handleDashboard = () => {
    navigate("/admin");
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    closeMenu();

    navigate("/", {
      replace: true
    });
  };

  return (
    <>
      <nav className="sticky top-0 z-1000 bg-[#DC2626] text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              onClick={closeMenu}
              className="group flex items-center gap-3"
            >
              <div className="flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-lg ring-2 ring-white/30 transition-all duration-300 group-hover:ring-yellow-300/60">
                <img
                  src="/Khan_Logo_transparent.png"
                  alt="Khan Moves Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold leading-none tracking-wide text-white">
                  Khan Moves
                </span>

                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-300">
                  Limited
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 md:flex">
              {[
                {
                  label: "Home",
                  to: "/"
                },
                {
                  label: "Services",
                  to: "/services"
                },
                {
                  label: "Contact",
                  to: "/contact"
                }
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="relative text-sm font-semibold text-white transition duration-300 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 after:content-[''] hover:text-yellow-300 hover:after:w-full"
                >
                  {label}
                </Link>
              ))}

              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="relative text-sm font-semibold text-white transition duration-300 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 after:content-[''] hover:text-yellow-300 hover:after:w-full"
                >
                  Sign In
                </button>
              )}

              {isAuthenticated &&
                !isAdmin && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm font-semibold text-white transition duration-300 hover:text-yellow-300"
                  >
                    <FiLogOut
                      size={15}
                    />

                    Logout
                  </button>
                )}

              {isAuthenticated &&
                isAdmin && (
                  <button
                    type="button"
                    onClick={
                      handleDashboard
                    }
                    className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:border-yellow-300 hover:bg-white/20 hover:text-yellow-300"
                  >
                    <FiGrid
                      size={15}
                    />

                    Dashboard
                  </button>
                )}

              <button
                type="button"
                onClick={handleCall}
                className="relative flex items-center gap-2 overflow-hidden rounded-full bg-yellow-400 px-6 py-2 text-sm font-bold text-[#1a1a1a] shadow-md transition-all duration-300 hover:scale-105 hover:bg-yellow-500 hover:shadow-xl active:scale-95"
              >
                <FiPhone size={14} />
                07424 153126
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() =>
                setIsOpen(
                  current =>
                    !current
                )
              }
              aria-label="Toggle navigation"
              className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg transition-colors duration-200 hover:bg-red-700 md:hidden"
            >
              <FiMenu
                size={22}
                className={`absolute transition-all duration-300 ${isOpen
                  ? "scale-50 rotate-90 opacity-0"
                  : "scale-100 rotate-0 opacity-100"
                  }`}
              />

              <FiX
                size={22}
                className={`absolute transition-all duration-300 ${isOpen
                  ? "scale-100 rotate-0 opacity-100"
                  : "scale-50 -rotate-90 opacity-0"
                  }`}
              />
            </button>

            {/* Mobile Dropdown */}
            <div
              className={`absolute right-0 top-[calc(100%+10px)] w-56 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#DC2626] shadow-[0_8px_40px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out md:hidden ${isOpen
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-2 scale-95 opacity-0"
                }`}
            >
              <div className="px-1.5 py-2">
                {[
                  {
                    label: "Home",
                    to: "/"
                  },
                  {
                    label: "Services",
                    to: "/services"
                  },
                  {
                    label: "Contact",
                    to: "/contact"
                  }
                ].map(
                  ({
                    label,
                    to
                  }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={
                        closeMenu
                      }
                      className="block rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-white/10 hover:text-yellow-300"
                    >
                      {label}
                    </Link>
                  )
                )}

                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={
                      handleSignIn
                    }
                    className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-white transition-colors duration-150 hover:bg-white/10 hover:text-yellow-300"
                  >
                    Sign In
                  </button>
                )}

                {isAuthenticated &&
                  !isAdmin && (
                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-white transition-colors duration-150 hover:bg-white/10 hover:text-yellow-300"
                    >
                      <FiLogOut
                        size={
                          15
                        }
                      />

                      Logout
                    </button>
                  )}

                {isAuthenticated &&
                  isAdmin && (
                    <button
                      type="button"
                      onClick={
                        handleDashboard
                      }
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-white transition-colors duration-150 hover:bg-white/10 hover:text-yellow-300"
                    >
                      <FiGrid
                        size={
                          15
                        }
                      />

                      Dashboard
                    </button>
                  )}
              </div>

              <div className="mx-3 h-px bg-white/10" />

              <div className="p-3">
                <button
                  type="button"
                  onClick={handleCall}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 py-2.5 text-sm font-bold text-[#1a1a1a] transition-all duration-200 hover:bg-yellow-500 hover:shadow-lg active:scale-95"
                >
                  <FiPhone size={14} />
                  07424 153126
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Backdrop */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={closeMenu}
        className={`fixed inset-0 z-999 bg-black/25 backdrop-blur-[1px] transition-opacity duration-300 md:hidden ${isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
          }`}
      />
    </>
  );
}