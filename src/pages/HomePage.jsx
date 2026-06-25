// HomePage.jsx - COMPLETE

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
import { FaBuilding, FaCouch, FaStar } from 'react-icons/fa';
import homeVan from '../assets/home_van.jpeg';
import { motion } from 'framer-motion';
import QuoteServiceDropDown from '../components/QuoteServiceDropDown';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedQuote, setSelectedQuote] = useState('home');

  const goToBooking = (serviceType) =>
    navigate('/booking', { state: { serviceType } });

  const services = [
    {
      id: 1, slug: 'home', icon: FiHome, title: 'Home Removal', description: 'Full house moves',
      image: 'https://images.unsplash.com/photo-1614359835514-92f8ba196357?auto=format&fit=crop&w=800&q=70'
    },
    {
      id: 2, slug: 'office', icon: FaBuilding, title: 'Office Move', description: 'Business relocation',
      image: 'https://images.unsplash.com/photo-1522444195799-478538b28823?auto=format&fit=crop&w=800&q=70'
    },
    {
      id: 3, slug: 'furniture', icon: FaCouch, title: 'Furniture Move', description: 'Single items',
      image: 'https://images.unsplash.com/photo-1730154838368-c37b1fdebcf6?auto=format&fit=crop&w=800&q=70'
    },
    {
      id: 4, slug: 'parcels', icon: FiPackage, title: 'Boxes & Parcels', description: 'Safe delivery',
      image: 'https://images.unsplash.com/photo-1647702504702-6b3dc40eafe5?auto=format&fit=crop&w=800&q=70'
    },
    {
      id: 5, slug: 'vehicle', icon: FiTruck, title: 'Vehicle Parts', description: 'Parts & items',
      image: 'https://images.unsplash.com/photo-1614359835514-92f8ba196357?auto=format&fit=crop&w=800&q=70'
    },
    {
      id: 6, slug: 'pallets', icon: FiPackage, title: 'Pallets', description: 'Heavy transport',
      image: 'https://images.unsplash.com/photo-1647702504702-6b3dc40eafe5?auto=format&fit=crop&w=800&q=70'
    },
  ];

  const quoteOptions = [
    { slug: 'home', icon: FiHome, title: 'Home Removal', description: 'Full house moves' },
    { slug: 'office', icon: FaBuilding, title: 'Office Move', description: 'Business relocation' },
    { slug: 'furniture', icon: FaCouch, title: 'Furniture Move', description: 'Single items' },
    { slug: 'parcels', icon: FiPackage, title: 'Boxes & Parcels', description: 'Safe delivery' },
    { slug: 'vehicle', icon: FiTruck, title: 'Vehicle Parts', description: 'Parts & items' },
    { slug: 'pallets', icon: FiPackage, title: 'Pallets', description: 'Heavy transport' },
  ];

  const reviews = [
    {
      name: 'Sarah Thompson',
      location: 'Birmingham',
      rating: 5,
      text: 'Brilliant service from start to finish. The team arrived on time and handled everything carefully.',
      service: 'Home Removal',
    },
    {
      name: 'James Patel',
      location: 'Manchester',
      rating: 5,
      text: 'Moved our entire office over a weekend with zero downtime. Professional and great value.',
      service: 'Office Move',
    },
    {
      name: 'Emma Wilson',
      location: 'Leeds',
      rating: 4,
      text: 'Quick to book. Got an instant quote and the driver was lovely. Highly recommend.',
      service: 'Furniture Move',
    },
    {
      name: 'David Okafor',
      location: 'London',
      rating: 5,
      text: 'Needed a sofa moved across the city. Fair price, super fast and handled with care.',
      service: 'Furniture Move',
    },
    {
      name: 'Aisha Khan',
      location: 'Glasgow',
      rating: 5,
      text: 'Sent a pallet of stock to Scotland with no stress. Tracking kept me updated throughout.',
      service: 'Pallets',
    },
    {
      name: 'Tom Bradley',
      location: 'Bristol',
      rating: 5,
      text: 'Booked boxes to be couriered same week. Arrived safe and well packaged.',
      service: 'Boxes & Parcels',
    },
  ];

  return (
    <div className="w-full bg-[#F5F1ED]">


      {/* HERO SECTION */}
      <section className="relative text-white py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${homeVan})` }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20"></div>

        <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-2xl pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm font-semibold tracking-widest text-gray-300 uppercase mb-6">
                UK Moving Service
              </p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                Moving made <span className="text-[#DC2626]">simple</span>
              </h1>
              <p className="text-lg text-gray-200 mb-10 leading-relaxed max-w-xl">
                Homes, offices, furniture & more — anywhere in the UK. Instant quotes, professional movers, zero hassle.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => navigate('/booking')}
                  className="bg-[#DC2626] hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  Get Free Quote <FiArrowRight size={18} />
                </button>


                <a href="tel:01215556666"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg transition border border-white/20 flex items-center justify-center gap-2"
                >
                  <FiPhone size={18} /> 0121 555 6666
                </a>
              </div>
            </motion.div>
          </div>
        </div >
      </section >

      {/* SERVICES SECTION */}
      < section className="py-16 md:py-20 bg-[#F5F1ED]" >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-4">
              Services
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What We Can Move
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl">
              From full house moves to single items — we handle all types of removals with the same care and professionalism.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onClick={() => goToBooking(service.slug)}
                  onKeyDown={(e) => e.key === 'Enter' && goToBooking(service.slug)}
                  role="button"
                  tabIndex={0}
                  className="group rounded-xl overflow-hidden bg-white border border-gray-300 hover:border-gray-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="h-40 overflow-hidden bg-gray-200">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <Icon size={24} className="text-[#DC2626] mb-3" />
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-[#DC2626] font-semibold text-sm group-hover:gap-3 transition-all">
                      Get quote <FiArrowRight size={16} />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section >

      {/* INSTANT QUOTE */}
      < section className="py-16 md:py-20 bg-white" >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-4">
              Start Your Move
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Quick Quote
            </h2>
            <p className="text-gray-700 text-lg mt-3 max-w-2xl">
              Select your service type and proceed to get an instant, transparent quote with no hidden charges.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left: Service Grid */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">What service do you need?</h3>

              <div className="grid grid-cols-2 gap-4">
                {quoteOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedQuote === option.slug;

                  return (
                    <motion.button
                      key={option.slug}
                      onClick={() => setSelectedQuote(option.slug)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${isSelected
                        ? 'border-[#DC2626] bg-red-50 shadow-lg'
                        : 'border-gray-300 bg-[#F5F1ED] hover:border-gray-400'
                        }`}
                    >
                      <Icon size={24} className={`mb-2 ${isSelected ? 'text-[#DC2626]' : 'text-gray-700'}`} />
                      <p className={`font-semibold text-sm ${isSelected ? 'text-[#DC2626]' : 'text-gray-900'}`}>
                        {option.title}
                      </p>
                      <p className={`text-xs mt-1 ${isSelected ? 'text-red-600' : 'text-gray-600'}`}>
                        {option.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Right: CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <div className="bg-[#DC2626] rounded-2xl p-8 text-white shadow-xl">
                <div className="mb-8">
                  <p className="text-white/80 text-sm font-medium mb-2">Your Selection</p>
                  <h4 className="text-3xl font-bold">
                    {quoteOptions.find(q => q.slug === selectedQuote)?.title}
                  </h4>
                  <p className="text-white/70 text-sm mt-2">
                    {quoteOptions.find(q => q.slug === selectedQuote)?.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <FiCheckCircle size={20} className="text-white" />
                    </div>
                    <p className="text-sm text-white/90">Instant quote in seconds</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <FiCheckCircle size={20} className="text-white" />
                    </div>
                    <p className="text-sm text-white/90">No hidden charges</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <FiCheckCircle size={20} className="text-white" />
                    </div>
                    <p className="text-sm text-white/90">Professional movers</p>
                  </div>
                </div>

                <button
                  onClick={() => goToBooking(selectedQuote)}
                  className="w-full bg-white text-[#DC2626] font-bold py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                >
                  Get Quote <FiArrowRight size={20} />
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section >

      {/* TRUST SIGNALS */}
      < section className="py-16 md:py-20 bg-[#F5F1ED]" >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FiMapPin,
                title: 'UK-Wide Coverage',
                desc: 'England, Scotland, Wales — we move anywhere across the UK'
              },
              {
                icon: FiClock,
                title: 'Instant Quote',
                desc: 'No waiting — get your price instantly with our smart calculator'
              },
              {
                icon: FiCheckCircle,
                title: 'Trusted & Safe',
                desc: 'Based in Birmingham with years of experience in removals'
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 bg-red-50 rounded-lg flex items-center justify-center">
                      <Icon size={28} className="text-[#DC2626]" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section >

      {/* REVIEWS */}
      < section className="py-16 md:py-20 bg-white" >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-4">
              Reviews
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={20} className="text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-800 font-semibold text-sm">
                4.8/5 · 2,300+ reviews
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#F5F1ED] p-6 rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={14}
                      className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>

                <p className="text-gray-800 text-sm leading-relaxed mb-4 flex-1">
                  {review.text}
                </p>

                <div className="pt-4 border-t border-gray-300 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#DC2626] text-white flex items-center justify-center font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-600">
                      {review.location} • {review.service}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* Final CTA */}
      < section className="py-16 md:py-20 bg-[#DC2626] text-white" >
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Move?</h2>
            <p className="text-lg text-red-100 mb-10 max-w-2xl mx-auto">
              Get your instant quote now. No hidden charges, transparent pricing, professional service.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/booking')}
                className="bg-white text-[#DC2626] hover:bg-gray-100 font-semibold px-10 py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                Get Free Quote <FiArrowRight size={18} />
              </button>


              <a href="tel:01215556666"
                className="bg-red-700 hover:bg-red-800 text-white font-semibold px-10 py-3 rounded-lg transition border border-red-500 flex items-center justify-center gap-2"
              >
                <FiPhone size={18} /> Call 0121 555 6666
              </a>
            </div>
          </motion.div >
        </div >
      </section >
    </div >
  );
}