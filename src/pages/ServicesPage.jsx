import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import api from '../api/api';

function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-gray-300 overflow-hidden animate-pulse">
      <div className="h-24 bg-gray-200" />
      <div className="p-6">
        <div className="h-6 bg-gray-100 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/2 mb-6" />
        <div className="space-y-2.5 mb-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-100 shrink-0" />
              <div className="h-3 bg-gray-100 rounded flex-1" />
            </div>
          ))}
        </div>
        <div className="h-10 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await api.get('/inventory/services');
        const data = res.data?.data;
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="w-full bg-[#F5F1ED]">

      {/* ── HEADER ── */}
      <section className="relative bg-[#DC2626] text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#DC2626] to-red-700" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400 opacity-5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-block text-xs font-bold tracking-[0.25em] text-yellow-400 uppercase mb-4">
            What We Offer
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Our Services
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-red-100 max-w-2xl mx-auto">
            From small furniture moves to complete house relocations, we've got you covered across the UK.
          </motion.p>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* Error state */}
          {!loading && error && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Could not load services. Please try again later.</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && services.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No services available yet.</p>
            </div>
          )}

          <motion.div
            variants={container}
            initial="hidden"
            animate={loading ? "hidden" : "visible"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loading
              ? Array(6).fill(0).map((_, i) => <ServiceCardSkeleton key={i} />)
              : services.map((service, idx) => {
                const allItems = service.items || [];
                const items = allItems.filter(it => !it.isPaused);
                const previewItems = items.slice(0, 4);
                const remaining = items.length - previewItems.length;

                return (
                  <motion.div
                    key={service._id}
                    variants={cardVariant}
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="group rounded-2xl overflow-hidden border border-gray-300 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    {/* Red gradient header */}
                    <div className="bg-linear-to-br from-[#DC2626] to-red-700 h-24 flex items-end p-6 relative overflow-hidden">
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                      <h3 className="text-white font-bold text-xl relative z-10 leading-tight">{service.label}</h3>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-sm text-gray-500 mb-4">{items.length} items available</p>

                      <ul className="space-y-2.5 mb-6 flex-1">
                        {previewItems.length > 0 ? (
                          <>
                            {previewItems.map((item) => (
                              <li key={item._id} className="flex items-start gap-2 text-sm">
                                <FiCheckCircle size={15} className="text-green-600 mt-0.5 shrink-0" />
                                <span className="text-gray-700 truncate">{item.name}</span>
                                <span className="ml-auto text-xs text-gray-400 shrink-0">{item.volume} m³</span>
                              </li>
                            ))}
                            {remaining > 0 && (
                              <li className="flex items-center gap-2 text-sm text-[#DC2626] font-semibold">
                                <FiCheckCircle size={15} className="text-[#DC2626] shrink-0" />
                                +{remaining} more items
                              </li>
                            )}
                          </>
                        ) : (
                          <li className="text-sm text-gray-400 italic">No items listed yet.</li>
                        )}
                      </ul>

                      <button
                        onClick={() => navigate('/booking', { state: { serviceType: service.slug } })}
                        className="w-full bg-[#DC2626] hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                      >
                        Get Quote
                        <FiArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            }
          </motion.div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center"
          >
            Why Choose Khan Moves?
          </motion.h2>
          <motion.div
            variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: '⚡', title: 'Fast & Reliable', description: 'Quick quotes, professional service, on-time delivery' },
              { icon: '💰', title: 'Fair Pricing', description: 'Transparent pricing, no hidden charges, competitive rates' },
              { icon: '🛡️', title: 'Insured & Safe', description: 'All items protected, careful handling, trained team' },
              { icon: '📱', title: '24/7 Support', description: 'Customer support via WhatsApp, email, and phone' },
            ].map((benefit, idx) => (
              <motion.div key={idx} variants={cardVariant} whileHover={{ y: -6 }}
                className="bg-[#F5F1ED] p-6 rounded-2xl text-center border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-16 md:py-20 bg-[#DC2626] text-white overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-400 opacity-5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-16 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Move?</h2>
          <p className="text-lg text-red-100 mb-8">Get an instant quote now and book your move in minutes.</p>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/booking')}
            className="inline-flex items-center gap-2 bg-yellow-400 text-[#1a1a1a] font-bold px-10 py-3 rounded-lg hover:bg-yellow-500 transition-colors text-base shadow-lg"
          >
            Get Free Quote <FiArrowRight size={18} />
          </motion.button>
        </motion.div>
      </section>
    </motion.div>
  );
}
