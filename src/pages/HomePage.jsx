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
  FiChevronDown,
} from 'react-icons/fi';
import { FaBuilding, FaCouch, FaStar, FaQuoteLeft } from 'react-icons/fa';
import homeVan from '../assets/home_van.jpeg';
import { motion } from 'framer-motion';
import QuoteServiceDropDown from '../components/QuoteServiceDropdown';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedQuote, setSelectedQuote] = useState('home');

  const goToBooking = (serviceType) =>
    navigate('/booking', { state: { serviceType } });

  const services = [
    {
      id: 1, slug: 'home', icon: FiHome, title: 'Home Removal', description: 'Full house moves across UK',
      image: 'https://images.unsplash.com/photo-1614359835514-92f8ba196357?auto=format&fit=crop&w=800&q=70', accent: true
    },
    {
      id: 2, slug: 'office', icon: FaBuilding, title: 'Office Move', description: 'Business relocation service',
      image: 'https://images.unsplash.com/photo-1522444195799-478538b28823?auto=format&fit=crop&w=800&q=70', accent: true
    },
    {
      id: 3, slug: 'furniture', icon: FaCouch, title: 'Furniture Move', description: 'Single items & collections',
      image: 'https://images.unsplash.com/photo-1730154838368-c37b1fdebcf6?auto=format&fit=crop&w=800&q=70', accent: false
    },
    {
      id: 4, slug: 'parcels', icon: FiPackage, title: 'Boxes & Parcels', description: 'Safe courier delivery',
      image: 'https://images.unsplash.com/photo-1647702504702-6b3dc40eafe5?auto=format&fit=crop&w=800&q=70', accent: false
    },
    {
      id: 5, slug: 'vehicle', icon: FiTruck, title: 'Vehicle Parts', description: 'Parts & single items',
      image: 'https://images.unsplash.com/photo-1614359835514-92f8ba196357?auto=format&fit=crop&w=800&q=70', accent: false
    },
    {
      id: 6, slug: 'pallets', icon: FiPackage, title: 'Pallets', description: 'Heavy pallet transport',
      image: 'https://images.unsplash.com/photo-1647702504702-6b3dc40eafe5?auto=format&fit=crop&w=800&q=70', accent: false
    },
  ];

  const quoteOptions = [
    { slug: 'home', icon: FiHome, title: 'Home Removal', description: 'Full house moves across UK' },
    { slug: 'office', icon: FaBuilding, title: 'Office Move', description: 'Business relocation service' },
    { slug: 'furniture', icon: FaCouch, title: 'Furniture Move', description: 'Single items & collections' },
    { slug: 'parcels', icon: FiPackage, title: 'Boxes & Parcels', description: 'Safe courier delivery' },
    { slug: 'vehicle', icon: FiTruck, title: 'Vehicle Parts', description: 'Parts & single items' },
    { slug: 'pallets', icon: FiPackage, title: 'Pallets', description: 'Heavy pallet transport' },
  ];

  // Dummy reviews (AnyVan / Trustpilot style)
  const reviews = [
    {
      name: 'Sarah Thompson',
      location: 'Birmingham',
      date: '12 May 2026',
      rating: 5,
      text: 'Brilliant service from start to finish. The team arrived on time, wrapped everything carefully and nothing was damaged. Would 100% use Khan Moves again.',
      service: 'Home Removal',
    },
    {
      name: 'James Patel',
      location: 'Manchester',
      date: '28 Apr 2026',
      rating: 5,
      text: 'Moved our entire office over a weekend with zero downtime. Professional, friendly and great value. Highly recommended.',
      service: 'Office Move',
    },
    {
      name: 'Emma Wilson',
      location: 'Leeds',
      date: '15 Apr 2026',
      rating: 4,
      text: 'Quick and easy to book. Got an instant quote online and the driver was lovely. Slight delay but they called ahead to let me know.',
      service: 'Furniture Move',
    },
    {
      name: 'David Okafor',
      location: 'London',
      date: '02 Apr 2026',
      rating: 5,
      text: 'Needed a single sofa moved across the city. Fair price, super fast and handled with care. Couldn’t ask for more.',
      service: 'Furniture Move',
    },
    {
      name: 'Aisha Khan',
      location: 'Glasgow',
      date: '21 Mar 2026',
      rating: 5,
      text: 'Sent a pallet of stock up to Scotland with no stress at all. Tracking kept me updated the whole way. Top class.',
      service: 'Pallets',
    },
    {
      name: 'Tom Bradley',
      location: 'Bristol',
      date: '08 Mar 2026',
      rating: 5,
      text: 'Booked some boxes to be couriered same week. Arrived safe and well packaged. The quote was honest with no hidden fees.',
      service: 'Boxes & Parcels',
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full"
    >
      {/* HERO SECTION */}
      <motion.section
        className="relative text-white py-12 md:py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${homeVan})` }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/45"></div>
        <div className="absolute inset-0 bg-[#C0392B]/25 mix-blend-multiply"></div>
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

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/booking')}
                className="bg-[#F1C40F] text-[#1a1a1a] font-bold px-8 py-3 rounded-lg hover:bg-yellow-300 transition flex items-center justify-center gap-2 text-base"
              >
                Get a Free Quote <FiArrowRight size={18} />
              </button>

              <a href="tel:01215556666"
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
        className="py-12 md:py-16 bg-white"
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

          {/* Services Grid (image cards — click karne par booking start) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  onClick={() => goToBooking(service.slug)}
                  onKeyDown={(e) => e.key === 'Enter' && goToBooking(service.slug)}
                  role="button"
                  tabIndex={0}
                  className="group rounded-lg border border-[#C0392B] border-t-4 bg-white overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <Icon size={28} className="text-[#C0392B]" />
                    <h3 className="font-bold text-base mt-4 text-[#1a1a1a]">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                    <span className="inline-flex items-center gap-1 text-[#C0392B] font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                      Get a quote <FiArrowRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-2 text-[#C0392B] font-bold hover:text-red-700 transition group"
            >
              View All Services
              <FiArrowRight size={18} className="group-hover:translate-x-1 transition" />
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

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="bg-[#C0392B] px-6 py-4 rounded-t-lg">
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
                <span className="text-white text-xs ml-3">Step 1 of 5 — Service Type</span>
              </div>
            </div>

            <div className="p-8">
              <h3 className="font-bold text-xl text-[#1a1a1a] mb-6">What are you moving?</h3>

              <QuoteServiceDropdown
                options={quoteOptions}
                value={selectedQuote}
                onChange={setSelectedQuote}
              />

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => goToBooking(selectedQuote)}
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
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition">
              <FiMapPin size={32} className="text-[#C0392B] mx-auto mb-4" />
              <h3 className="font-bold text-lg text-[#1a1a1a] mb-2">UK-Wide Coverage</h3>
              <p className="text-gray-600 text-sm">
                England, Scotland, Wales — we move anywhere across the UK
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition">
              <FiClock size={32} className="text-[#F1C40F] mx-auto mb-4" />
              <h3 className="font-bold text-lg text-[#1a1a1a] mb-2">Instant Quote</h3>
              <p className="text-gray-600 text-sm">
                No waiting, get your price instantly with our smart calculator
              </p>
            </div>
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

      {/* CUSTOMER REVIEWS (AnyVan style) */}
      <motion.section
        className="py-12 md:py-16 bg-gray-50"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest text-[#C0392B] uppercase mb-3 block">
              Reviews
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3">
              Rated Excellent by Our Customers
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={22} className="text-[#00b67a]" />
                ))}
              </div>
              <span className="text-gray-700 font-semibold ml-2">
                4.8 out of 5 · based on 2,300+ reviews
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={16}
                        className={i < review.rating ? 'text-[#00b67a]' : 'text-gray-200'}
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                    <FiCheckCircle size={13} /> Verified
                  </span>
                </div>

                <FaQuoteLeft size={18} className="text-gray-200 mb-2" />
                <p className="text-gray-700 text-sm leading-relaxed grow">{review.text}</p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C0392B] text-white flex items-center justify-center font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1a1a1a]">{review.name}</p>
                    <p className="text-xs text-gray-500">
                      {review.location} · {review.service} · {review.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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

            <a href="tel:01215556666"
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