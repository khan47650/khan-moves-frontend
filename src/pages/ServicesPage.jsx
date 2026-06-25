import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiArrowRight,
  FiCheckCircle,
} from 'react-icons/fi';
import { FaBuilding, FaCouch } from 'react-icons/fa';

export default function ServicesPage() {
  const navigate = useNavigate();

  const services = [
    {
      id: 'home',
      icon: FiHome,
      title: 'Home Removal',
      description: 'Full house moves across the UK',
      details: [
        'Complete household moves',
        'All furniture and belongings',
        'Packaging and wrapping included',
        'Safe transport across UK',
      ],
    },
    {
      id: 'office',
      icon: FaBuilding,
      title: 'Office Relocation',
      description: 'Business moving made simple',
      details: [
        'Office furniture and equipment',
        'Minimal downtime',
        'Professional handling',
        'Team coordination available',
      ],
    },
    {
      id: 'furniture',
      icon: FaCouch,
      title: 'Furniture Moves',
      description: 'Single items or full collections',
      details: [
        'Individual pieces or sets',
        'Careful handling & padding',
        'Flexible scheduling',
        'Courier delivery available',
      ],
    },
    {
      id: 'parcels',
      icon: FiPackage,
      title: 'Boxes & Parcels',
      description: 'Safe courier delivery service',
      details: [
        'Small to medium packages',
        'Tracked delivery',
        'Signature on delivery',
        'Weather-protected transport',
      ],
    },
    {
      id: 'vehicle',
      icon: FiTruck,
      title: 'Vehicle Parts',
      description: 'Automotive and spare parts',
      details: [
        'Engine components',
        'Body parts & accessories',
        'Secure packaging',
        'Fast delivery available',
      ],
    },
    {
      id: 'pallets',
      icon: FiPackage,
      title: 'Pallet Transport',
      description: 'Heavy pallet and bulk delivery',
      details: [
        'Full & part loads',
        'Industrial pallets',
        'Forklift available',
        'Nationwide coverage',
      ],
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 50, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#F5F1ED]"
    >
      {/* HEADER */}
      <section className="relative bg-[#DC2626] text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#DC2626] to-red-700" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400 opacity-5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-bold tracking-[0.25em] text-yellow-400 uppercase mb-4"
          >
            What We Offer
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          >
            Our Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-100 max-w-2xl mx-auto"
          >
            From small furniture moves to complete house relocations, we've got you covered across the UK.
          </motion.p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-16 md:py-20 bg-[#F5F1ED]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  variants={cardVariant}
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group rounded-2xl overflow-hidden border border-gray-300 bg-white
                    shadow-sm hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
                >
                  {/* Header with Icon */}
                  <div className="bg-linear-to-br from-[#DC2626] to-red-700 h-24 flex items-end p-6 relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full
                      group-hover:scale-150 transition-transform duration-500" />
                    <Icon
                      size={40}
                      className="text-white relative z-10 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-sm">{service.description}</p>

                    <ul className="space-y-2.5 mb-6 grow">
                      {service.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <FiCheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => navigate('/booking', { state: { serviceType: service.id } })}
                      className="w-full bg-[#DC2626] hover:bg-red-700 text-white font-bold py-2.5 rounded-lg
                        transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      Get Quote
                      <FiArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center"
          >
            Why Choose Khan Moves?
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: '⚡', title: 'Fast & Reliable', description: 'Quick quotes, professional service, on-time delivery' },
              { icon: '💰', title: 'Fair Pricing', description: 'Transparent pricing, no hidden charges, competitive rates' },
              { icon: '🛡️', title: 'Insured & Safe', description: 'All items protected, careful handling, trained team' },
              { icon: '📱', title: '24/7 Support', description: 'Customer support via WhatsApp, email, and phone' },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                variants={cardVariant}
                whileHover={{ y: -6 }}
                className="bg-[#F5F1ED] p-6 rounded-2xl text-center border border-gray-300
                  shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-700 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-16 md:py-20 bg-[#DC2626] text-white overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-400 opacity-5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-16 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Move?
          </h2>
          <p className="text-lg text-gray-100 mb-8">
            Get an instant quote now and book your move in minutes.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/booking')}
            className="inline-flex items-center gap-2 bg-yellow-400 text-[#1a1a1a] font-bold
              px-10 py-3 rounded-lg hover:bg-yellow-500 transition-colors text-base shadow-lg"
          >
            Get Free Quote <FiArrowRight size={18} />
          </motion.button>
        </motion.div>
      </section>
    </motion.div>
  );
}