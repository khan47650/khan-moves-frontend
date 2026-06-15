import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiArrowRight,
  FiPhone,
  FiMapPin,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';
import { FaBuilding, FaCouch } from "react-icons/fa";
import homeVan from '../assets/home_van.jpeg';
import { motion } from 'framer-motion';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedQuote, setSelectedQuote] = useState('Home Removal');

  const services = [
    {
      id: 1,
      icon: FiHome,
      title: 'Home Removal',
      description: 'Full house moves across UK',
      accent: true,
    },
    {
      id: 2,
      icon: FaBuilding,
      title: 'Office Move',
      description: 'Business relocation service',
      accent: true,
    },
    {
      id: 3,
      icon: FaCouch,
      title: 'Furniture Move',
      description: 'Single items & collections',
      accent: false,
    },
    {
      id: 4,
      icon: FiPackage,
      title: 'Boxes & Parcels',
      description: 'Safe courier delivery',
      accent: false,
    },
    {
      id: 5,
      icon: FiTruck,
      title: 'Vehicle Parts',
      description: 'Parts & single items',
      accent: false,
    },
    {
      id: 6,
      icon: FiPackage,
      title: 'Pallets',
      description: 'Heavy pallet transport',
      accent: false,
    },
  ];

  const quoteOptions = [
    { icon: FiHome, title: 'Home Removal' },
    { icon: FaBuilding, title: 'Office Move' },
    { icon: FaCouch, title: 'Furniture Move' },
    { icon: FiPackage, title: 'Boxes & Parcels' },
  ];

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      {/* HERO SECTION */}
      <motion.section
        className="relative text-white py-12 md:py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${homeVan})`,
          }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/45"></div>
        <div className="absolute inset-0 bg-[#C0392B]/25 mix-blend-multiply"></div>
        {/* Decorative circles */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-[#F1C40F] opacity-5 rounded-full -mr-24 -mt-24"></div>
        <div className="absolute right-16 bottom-0 w-40 h-40 bg-white opacity-3 rounded-full -mb-20"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <div className="mb-4">
              <span className="text-xs font-bold tracking-widest text-[#F1C40F] uppercase">
                UK-Wide Removals
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Moving Made <span className="text-[#F1C40F]">Simple & Fast</span>
            </h1>
            <p className="text-lg text-gray-100 mb-8 leading-relaxed">
              Homes, offices, furniture & more — anywhere in England, Scotland & Wales. Get an instant
              quote in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/booking')}
                className="bg-[#F1C40F] text-[#1a1a1a] font-bold px-8 py-3 rounded-lg hover:bg-yellow-300 transition flex items-center justify-center gap-2 text-base"
              >
                Get a Free Quote <FiArrowRight size={18} />
              </button>
              <a
                href="tel:01215556666"
                className="bg-white bg-opacity-12 text-black font-semibold px-6 py-3 rounded-lg hover:bg-opacity-20 transition flex items-center justify-center gap-2 border border-white border-opacity-25 text-base"
              >
                <FiPhone size={18} /> 0121 555 6666
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SERVICES SHOWCASE */}
      <motion.section
        className="py-12 md:py-16  bg-white"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <span className="text-xs font-bold tracking-widest text-[#C0392B] uppercase mb-3 block">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a]">
              What We Can Move
            </h2>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="p-6 rounded-lg border border-[#C0392B] border-t-4 bg-white hover:bg-gray-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <Icon
                    size={28}
                    className="text-[#C0392B]"
                  />
                  <h3 className="font-bold text-base mt-4 text-[#1a1a1a]">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                </div>
              );
            })}
          </div>

          {/* View All Services Button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-2 text-[#C0392B] font-bold hover:text-red-700 transition group"
            >
              View All Services
              <FiArrowRight
                size={18}
                className="group-hover:translate-x-1 transition"
              />
            </button>
          </div>
        </div>
      </motion.section>

      {/* INSTANT QUOTE PREVIEW */}
      <motion.section
        className="py-12 md:py-16 bg-gray-50"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <span className="text-xs font-bold tracking-widest text-[#C0392B] uppercase mb-3 block">
              Instant Quote
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a]">
              Get Your Quote in Minutes
            </h2>
            <p className="text-gray-600 mt-2 text-base md:text-lg max-w-2xl">
              No waiting, no complicated forms. Just enter your details, select your items, and
              get an instant price.
            </p>
          </div>

          {/* Quote Form Preview */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
            {/* Progress Bar */}
            <div className="bg-[#C0392B] px-6 py-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 1
                        ? 'bg-[#F1C40F] text-[#1a1a1a]'
                        : 'bg-white bg-opacity-20 text-white'
                        }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
                <span className="text-white text-xs ml-3">
                  Step 1 of 5 — Service Type
                </span>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <h3 className="font-bold text-xl text-[#1a1a1a] mb-6">
                What are you moving?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6">
                {quoteOptions.map((option, idx) => {
                  const Icon = option.icon;
                  const selected = selectedQuote === option.title;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedQuote(option.title)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer flex items-center gap-3 ${selected
                        ? 'border-[#C0392B] bg-red-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-[#C0392B]'
                        }`}
                    >
                      <Icon
                        size={20}
                        className={
                          selected ? 'text-[#C0392B]' : 'text-gray-400'
                        }
                      />
                      <span
                        className={`font-semibold text-sm ${selected ? 'text-[#C0392B]' : 'text-[#1a1a1a]'
                          }`}
                      >
                        {option.title}
                      </span>
                      {selected && (
                        <FiCheckCircle size={18} className="ml-auto text-[#C0392B]" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Next Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => navigate('/booking')}
                  className="bg-[#C0392B] text-white font-bold px-8 py-3 rounded-lg hover:bg-red-800 transition flex items-center gap-2"
                >
                  Next <FiArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* TRUST STRIP */}
      <motion.section
        className="py-10 md:py-12 bg-white"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* UK-Wide */}
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition">
              <FiMapPin size={32} className="text-[#C0392B] mx-auto mb-4" />
              <h3 className="font-bold text-lg text-[#1a1a1a] mb-2">UK-Wide Coverage</h3>
              <p className="text-gray-600 text-sm">
                England, Scotland, Wales — we move anywhere across the UK
              </p>
            </div>

            {/* Instant Quote */}
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition">
              <FiClock size={32} className="text-[#F1C40F] mx-auto mb-4" />
              <h3 className="font-bold text-lg text-[#1a1a1a] mb-2">Instant Quote</h3>
              <p className="text-gray-600 text-sm">
                No waiting, get your price instantly with our smart calculator
              </p>
            </div>

            {/* Trusted & Safe */}
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition">
              <FiCheckCircle size={32} className="text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-[#1a1a1a] mb-2">Trusted & Safe</h3>
              <p className="text-gray-600 text-sm">
                Based in Birmingham with years of experience in removals
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        className="py-10 md:py-12 bg-[#C0392B] text-white"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Move?</h2>
          <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
            Get your instant quote now. No hidden charges, just honest pricing.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/booking')}
              className="bg-[#F1C40F] text-[#1a1a1a] font-bold px-10 py-3 rounded-lg hover:bg-yellow-300 transition flex items-center justify-center gap-2 text-base"
            >
              Get Free Quote <FiArrowRight size={18} />
            </button>
            <a
              href="tel:01215556666"
              className="bg-white bg-opacity-20 text-black font-bold px-10 py-3 rounded-lg hover:bg-opacity-30 transition border border-white"
            >
              Call 0121 555 6666
            </a>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
