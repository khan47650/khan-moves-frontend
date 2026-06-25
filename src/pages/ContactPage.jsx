import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiClock, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  const itemVariant = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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
            We're Here to Help
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          >
            Get in Touch
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-100 max-w-2xl mx-auto"
          >
            Have questions? We'd love to hear from you. Contact us anytime.
          </motion.p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="py-16 md:py-20 bg-[#F5F1ED]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left: Contact Info */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.h2 variants={itemVariant} className="text-2xl font-bold text-gray-900 mb-8">
                Contact Information
              </motion.h2>

              {/* Phone */}
              <motion.div
                variants={itemVariant}
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mb-8 flex items-start gap-4 group"
              >
                <div className="bg-[#DC2626] p-3 rounded-xl shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <FiPhone size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                  <a href="tel:01215556666" className="text-[#DC2626] font-semibold hover:underline">
                    0121 555 6666
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Mon-Sun: 08:00 - 20:00 (UK Time)</p>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                variants={itemVariant}
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mb-8 flex items-start gap-4 group"
              >
                <div className="bg-yellow-400 p-3 rounded-xl shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <FiMail size={24} className="text-gray-900" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <a
                    href="mailto:info@khanmoves.co.uk"
                    className="text-[#DC2626] font-semibold hover:underline break-all"
                  >
                    info@khanmoves.co.uk
                  </a>
                  <p className="text-sm text-gray-600 mt-1">We reply within 2 hours</p>
                </div>
              </motion.div>

              {/* Address */}
              <motion.div
                variants={itemVariant}
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mb-8 flex items-start gap-4 group"
              >
                <div className="bg-red-100 p-3 rounded-xl shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <FiMapPin size={24} className="text-[#DC2626]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-700">
                    Khan Moves Limited
                    <br />
                    Birmingham, UK
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Operating nationwide across UK</p>
                </div>
              </motion.div>

              {/* Hours */}
              <motion.div
                variants={itemVariant}
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-start gap-4 group"
              >
                <div className="bg-red-50 p-3 rounded-xl shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <FiClock size={24} className="text-[#DC2626]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Business Hours</h3>
                  <p className="text-gray-700 text-sm">
                    Monday - Sunday
                    <br />
                    08:00 AM - 20:00 PM (UK Time)
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="lg:col-span-2"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  className="bg-green-50 border-2 border-green-300 rounded-2xl p-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  >
                    <FiCheckCircle size={56} className="text-green-600 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-green-700 mb-2">Message Sent!</h3>
                  <p className="text-green-700">
                    Thanks for reaching out. We'll get back to you soon!
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 bg-white p-8 rounded-2xl border border-gray-300 shadow-md"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0121 555 6666"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help?"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent resize-none transition"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full bg-[#DC2626] hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <FiArrowRight size={18} />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-linear-to-br from-gray-200 to-gray-300 rounded-2xl h-80 flex items-center justify-center overflow-hidden relative border border-gray-400"
          >
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#DC2626] opacity-5 rounded-full blur-3xl" />
            <div className="text-center relative z-10">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FiMapPin size={48} className="text-[#DC2626] mx-auto mb-3" />
              </motion.div>
              <p className="text-gray-800 font-semibold">
                Located in Birmingham, Operating Nationwide
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}