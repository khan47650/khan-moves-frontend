import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowRight, FiPhone, FiMapPin, FiClock, FiCheckCircle,
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import homeVan from '../assets/home_van.jpeg';
import { motion } from 'framer-motion';
import api from '../api/api';

// ── Service color themes ──────────────────────────────────────────────────────
const SERVICE_THEMES = [
  { bg: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-500', border: 'border-rose-200', num: 'text-rose-200' },
  { bg: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-500', border: 'border-violet-200', num: 'text-violet-200' },
  { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-200', num: 'text-amber-200' },
  { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-500', border: 'border-emerald-200', num: 'text-emerald-200' },
  { bg: 'bg-sky-500', light: 'bg-sky-50', text: 'text-sky-500', border: 'border-sky-200', num: 'text-sky-200' },
  { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-200', num: 'text-orange-200' },
  { bg: 'bg-pink-500', light: 'bg-pink-50', text: 'text-pink-500', border: 'border-pink-200', num: 'text-pink-200' },
  { bg: 'bg-teal-500', light: 'bg-teal-50', text: 'text-teal-500', border: 'border-teal-200', num: 'text-teal-200' },
];

const getTheme = (idx) => SERVICE_THEMES[idx % SERVICE_THEMES.length];

// ── Skeletons ─────────────────────────────────────────────────────────────────
function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 animate-pulse p-6">
      <div className="w-10 h-10 bg-gray-100 rounded-xl mb-4" />
      <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-6" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
    </div>
  );
}

function QuoteOptionSkeleton() {
  return (
    <div className="p-4 rounded-xl border-2 border-gray-100 bg-gray-50 animate-pulse h-16" />
  );
}

// ── Reviews data ──────────────────────────────────────────────────────────────
const reviews = [
  { name: 'Sarah Thompson', location: 'Birmingham', rating: 5, text: 'Brilliant service from start to finish. The team arrived on time and handled everything carefully.', service: 'Home Removal' },
  { name: 'James Patel', location: 'Manchester', rating: 5, text: 'Moved our entire office over a weekend with zero downtime. Professional and great value.', service: 'Office Move' },
  { name: 'Emma Wilson', location: 'Leeds', rating: 4, text: 'Quick to book. Got an instant quote and the driver was lovely. Highly recommend.', service: 'Furniture Move' },
  { name: 'David Okafor', location: 'London', rating: 5, text: 'Needed a sofa moved across the city. Fair price, super fast and handled with care.', service: 'Furniture Move' },
  { name: 'Aisha Khan', location: 'Glasgow', rating: 5, text: 'Sent a pallet of stock to Scotland with no stress. Tracking kept me updated throughout.', service: 'Pallets' },
  { name: 'Tom Bradley', location: 'Bristol', rating: 5, text: 'Booked boxes to be couriered same week. Arrived safe and well packaged.', service: 'Boxes & Parcels' },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await api.get('/inventory/services');
        const data = res.data.data;
        setServices(data);
        if (data.length > 0) setSelectedQuote(data[0].slug);
      } catch (err) {
        // silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const goToBooking = (slug) => navigate('/booking', { state: { serviceType: slug } });
  const selectedService = services.find(s => s.slug === selectedQuote);

  return (
    <div className="w-full bg-[#F5F1ED]">

      {/* ── HERO ── */}
      <section className="relative text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${homeVan})` }} />
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20" />
        <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-2xl pt-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <p className="text-sm font-semibold tracking-widest text-gray-300 uppercase mb-6">UK Moving Service</p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                Moving made <span className="text-[#DC2626]">simple</span>
              </h1>
              <p className="text-lg text-gray-200 mb-10 leading-relaxed max-w-xl">
                Homes, offices, furniture & more — anywhere in the UK. Instant quotes, professional movers, zero hassle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={() => navigate('/booking')}
                  className="bg-[#DC2626] hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition flex items-center justify-center gap-2">
                  Get Free Quote <FiArrowRight size={18} />
                </button>
                <a href="tel:07424153126"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg transition border border-white/20 flex items-center justify-center gap-2">
                  <FiPhone size={18} /> 07424153126
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVICES CARDS ── */}
      <section className="py-16 md:py-20 bg-[#F5F1ED]">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-4">Services</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What We Can Move</h2>
            <p className="text-gray-700 text-lg max-w-2xl">
              From full house moves to single items — we handle all types of removals with the same care and professionalism.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array(6).fill(0).map((_, i) => <ServiceCardSkeleton key={i} />)
              : services.map((service, idx) => {
                const theme = getTheme(idx);
                return (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    onClick={() => goToBooking(service.slug)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && goToBooking(service.slug)}
                    className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer p-6 flex flex-col"
                  >
                    {/* Big number watermark */}
                    <span className={`absolute top-4 right-5 text-7xl font-black ${theme.num} select-none pointer-events-none leading-none`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    {/* Color dot */}
                    <div className={`w-11 h-11 rounded-xl ${theme.bg} flex items-center justify-center mb-5 shrink-0`}>
                      <div className="w-3 h-3 rounded-full bg-white/70" />
                    </div>

                    <h3 className="font-bold text-xl text-gray-900 mb-1.5 relative z-10">{service.label}</h3>
                    <p className={`text-sm font-semibold ${theme.text} mb-6`}>
                      {service.items?.length || 0} items available
                    </p>

                    <div className="mt-auto flex items-center gap-2">
                      <span className={`text-sm font-bold ${theme.text} group-hover:gap-3 transition-all flex items-center gap-1.5`}>
                        Get quote <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>

                    {/* Bottom accent bar */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${theme.bg} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                  </motion.div>
                );
              })
            }
          </div>
        </div>
      </section>

      {/* ── QUICK QUOTE ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-4">Start Your Move</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Quick Quote</h2>
            <p className="text-gray-700 text-lg mt-3 max-w-2xl">
              Select your service type and proceed to get an instant, transparent quote with no hidden charges.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left: Service list */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h3 className="text-xl font-bold text-gray-900 mb-5">What service do you need?</h3>
              <div className="space-y-2.5">
                {loading
                  ? Array(5).fill(0).map((_, i) => <QuoteOptionSkeleton key={i} />)
                  : services.map((service, idx) => {
                    const theme = getTheme(idx);
                    const isSelected = selectedQuote === service.slug;
                    return (
                      <button
                        key={service._id}
                        onClick={() => setSelectedQuote(service.slug)}
                        className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl border-2 transition-all duration-200 text-left
                                                    ${isSelected
                            ? `${theme.light} ${theme.border} shadow-sm`
                            : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                          }`}
                      >
                        {/* Color indicator */}
                        <div className={`w-2 h-8 rounded-full shrink-0 transition-all ${isSelected ? theme.bg : 'bg-gray-200'}`} />
                        <span className={`font-semibold text-sm transition-colors ${isSelected ? theme.text : 'text-gray-600'}`}>
                          {service.label}
                        </span>
                        <span className={`ml-auto text-xs font-medium transition-colors ${isSelected ? theme.text : 'text-gray-400'}`}>
                          {service.items?.length || 0} items
                        </span>
                        {isSelected && (
                          <FiCheckCircle size={16} className={theme.text} />
                        )}
                      </button>
                    );
                  })
                }
              </div>
            </motion.div>

            {/* Right: CTA */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex flex-col justify-center">
              <div className="bg-[#DC2626] rounded-2xl p-8 text-white shadow-xl">
                {loading ? (
                  <div className="animate-pulse space-y-3 mb-8">
                    <div className="h-3 bg-white/20 rounded w-1/3" />
                    <div className="h-7 bg-white/20 rounded w-2/3" />
                    <div className="h-3 bg-white/20 rounded w-1/2" />
                  </div>
                ) : (
                  <div className="mb-8">
                    <p className="text-white/70 text-sm font-medium mb-1">Your Selection</p>
                    <h4 className="text-3xl font-bold">{selectedService?.label || '—'}</h4>
                    <p className="text-white/60 text-sm mt-1">
                      {selectedService?.items?.length || 0} items available
                    </p>
                  </div>
                )}

                <div className="space-y-3 mb-8 p-5 bg-white/10 rounded-xl">
                  {['Instant quote in seconds', 'No hidden charges', 'Professional movers'].map(text => (
                    <div key={text} className="flex items-center gap-3">
                      <FiCheckCircle size={16} className="text-white/80 shrink-0" />
                      <p className="text-sm text-white/90">{text}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => goToBooking(selectedQuote)}
                  disabled={!selectedQuote}
                  className="w-full bg-white text-[#DC2626] font-bold py-4 rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 text-lg disabled:opacity-60"
                >
                  Get Quote <FiArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST SIGNALS ── */}
      <section className="py-16 md:py-20 bg-[#F5F1ED]">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FiMapPin, title: 'UK-Wide Coverage', desc: 'England, Scotland, Wales — we move anywhere across the UK' },
              { icon: FiClock, title: 'Instant Quote', desc: 'No waiting — get your price instantly with our smart calculator' },
              { icon: FiCheckCircle, title: 'Trusted & Safe', desc: 'Based in Birmingham with years of experience in removals' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center">
                      <Icon size={26} className="text-[#DC2626]" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-4">Reviews</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <div className="flex items-center justify-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => <FaStar key={i} size={20} className="text-yellow-400" />)}
              </div>
              <span className="text-gray-800 font-semibold text-sm">4.8/5 · 2,300+ reviews</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#F5F1ED] p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={14} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <p className="text-gray-800 text-sm leading-relaxed mb-4 flex-1">{review.text}</p>
                <div className="pt-4 border-t border-gray-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#DC2626] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.location} · {review.service}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16 md:py-20 bg-[#DC2626] text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Move?</h2>
            <p className="text-lg text-red-100 mb-10 max-w-2xl mx-auto">
              Get your instant quote now. No hidden charges, transparent pricing, professional service.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigate('/booking')}
                className="bg-white text-[#DC2626] hover:bg-gray-100 font-semibold px-10 py-3 rounded-lg transition flex items-center justify-center gap-2">
                Get Free Quote <FiArrowRight size={18} />
              </button>
              <a href="tel:07424153126"
                className="bg-red-700 hover:bg-red-800 text-white font-semibold px-10 py-3 rounded-lg transition border border-red-500 flex items-center justify-center gap-2">
                <FiPhone size={18} /> Call 07424153126
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
