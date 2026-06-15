import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMapPin, FiMail } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-white mt-16">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Khan Moves Limited</h3>
            <p className="text-gray-400 text-sm mb-4">
              UK's fastest removals service. Moving homes, offices, and furniture across England, Scotland, and Wales.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <FiMapPin size={16} className="text-[#F1C40F]" />
              Birmingham, UK
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FiPhone size={16} className="text-[#F1C40F]" />
              Operating Nationwide
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-[#F1C40F] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#F1C40F] transition">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-[#F1C40F] transition">
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F1C40F] transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#services" className="hover:text-[#F1C40F] transition">
                  Home Removal
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#F1C40F] transition">
                  Office Move
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#F1C40F] transition">
                  Furniture Courier
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#F1C40F] transition">
                  Vehicle Parts
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Info</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <FiPhone size={16} className="text-[#F1C40F] mt-0.5 shrink-0" />
                <div>
                  <a href="tel:01215556666" className="hover:text-[#F1C40F] transition block">
                    0121 555 6666
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FiMail size={16} className="text-[#F1C40F] mt-0.5 shrink-0" />
                <div>
                  <a href="mailto:info@khanmoves.co.uk" className="hover:text-[#F1C40F] transition block">
                    info@khanmoves.co.uk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Khan Moves Limited. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link to="/terms" className="hover:text-[#F1C40F] transition">
                Terms & Conditions
              </Link>
              <a href="#privacy" className="hover:text-[#F1C40F] transition">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar
      <div className="bg-[#0f0f0f] px-6 py-4 text-center text-gray-600 text-sm">
        Made with ❤️ for Khan Moves | Removals Simplified
      </div> */}
    </footer>
  );
}
