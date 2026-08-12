import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiMail,
  FiPhone
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function TermsPage() {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-[#F5F1ED]"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#DC2626] py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-linear-to-br from-[#DC2626] to-red-700" />

        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-yellow-400 opacity-5 blur-3xl" />

        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white opacity-5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#DC2626] active:scale-95"
          >
            <FiArrowLeft size={18} />
            Back
          </button>

          <div className="text-center">
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
              Legal Information
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
              Terms & Conditions
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
              className="mx-auto max-w-2xl text-lg text-red-100"
            >
              Please read these terms carefully before using Khan Moves
              Limited services or submitting a booking.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
            <SectionTitle number="1" title="Introduction" />

            <p className="mb-6 leading-7 text-gray-700">
              These Terms & Conditions ("Terms") govern your use of the
              Khan Moves Limited website and booking service. By using
              our service, you agree to be bound by these Terms.
            </p>

            <SectionTitle
              number="2"
              title="Service Description"
            />

            <p className="mb-4 leading-7 text-gray-700">
              Khan Moves Limited provides removals and relocation
              services including:
            </p>

            <ul className="mb-6 list-inside list-disc space-y-2 text-gray-700">
              <li>Home removals</li>
              <li>Office relocations</li>
              <li>Furniture moves</li>
              <li>Courier services</li>
              <li>Pallet and bulk transport</li>
            </ul>

            <SectionTitle
              number="3"
              title="Booking and Quotation"
            />

            <p className="mb-4 leading-7 text-gray-700">
              <strong>3.1 Quotations:</strong> All quotes provided
              through our website are estimates based on information
              provided by the customer. Final pricing may vary
              depending on actual job complexity, distance and
              accessibility.
            </p>

            <p className="mb-4 leading-7 text-gray-700">
              <strong>3.2 Booking Request:</strong> Submitting a
              booking request does not constitute a binding contract.
              Your booking will only be confirmed once accepted by
              Khan Moves Limited and payment is received.
            </p>

            <p className="mb-6 leading-7 text-gray-700">
              <strong>3.3 Booking Reference:</strong> You will receive
              a unique booking reference number upon submission. This
              reference must be quoted in all communication regarding
              your booking.
            </p>

            <SectionTitle
              number="4"
              title="Payment Terms"
            />

            <p className="mb-4 leading-7 text-gray-700">
              <strong>4.1 Payment Method:</strong> We accept payment
              via bank transfer. Payment details will be provided in
              your invoice.
            </p>

            <p className="mb-4 leading-7 text-gray-700">
              <strong>4.2 Payment Timing:</strong> Payment must be
              received before the scheduled moving date unless
              alternative arrangements have been agreed in writing.
            </p>

            <p className="mb-6 leading-7 text-gray-700">
              <strong>4.3 Late Payment:</strong> If payment is not
              received by the due date, Khan Moves Limited reserves
              the right to reschedule or cancel your booking.
            </p>

            <SectionTitle
              number="5"
              title="Cancellation and Rescheduling"
            />

            <p className="mb-4 leading-7 text-gray-700">
              <strong>5.1 Cancellation Policy:</strong>
            </p>

            <ul className="mb-6 list-inside list-disc space-y-2 text-gray-700">
              <li>
                Cancelled more than 14 days before: Full refund
              </li>

              <li>
                Cancelled 7-14 days before: 50% refund
              </li>

              <li>
                Cancelled less than 7 days before: No refund
              </li>
            </ul>

            <p className="mb-6 leading-7 text-gray-700">
              <strong>5.2 Rescheduling:</strong> You may reschedule
              your booking for a fee of £15. Rescheduling requests
              must be made at least 48 hours before your scheduled
              moving date.
            </p>

            <SectionTitle
              number="6"
              title="Liability and Insurance"
            />

            <p className="mb-4 leading-7 text-gray-700">
              <strong>6.1 Insurance:</strong> Khan Moves Limited
              carries standard insurance for removals. Items are
              transported at the customer's risk unless specifically
              insured otherwise.
            </p>

            <p className="mb-4 leading-7 text-gray-700">
              <strong>6.2 Liability:</strong> Khan Moves Limited's
              liability is limited to the amount paid for the service.
              We are not responsible for loss, damage or theft of items
              not directly caused by our negligence.
            </p>

            <p className="mb-6 leading-7 text-gray-700">
              <strong>6.3 Fragile Items:</strong> Customers must
              clearly indicate fragile, valuable or special items.
              Adequate packaging is essential. Khan Moves Limited is
              not responsible for damage to inadequately packaged
              items.
            </p>

            <SectionTitle
              number="7"
              title="Customer Responsibilities"
            />

            <p className="mb-4 leading-7 text-gray-700">
              <strong>7.1 Accurate Information:</strong> Customers
              must provide accurate information regarding items,
              locations and access details.
            </p>

            <p className="mb-4 leading-7 text-gray-700">
              <strong>7.2 Access:</strong> Customers are responsible
              for ensuring access to both pickup and delivery
              locations. Any additional charges caused by access
              issues are the customer's responsibility.
            </p>

            <p className="mb-6 leading-7 text-gray-700">
              <strong>7.3 Prohibited Items:</strong> Customers must
              not include hazardous, illegal or prohibited items in
              their shipment. Khan Moves Limited reserves the right to
              refuse service for non-compliant shipments.
            </p>

            <SectionTitle
              number="8"
              title="Service Schedule"
            />

            <p className="mb-4 leading-7 text-gray-700">
              <strong>8.1 Time Windows:</strong> We provide
              approximate time windows for service. We cannot
              guarantee exact arrival times due to traffic and other
              unforeseen circumstances.
            </p>

            <p className="mb-6 leading-7 text-gray-700">
              <strong>8.2 Delays:</strong> While we strive to be
              punctual, Khan Moves Limited is not liable for delays
              caused by traffic, weather or other external factors.
            </p>

            <SectionTitle
              number="9"
              title="Complaints and Disputes"
            />

            <p className="mb-4 leading-7 text-gray-700">
              <strong>9.1 Complaint Procedure:</strong> Any complaints
              must be reported within 48 hours of service completion.
              Contact us at{" "}
              <a
                href="mailto:khanmovesuk@gmail.com"
                className="font-semibold text-[#C0392B] hover:underline"
              >
                khanmovesuk@gmail.com
              </a>{" "}
              or{" "}
              <a
                href="tel:+447424153126"
                className="font-semibold text-[#C0392B] hover:underline"
              >
                07424 153126
              </a>
              .
            </p>

            <p className="mb-6 leading-7 text-gray-700">
              <strong>9.2 Resolution:</strong> We will investigate all
              complaints and respond within 7 business days.
            </p>

            <SectionTitle
              number="10"
              title="Data Protection"
            />

            <p className="mb-6 leading-7 text-gray-700">
              Your personal data will be processed according to UK
              GDPR regulations. We will only use your information for
              service delivery and communication purposes.
            </p>

            <SectionTitle
              number="11"
              title="Website Disclaimer"
            />

            <p className="mb-4 leading-7 text-gray-700">
              <strong>11.1 Accuracy:</strong> While we strive to
              ensure website accuracy, Khan Moves Limited does not
              warrant the accuracy or completeness of content.
            </p>

            <p className="mb-6 leading-7 text-gray-700">
              <strong>11.2 Availability:</strong> Website access is
              provided on an "as-is" basis. We do not guarantee
              uninterrupted availability.
            </p>

            <SectionTitle
              number="12"
              title="Changes to Terms"
            />

            <p className="mb-6 leading-7 text-gray-700">
              Khan Moves Limited reserves the right to change these
              Terms at any time. Changes will be effective immediately
              upon posting to the website.
            </p>

            <SectionTitle
              number="13"
              title="Governing Law"
            />

            <p className="mb-6 leading-7 text-gray-700">
              These Terms are governed by the laws of England and
              Wales. Any disputes will be resolved in the English
              courts.
            </p>

            <SectionTitle
              number="14"
              title="Contact Us"
            />

            <p className="mb-4 leading-7 text-gray-700">
              For questions about these Terms, please contact Khan
              Moves Limited.
            </p>

            <div className="mt-5 space-y-3 rounded-xl border border-red-100 bg-red-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C0392B] text-white">
                  <FiMail size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </p>

                  <a
                    href="mailto:khanmovesuk@gmail.com"
                    className="font-semibold text-[#C0392B] hover:underline"
                  >
                    khanmovesuk@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C0392B] text-white">
                  <FiPhone size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Phone
                  </p>

                  <a
                    href="tel:+447424153126"
                    className="font-semibold text-[#C0392B] hover:underline"
                  >
                    07424 153126
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden bg-[#DC2626] py-16 text-white md:py-20">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-yellow-400 opacity-5 blur-3xl" />

        <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-white opacity-5 blur-3xl" />

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.6
          }}
          className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Book Your Move?
          </h2>

          <p className="mb-8 text-lg text-red-100">
            Get your quote and complete your booking in just a few
            simple steps.
          </p>

          <Link
            to="/booking"
            className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-10 py-3 font-bold text-[#1a1a1a] shadow-lg transition-all hover:scale-105 hover:bg-yellow-500 active:scale-95"
          >
            Continue to Booking
            <FiArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
}

function SectionTitle({
  number,
  title
}) {
  return (
    <div className="mb-4 mt-8 flex items-start gap-3 first:mt-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-sm font-bold text-[#C0392B]">
        {number}
      </span>

      <h2 className="pt-0.5 text-2xl font-bold text-[#1a1a1a]">
        {title}
      </h2>
    </div>
  );
}