import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiArrowRight, FiPhone, FiMapPin, FiClock, FiCheckCircle,
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';


const getTheme = (idx) => SERVICE_THEMES[idx % SERVICE_THEMES.length];



// ── Main Component ────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const location = useLocation();

  const blogSliderRef = React.useRef(null);
  const [blogSliderValue, setBlogSliderValue] = useState(0);

  const blogPosts = [
    {
      image: "/blog_truck.png",
      title: "Choose the right size van for your move.",
    },
    {
      image: "/paper_image.png",
      title: "Some important things to check before moving.",
    },
    {
      image: "/paper_image.png",
      title: "Some important things to check before moving.",
    },
    {
      image: "/paper_image.png",
      title: "Some important things to check before moving.",
    },

    {
      image: "/paper_image.png",
      title: "Some important things to check before moving.",
    },
    {
      image: "/paper_image.png",
      title: "Some important things to check before moving.",
    },
    {
      image: "/paper_image.png",
      title: "Some important things to check before moving.",
    },
  ];

  const handleBlogSlider = (e) => {
    const value = Number(e.target.value);
    setBlogSliderValue(value);

    if (blogSliderRef.current) {
      const maxScroll =
        blogSliderRef.current.scrollWidth -
        blogSliderRef.current.clientWidth;

      blogSliderRef.current.scrollTo({
        left: (maxScroll * value) / 100,
        behavior: "smooth",
      });
    }
  };

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

  useEffect(() => {
    if (location.state?.scrollTo === "blog-section") {
      const timer = setTimeout(() => {
        const blogSection = document.getElementById("blog-section");

        if (blogSection) {
          blogSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }

        window.history.replaceState({}, document.title, window.location.pathname);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const goToBooking = (slug) => {
    window.scrollTo(0, 0);

    navigate('/booking', {
      state: {
        serviceType: slug
      }
    });
  };
  const selectedService = services.find(s => s.slug === selectedQuote);

  const faqData = [
    {
      question: "How Khan Moves Work?",
      answer: (
        <>
          Tell us what you're moving, where it's going and when. Get a clear
          quote, choose your preferred date, book your move. We provide careful
          handling and genuine cooperation on moving day. We’re not here to push
          you into the most expensive option. Plus there are no hidden charges
          and no unnecessary middlemen.
          <br />
          <br />
          Moving shouldn’t feel like a booking number- Right?
          <br />
          <br />
          We keep every move personal, careful. Because we own the company, we
          take responsibility for the service from start to end.
        </>
      ),
    },

    {
      question: "How to get a Quote?",
      answer: (
        <>
          Simply enter your move details on our website i.e pickup location and
          address, select items you want to move, see instant prices and simply
          choose a date and time. If you want dismantling or assembly you can
          choose it as well.
          <br />
          <br />
          Get a free quote{" "}
          <a
            href="/booking"
            className="font-semibold underline"
          >
            here
          </a>
        </>
      ),
    },

    {
      question: "What happens after booking request?",
      answer: (
        <>
          Once you submit your booking request, we'll review the details and
          confirm everything with you. You'll receive your booking confirmation
          via email, whatsapp or call.
        </>
      ),
    },

    {
      question: "Do you offer other services?",
      answer: (
        <>
          Yes. We offer expert Packing/ Unpacking and wrapping of fragile goods,
          electronics, and artwork. Dismantling and reassembly of furniture
          items.
          <br />
          <br />
          Call us on{" "}
          <a
            href="tel:07869416748"
            className="font-semibold underline"
          >
            07869416748
          </a>
        </>
      ),
    },

    {
      question: "What are flexible date jobs?",
      answer: (
        <>
          Get straight 20% discount in overall quote by just clicking the
          flexible date option on our website.
          <br />
          <br />
          <strong>
            You can unlock a better price while keeping your move convenient.
          </strong>
        </>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-hidden bg-[#F5F1ED]">

      {/* ── HERO ── */}
      <section className="relative z-10 h-120 overflow-visible bg-[#E20613] text-white md:h-120">
        <div className="mx-auto flex h-full w-full max-w-195 items-start justify-center px-3 md:px-0">

          <div className="relative flex h-full w-full">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="absolute left-3 top-13.75 z-20 md:left-0 md:top-13.75"
            >
              <h1 className="text-[25px] font-bold leading-[1.08] md:text-[38px]">
                <span className="md:hidden">Get a Free Quote</span>

                <span className="hidden md:inline">
                  Get a Free
                  <br />
                  Quote
                </span>
              </h1>

              <p className="mt-3 text-[12px] font-medium leading-tight md:mt-5 md:text-[16px]">
                <span className="md:hidden">
                  Every move on the ground, with no
                  <br />
                  hidden charges and no unnecessary
                  <br />
                  middlemen.
                  <br />
                  <br />
                  Find a budget price for your move
                  <br />
                  below
                </span>

                <span className="hidden md:inline">
                  Find Budget Price
                  <br />
                  for your move
                  <br />
                  here
                </span>
              </p>

              {/* NEED HELP */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.35,
                }}
                className="mt-6 hidden items-center gap-2 md:flex md:mt-10"
              >
                <span className="flex h-7.75 w-7.75 items-center justify-center rounded-md bg-[#FFEA00]">
                  <img
                    src="/whats_app_icon.svg"
                    alt="WhatsApp"
                    className="h-5 w-5 object-contain"
                  />
                </span>

                <span className="text-left text-[10px] leading-[1.1]">
                  <span className="block text-[9px] text-white">
                    Need Help
                  </span>

                  <span className="font-semibold underline">
                    Getting a Quote?
                  </span>
                </span>
              </motion.div>
            </motion.div>


            {/* SERVICE CARDS */}
            <div className="absolute left-[43%] top-8.75 z-10 w-117.5 md:left-75 md:top-8.75 md:w-117.5 max-md:left-1/2 max-md:-translate-x-1/2 max-md:top-51.25 max-md:w-[calc(100%-24px)]">
              <div className="grid grid-cols-6 gap-2.5 max-md:gap-1.5">

                {services.slice(0, 5).map((service, idx) => (
                  <motion.button
                    key={service._id}
                    type="button"
                    onClick={() => goToBooking(service.slug)}
                    initial={{
                      opacity: 0,
                      y: 25,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: 0.15 + idx * 0.08,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      scale: 1.02,
                    }}
                    className={`group overflow-hidden rounded-[9px] bg-[#FFEA00] text-left ${idx < 2 ? "col-span-3" : "col-span-2"
                      } max-md:rounded-md`}
                  >

                    {/* YELLOW IMAGE AREA */}
                    <div
                      className={`flex w-full items-center justify-center overflow-hidden bg-[#FFEA00] ${idx < 2
                        ? "h-36.25 max-md:h-18"
                        : "h-26.25 max-md:h-14.5"
                        }`}
                    >
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.label}
                          className={`object-contain transition-transform duration-300 group-hover:scale-105 ${idx < 2
                            ? "h-28 w-[88%] max-md:h-14.5 max-md:w-[82%]"
                            : "h-20.5 w-[82%] max-md:h-12 max-md:w-[78%]"
                            }`}
                        />
                      ) : (
                        <div className="text-xs font-semibold text-gray-700">
                          {service.label}
                        </div>
                      )}
                    </div>

                    {/* WHITE LABEL */}
                    <div
                      className={`flex items-center justify-between bg-white px-3 ${idx < 2
                        ? "h-7.25 max-md:h-4.25"
                        : "h-6.75 max-md:h-4.25"
                        } max-md:px-1.5`}
                    >
                      {/* SERVICE NAME */}
                      <span className="flex min-w-0 items-center gap-2 max-md:gap-1">
                        <span className="truncate text-[12px] font-bold text-[#555555] max-md:text-[8px]">
                          {service.label}
                        </span>
                      </span>

                      {/* RIGHT ARROW */}
                      <img
                        src="/arrow_right_icon.svg"
                        alt=""
                        className="h-5 w-5 shrink-0 object-contain max-md:h-3 max-md:w-3"
                      />
                    </div>

                  </motion.button>
                ))}

              </div>
            </div>


            {/* DISCOUNT BUBBLE */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.6,
                ease: "easeOut",
              }}
              className="absolute top-97.5 left-[55%] z-20 max-md:top-auto max-md:bottom-8.75 max-md:left-16.25"
            >
              <div className="relative w-30.5 rounded-[7px] bg-white px-3 py-3 text-[9px] leading-tight text-gray-600 shadow-sm max-md:w-20.5 max-md:px-2 max-md:py-2 max-md:text-[6px]">
                Get guaranteed
                <br />
                discount on
                <br />
                flexible date.

                {/* Speech bubble tail */}
                <span className="absolute -bottom-3 right-0 h-0 w-0 border-l-20 border-t-14 border-l-transparent border-t-white" />
              </div>
            </motion.div>


            {/* CROCODILE */}
            <motion.img
              src="/corcodile_image.png"
              alt=""
              initial={{
                opacity: 0,
                x: 40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.45,
                ease: "easeOut",
              }}
              className="pointer-events-none absolute top-87.5 -right-18.75 z-5 w-75 select-none object-contain max-md:top-93.75 max-md:right-0 max-md:w-43.75"
            />

          </div>
        </div>
      </section >

      {/* ── CUSTOMER MESSAGE SECTION ── */}
      <section className="relative z-0 min-h-122.5 overflow-hidden bg-[#FFEA00] max-md:min-h-107.5">

        <div className="mx-auto w-full max-w-195 px-3 pt-13.75 md:px-0 md:pt-19.5">

          <motion.div
            initial={{
              opacity: 0,
              y: 45,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="w-full max-w-140"
          >

            {/* HEADING */}
            <motion.h2
              initial={{
                opacity: 0,
                x: -30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
              className="text-[24px] font-bold leading-[1.15] text-[#555555] md:text-[34px]"
            >
              What our customers are saying
            </motion.h2>


            {/* FIRST PARAGRAPH */}
            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
                delay: 0.15,
              }}
              className="mt-5 max-w-147.5 text-[13px] leading-[1.35] text-[#555555] md:text-[16px]"
            >
              We keep every move personal, careful.
              <br />
              Because we own the company, we take responsibility for
              <br />
              the service from start to end.
            </motion.p>


            {/* SECOND PARAGRAPH */}
            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
                delay: 0.3,
              }}
              className="mt-5 max-w-150 text-[13px] leading-[1.35] text-[#555555] md:text-[16px]"
            >
              Careful handling and genuine cooperation on moving day,
              <br />
              with no hidden charges or last-minute penalties.
            </motion.p>

          </motion.div>

        </div>
      </section >

      {/* ── WHY KHAN MOVES / HOW IT WORKS ── */}
      <section className="relative overflow-hidden bg-white text-[#555555]">

        <div className="mx-auto w-full max-w-195 px-3 py-13.75 md:px-0 md:py-21.25">

          {/* =====================================================
              REASON WHY FAMILIES LOVE US
          ====================================================== */}
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_320px] md:gap-8">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-65 text-[25px] font-bold leading-[1.08] text-[#555555] md:text-[30px]"
              >
                Reason why
                <br />
                families love us
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-4 max-w-97.5 text-[11px] leading-[1.45] text-[#555555] md:text-[13px]"
              >
                We don't want to push you into the most expensive option.
                <br />
                Plus there are no hidden charges and no unnecessary
                <br />
                middlemen.
                <br />
                Moving shouldn't feel like a booking nightmare. Right?
              </motion.p>

              {/* FEATURE 1 */}
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-7 flex items-start gap-4"
              >
                <img
                  src="/bill_icon.svg"
                  alt=""
                  className="mt-1 h-7 w-7 shrink-0 object-contain md:h-8 md:w-8"
                />

                <p className="max-w-87.5 text-[10px] leading-[1.4] text-[#555555] md:text-[12px]">
                  Our prices are competitive and built around
                  <br className="hidden md:block" />
                  the move you actually need. No inflated costs,
                  <br className="hidden md:block" />
                  and no job changes. Just a fair price for the job.
                </p>
              </motion.div>

              {/* FEATURE 2 */}
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 flex items-start gap-4"
              >
                <img
                  src="/calender_icon.svg"
                  alt=""
                  className="mt-1 h-7 w-7 shrink-0 object-contain md:h-8 md:w-8"
                />

                <p className="max-w-87.5 text-[10px] leading-[1.4] text-[#555555] md:text-[12px]">
                  Get more flexibility. We allow you to choose a
                  <br className="hidden md:block" />
                  wider moving window and we can offer better
                  <br className="hidden md:block" />
                  rates, helping you save on cost without
                  <br className="hidden md:block" />
                  compromising on the service.
                </p>
              </motion.div>

              {/* FEATURE 3 */}
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6 flex items-start gap-4"
              >
                <img
                  src="/team_icon.svg"
                  alt=""
                  className="mt-1 h-7 w-7 shrink-0 object-contain md:h-8 md:w-8"
                />

                <p className="max-w-87.5 text-[10px] leading-[1.4] text-[#555555] md:text-[12px]">
                  We believe quality and trust matter. We
                  <br className="hidden md:block" />
                  communicate clearly and handle your move
                  <br className="hidden md:block" />
                  with care, whether you're moving across a city
                  <br className="hidden md:block" />
                  or across the country.
                </p>
              </motion.div>
            </motion.div>


            {/* CEO IMAGE */}
            <motion.div
              initial={{ opacity: 0, x: 45, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="flex items-center justify-center md:justify-end"
            >
              <img
                src="/ceo_image.png"
                alt="Khan Moves"
                className="w-58.75 object-contain md:w-71.25"
              />
            </motion.div>

          </div>


          {/* =====================================================
              HOW KHAN MOVES WORK
          ====================================================== */}
          <div className="mt-18.75 grid grid-cols-1 items-center gap-10 md:mt-26.25 md:grid-cols-[1fr_320px] md:gap-8">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-[25px] font-bold leading-[1.08] text-[#555555] md:text-[30px]"
              >
                How Khan Moves
                <br />
                Work?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-5 max-w-95 text-[10px] leading-[1.45] text-[#555555] md:text-[13px]"
              >
                Process is actually very simple.
                <br />
                Get free quote with details
                <br />
                and get your quote from a move
                <br />
                by our expert team. Here's how
                <br />
                we work:
              </motion.p>


              {/* STEP 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-5"
              >
                <h3 className="text-[11px] font-semibold text-[#555555] md:text-[13px]">
                  1. Get a Free Quote
                </h3>

                <p className="mt-1 max-w-92.5 text-[10px] leading-[1.4] text-[#555555] md:text-[12px]">
                  Select pickup and delivery location.
                  <br />
                  Select items and moving time. You'll get
                  <br />
                  your estimated price. Pick your date and
                  <br />
                  get booked!
                </p>
              </motion.div>


              {/* STEP 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-5"
              >
                <h3 className="text-[11px] font-semibold text-[#555555] md:text-[13px]">
                  2. Meet our expert Team
                </h3>

                <p className="mt-1 max-w-92.5 text-[10px] leading-[1.4] text-[#555555] md:text-[12px]">
                  Our expert team will review your
                  <br />
                  booking and will send confirmation email
                  <br />
                  or WhatsApp.
                </p>
              </motion.div>


              {/* STEP 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-5"
              >
                <h3 className="text-[11px] font-semibold text-[#555555] md:text-[13px]">
                  3. Stay updated
                </h3>

                <p className="mt-1 max-w-92.5 text-[10px] leading-[1.4] text-[#555555] md:text-[12px]">
                  You'll be updated every step of the way
                  <br />
                  with WhatsApp notifications.
                </p>
              </motion.div>

            </motion.div>


            {/* RIGHT / TRUCK + BUTTON */}
            <motion.div
              initial={{ opacity: 0, x: 45, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="flex flex-col items-center justify-center md:items-center"
            >
              {/* IMPORTANT:
                  Replace this filename with the exact truck image
                  filename from your /public folder if different.
              */}
              <motion.img
                src="/truck_image.png"
                alt="Khan Moves truck"
                className="w-58.75 object-contain md:w-71.25"
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.button
                type="button"
                onClick={() => navigate('/booking')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="-mt-1 rounded-full bg-[#FFEA00] px-6 py-2 text-[14px] font-bold text-[#555555] shadow-sm md:text-[16px]"
              >
                Get Quote
              </motion.button>

              <span className="mt-1 text-[9px] text-[#555555] md:text-[11px]">
                only in 2 min
              </span>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="relative overflow-hidden bg-[#FFEA00]">

        <div className="mx-auto w-full max-w-195 px-3 pb-17.5 pt-11.25 md:px-0 md:pb-22.5 md:pt-15">

          {/* FAQ HEADING + DINOSAUR */}
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="relative mx-auto mb-17.5 flex h-18.75 w-full max-w-155 items-start justify-center md:mb-20"
          >

            {/* HEADING */}
            <div className="relative z-10 text-center">
              <h2 className="text-[24px] font-bold leading-none text-[#555555] md:text-[34px]">
                <span className="block text-[18px] md:text-[24px]">
                  Ask Questions
                </span>

                <span className="block">
                  from Lord
                </span>
              </h2>
            </div>

            {/* DINOSAUR */}
            <motion.img
              src="/dinasore_head.png"
              alt=""
              initial={{
                opacity: 0,
                scale: 0.85,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: "easeOut",
              }}
              className="pointer-events-none absolute left-1/2 top-3.75 z-20 w-41.25 -translate-x-1/2 object-contain md:top-4.5 md:w-53.75"
            />

          </motion.div>


          {/* FAQ LIST */}
          <motion.div
            initial={{
              opacity: 0,
              y: 35,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="mx-auto w-full max-w-155"
          >

            {faqData.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <motion.div
                  key={faq.question}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.06,
                  }}
                  className="overflow-hidden border-b border-[#FFEA00] bg-white"
                >

                  {/* QUESTION */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                    className="flex min-h-11.5 w-full items-center justify-between gap-3 px-4 py-2 text-left transition-colors hover:bg-gray-50 md:min-h-12 md:px-5"
                  >

                    <span className="text-[10px] font-medium text-[#555555] md:text-[13px]">
                      {faq.question}
                    </span>

                    <motion.span
                      animate={{
                        rotate: isOpen ? 180 : 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className="flex h-5 w-5 shrink-0 items-center justify-center"
                    >
                      <img
                        src="/down_arrow.svg"
                        alt=""
                        className="h-5 w-5 object-contain"
                      />
                    </motion.span>

                  </button>


                  {/* ANSWER */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-100 px-4 pb-4 pt-3 text-[9px] leading-[1.55] text-[#555555] md:px-5 md:pb-5 md:pt-4 md:text-[12px]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}

          </motion.div>

        </div>

      </section>

      {/* ── BLOG / MOVING TIPS SECTION ── */}
      <section id="blog-section" className="relative overflow-hidden bg-[#E20613] text-white">

        <div className="mx-auto w-full max-w-195 px-3 py-11.25 md:px-0 md:py-16.25">

          {/* HEADING */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="mb-7 md:mb-9"
          >
            <h2 className="text-[23px] font-bold leading-[1.1] md:text-[32px]">
              Get Tips to help
              <br />
              you move
            </h2>
          </motion.div>


          {/* BLOG CARDS */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          >

            <div
              ref={blogSliderRef}
              className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth pb-2 scrollbar-hide md:gap-3"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >

              {blogPosts.map((post, index) => (
                <motion.article
                  key={index}
                  whileHover={{
                    y: -4,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="w-[calc(100%-35px)] min-w-[calc(100%-35px)] snap-start overflow-hidden rounded-[7px] bg-white md:w-[calc((100%-24px)/3)] md:min-w-[calc((100%-24px)/3)]"
                >

                  {/* IMAGE */}
                  <div className="flex h-31.25 items-center justify-center overflow-hidden bg-[#FFEA00] md:h-36.25">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>

                  {/* CARD TEXT */}
                  <div className="min-h-13.75 px-3 py-3">
                    <p className="text-[9px] leading-[1.35] text-[#555555] md:text-[11px]">
                      {post.title}
                    </p>
                  </div>

                </motion.article>
              ))}

            </div>

          </motion.div>


          {/* SLIDER */}
          <motion.div
            initial={{
              opacity: 0,
              scaleX: 0.8,
            }}
            whileInView={{
              opacity: 1,
              scaleX: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.15,
            }}
            className="mx-auto mt-6 flex w-47.5 items-center gap-2 md:mt-7 md:w-60"
          >

            <input
              type="range"
              min="0"
              max="100"
              value={blogSliderValue}
              onChange={handleBlogSlider}
              className="h-1.25 w-full cursor-pointer appearance-none rounded-full bg-[#F48A93] accent-[#FFEA00]"
              aria-label="Move blog cards"
            />

          </motion.div>


          {/* GET QUOTE BUTTON */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
              delay: 0.25,
            }}
            className="mt-6 flex flex-col items-center"
          >

            <motion.button
              type="button"
              onClick={() => navigate("/booking")}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.96,
              }}
              className="rounded-full bg-[#FFEA00] px-5 py-1.5 text-[11px] font-bold text-[#555555] md:px-6 md:py-2 md:text-[14px]"
            >
              Get Quote
            </motion.button>

            <span className="mt-1 text-[7px] text-white md:text-[9px]">
              only in 2 min
            </span>

          </motion.div>


          {/* NEED HELP */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
              delay: 0.35,
            }}
            className="mt-4 flex items-center justify-center gap-1.5"
          >

            <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#FFEA00] md:h-6.25 md:w-6.25">
              <img
                src="/whats_app_icon.svg"
                alt="WhatsApp"
                className="h-3.5 w-3.5 object-contain md:h-4.25 md:w-4.25"
              />
            </span>

            <span className="text-[7px] leading-[1.1] md:text-[9px]">
              Need Help{" "}
              <span className="font-semibold underline">
                Getting a Quote?
              </span>
            </span>

          </motion.div>

        </div>

      </section>

    </div >
  );
}
