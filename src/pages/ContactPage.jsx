import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiClock,
  FiMail,
  FiMapPin,
  FiPhone
} from "react-icons/fi";
import CompanyMap from "../components/shared/CompanyMap";
import { openContactWhatsApp } from "../utils/contactWhatsApp";

const COMPANY = {
  name: "Khan Moves Limited",
  phone: "07424 153126",
  phoneLink: "07424153126",
  email: "khanmovesuk@gmail.com",
  address: [
    "265 Golden Hillock Road",
    "Sparkbrook, Birmingham",
    "England, B11 2PH"
  ]
};

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
};

export default function ContactPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleInputChange = event => {
    const { name, value } = event.target;

    setFormData(current => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();

    try {
      setLoading(true);

      openContactWhatsApp(formData);

      setFormData(initialFormData);
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 40
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const container = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: {
      opacity: 0,
      x: -30
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#F5F1ED]"
    >
      {/* Header */}
      <section className="relative overflow-hidden bg-[#DC2626] py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-linear-to-br from-[#DC2626] to-red-700" />

        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-yellow-400 opacity-5 blur-3xl" />

        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white opacity-5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <motion.span
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5
            }}
            className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.25em] text-yellow-400"
          >
            We&apos;re Here to Help
          </motion.span>

          <motion.h1
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.1
            }}
            className="mb-4 text-4xl font-bold leading-tight md:text-5xl"
          >
            Get in Touch
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.2
            }}
            className="mx-auto max-w-2xl text-lg text-gray-100"
          >
            Have questions about your move? Contact our team and we
            will be happy to help.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-[#F5F1ED] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Contact Information */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2
              }}
            >
              <motion.h2
                variants={itemVariant}
                className="mb-8 text-2xl font-bold text-gray-900"
              >
                Contact Information
              </motion.h2>

              {/* Phone */}
              <motion.div
                variants={itemVariant}
                whileHover={{ x: 6 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="group mb-8 flex items-start gap-4"
              >
                <div className="shrink-0 rounded-xl bg-[#DC2626] p-3 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <FiPhone
                    size={24}
                    className="text-white"
                  />
                </div>

                <div>
                  <h3 className="mb-1 font-bold text-gray-900">
                    Call Us
                  </h3>

                  <a
                    href={`tel:${COMPANY.phoneLink}`}
                    className="font-semibold text-[#DC2626] hover:underline"
                  >
                    {COMPANY.phone}
                  </a>

                  <p className="mt-1 text-sm text-gray-600">
                    Monday - Sunday: 08:00 - 20:00 UK time
                  </p>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                variants={itemVariant}
                whileHover={{ x: 6 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="group mb-8 flex items-start gap-4"
              >
                <div className="shrink-0 rounded-xl bg-yellow-400 p-3 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <FiMail
                    size={24}
                    className="text-gray-900"
                  />
                </div>

                <div>
                  <h3 className="mb-1 font-bold text-gray-900">
                    Email
                  </h3>

                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="break-all font-semibold text-[#DC2626] hover:underline"
                  >
                    {COMPANY.email}
                  </a>

                  <p className="mt-1 text-sm text-gray-600">
                    We aim to respond as quickly as possible
                  </p>
                </div>
              </motion.div>

              {/* Address */}
              <motion.div
                variants={itemVariant}
                whileHover={{ x: 6 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="group mb-8 flex items-start gap-4"
              >
                <div className="shrink-0 rounded-xl bg-red-100 p-3 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <FiMapPin
                    size={24}
                    className="text-[#DC2626]"
                  />
                </div>

                <div>
                  <h3 className="mb-1 font-bold text-gray-900">
                    Address
                  </h3>

                  <p className="text-gray-700">
                    {COMPANY.name}
                    <br />
                    {COMPANY.address[0]}
                    <br />
                    {COMPANY.address[1]}
                    <br />
                    {COMPANY.address[2]}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Operating nationwide across the UK
                  </p>
                </div>
              </motion.div>

              {/* Business Hours */}
              <motion.div
                variants={itemVariant}
                whileHover={{ x: 6 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="group flex items-start gap-4"
              >
                <div className="shrink-0 rounded-xl bg-red-50 p-3 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <FiClock
                    size={24}
                    className="text-[#DC2626]"
                  />
                </div>

                <div>
                  <h3 className="mb-1 font-bold text-gray-900">
                    Business Hours
                  </h3>

                  <p className="text-sm text-gray-700">
                    Monday - Sunday
                    <br />
                    08:00 AM - 08:00 PM UK time
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15
              }}
              className="lg:col-span-2"
            >
              <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-2xl border border-gray-300 bg-white p-8 shadow-md"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#DC2626]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#DC2626]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="07123 456789"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#DC2626]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help?"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#DC2626]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Message
                  </label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your enquiry..."
                    required
                    rows={5}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#DC2626]"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{
                    scale: loading ? 1 : 1.02
                  }}
                  whileTap={{
                    scale: loading ? 1 : 0.98
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 font-bold text-white transition-colors hover:bg-[#1ebe5d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Opening WhatsApp...
                    </>
                  ) : (
                    <>
                      Send via WhatsApp
                      <FiArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15
            }}
          >
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#DC2626]">
                Our Location
              </span>

              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                Find Khan Moves
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                View our Birmingham location or open directions
                from your current position.
              </p>
            </div>

            <CompanyMap />
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}