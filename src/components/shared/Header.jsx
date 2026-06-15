import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPhone, FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetQuote = () => {
    navigate('/booking');
    setIsOpen(false);
  };

  return (
    <>
      <nav className="bg-[#C0392B] text-white sticky top-0 z-50 shadow-lg animate-[fadeIn_0.6s_ease-out]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 relative">

            {/* ── Logo (Bigger & Clearer) ── */}
            <Link to="/" className="flex items-center gap-3 group">
              <div
                className="w-13 h-13 bg-white rounded-xl flex items-center justify-center
    overflow-hidden shadow-lg ring-2 ring-white/30 shrink-0 p-1.5
    group-hover:ring-[#F1C40F]/60 transition-all duration-300"
              >
                <img
                  src="/Khan_Logo_transparent.png"
                  alt="Khan Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold tracking-wide text-lg leading-none text-white">
                  Khan Moves
                </span>
                <span className="text-[#F1C40F] text-[10px] font-semibold tracking-[0.2em] uppercase mt-1">
                  Limited
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'Home', to: '/' },
                { label: 'Services', to: '/services' },
                { label: 'Contact', to: '/contact' },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="relative text-sm font-medium text-white/90 hover:text-white transition duration-300
                    after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0
                    after:bg-[#F1C40F] after:transition-all after:duration-300 hover:after:w-full"
                >
                  {label}
                </Link>
              ))}

              <button
                className="text-sm cursor-pointer font-medium text-white/90 hover:text-white transition duration-300
                  relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5
                  after:w-0 after:bg-[#F1C40F] after:transition-all after:duration-300 hover:after:w-full"
              >
                Sign In
              </button>

              <button
                onClick={handleGetQuote}
                className="relative overflow-hidden bg-linear-to-r from-[#F1C40F] to-yellow-400
                  text-[#1a1a1a] font-bold px-6 py-2 rounded-full text-sm flex items-center gap-2
                  shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition" />
                <FiPhone size={14} /> Get Quote
              </button>
            </div>

            {/* ── Hamburger (animated icon swap) ── */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
              className="md:hidden relative flex items-center justify-center w-10 h-10
                rounded-lg hover:bg-red-700 transition-colors duration-200 overflow-hidden"
            >
              <FiMenu
                size={22}
                className={`absolute transition-all duration-300
                  ${isOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
              />
              <FiX
                size={22}
                className={`absolute transition-all duration-300
                  ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
              />
            </button>

            {/* ── Mobile Dropdown Panel (Artify-style) ── */}
            <div
              className={`absolute top-[calc(100%+10px)] right-0 w-52 rounded-2xl overflow-hidden
                bg-[#C0392B] shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/10
                transition-all duration-300 ease-out origin-top-right md:hidden
                ${isOpen
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
            >
              {/* Nav Links */}
              <div className="py-2 px-1.5">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Services', to: '/services' },
                  { label: 'Contact', to: '/contact' },
                ].map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-white/85 hover:text-white
                      hover:bg-white/10 rounded-xl transition-colors duration-150"
                  >
                    {label}
                  </Link>
                ))}

                <button
                  // onClick={() => { navigate('/signin'); setIsOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-white/85
                    hover:text-white hover:bg-white/10 rounded-xl transition-colors duration-150"
                >
                  Sign In
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 mx-3" />

              {/* CTA Button */}
              <div className="p-3">
                <button
                  onClick={handleGetQuote}
                  className="w-full bg-linear-to-r from-[#F1C40F] to-yellow-400
                    text-[#1a1a1a] font-bold py-2.5 rounded-xl text-sm
                    flex items-center justify-center gap-2
                    hover:shadow-lg active:scale-95 transition-all duration-200"
                >
                  <FiPhone size={14} /> Get Quote
                </button>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Backdrop (closes menu on outside click) ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px] md:hidden
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
}