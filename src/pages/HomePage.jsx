import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';
import TrustpilotReviewCollector from '../components/TrustpilotReviewCollector';

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

      {/* ── RESPONSIVE HERO ── */}
      <section className="relative z-10 min-h-[calc(100svh-64px)] bg-[#E20613] text-white">
        <div className="mx-auto flex min-h-[calc(100svh-64px)] w-full max-w-350 px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16">

          {/* ── MOBILE HERO ── */}
          <div className="relative min-h-[calc(100svh-44px)] w-full overflow-hidden px-5 py-5 sm:px-6 md:hidden">

            <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10">
              <h1 className="text-[36px] font-bold leading-none">Get a Free Quote</h1>

              <p className="mt-4 max-w-85 text-[18px] font-medium leading-[1.08]">
                Every move on the ground, with no hidden charges and no unnecessary middlemen.
              </p>

              <p className="mt-3 max-w-85 text-[18px] font-medium leading-[1.08]">
                Find a budget price for your move below
              </p>
            </motion.div>

            <div className="relative z-10 mx-auto mt-7 w-full max-w-90">
              <div className="grid grid-cols-6 gap-1.5 sm:gap-2">

                {services.slice(0, 5).map((service, idx) => (
                  <motion.button
                    key={service._id}
                    type="button"
                    onClick={() => goToBooking(service.slug)}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.07 }}
                    className={`group overflow-hidden rounded-[7px] bg-[#FFEA00] text-left ${idx < 2 ? "col-span-3" : "col-span-2"}`}
                  >
                    <div className={`flex w-full items-center justify-center overflow-hidden bg-[#FFEA00] ${idx < 2 ? "aspect-[1.48/1]" : "aspect-1.25/1"}`}>
                      {service.image ? (
                        <img src={service.image} alt={service.label} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                      ) : (
                        <span className="px-1 text-center text-[9px] font-semibold text-gray-700">{service.label}</span>
                      )}
                    </div>

                    <div className="flex h-6 items-center justify-between bg-white px-1.5">
                      <span className="min-w-0 truncate text-[8px] font-bold leading-none text-[#555] sm:text-[9px]">{service.label}</span>
                      <img src="/arrow_right_icon.svg" alt="" className="h-3 w-3 shrink-0 object-contain" />
                    </div>
                  </motion.button>
                ))}

              </div>
            </div>

            <div className="relative z-10 mx-auto mt-7 flex w-full items-center justify-center gap-2">
              <img src="/whats_app_icon.svg" alt="WhatsApp" className="h-7 w-7 shrink-0 object-contain" />
              <span className="whitespace-nowrap text-[18px] leading-none">
                <span className="font-normal underline">Need Help Getting a Quote?</span>
              </span>
            </div>

            <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-57.5 w-72.5 sm:h-62.5 sm:w-[320px]">
              <div className="absolute bottom-22 -left-8.75 z-20 w-33 rounded-[15px] bg-white px-4 py-3 text-[12px] leading-[1.2] text-gray-600 shadow-sm sm:bottom-23.75 sm:-left-10 sm:w-35">
                <span className="line-through">£200</span>&nbsp; £160<br />
                Save £40 with a<br />
                flexible date.
                <span className="absolute -bottom-2.5 right-0 h-0 w-0 border-l-16 border-t-11 border-l-transparent border-t-white" />
              </div>

              <img src="/corcodile_image.png" alt="" className="absolute -bottom-2 -right-4.5 z-10 w-47.5 object-contain sm:-bottom-2.5 sm:-right-5 sm:w-53.75" />
            </div>

          </div>


          {/* ── TABLET / DESKTOP HERO ── */}
          <div className="relative hidden min-h-[91svh] w-full overflow-visible md:flex">

            <div className="mx-auto flex min-h-[91svh] w-full max-w-225 items-start gap-8 px-0">

              <div className="relative z-30 w-[32%] shrink-0 pt-[10vh]">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                  <h1 className="text-[50px] font-bold leading-[0.98]">Get a Free<br />Quote</h1>

                  <p className="mt-6 text-[32px] font-medium leading-[1.08]">
                    Find Budget Price<br />for your move<br />here
                  </p>

                  <div className="mt-10 flex items-center gap-2">
                    <img src="/whats_app_icon.svg" alt="WhatsApp" className="h-8 w-8 object-contain" />
                    <span className="text-sm leading-[1.05]">
                      <span className="block">Need Help</span>
                      <span className="font-semibold underline">Getting a Quote?</span>
                    </span>
                  </div>
                </motion.div>
              </div>

              <div className="relative min-w-0 flex-1 pt-[8vh]">

                <div className="relative z-10 w-full">
                  <div className="grid grid-cols-6 gap-3">

                    {services.slice(0, 5).map((service, idx) => (
                      <motion.button
                        key={service._id}
                        type="button"
                        onClick={() => goToBooking(service.slug)}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: idx * 0.08 }}
                        className={`group overflow-hidden rounded-md bg-[#FFEA00] text-left ${idx < 2 ? "col-span-3" : "col-span-2"}`}
                      >
                        <div className={`flex w-full items-center justify-center overflow-hidden bg-[#FFEA00] ${idx < 2 ? "aspect-[2.35/1]" : "aspect-[1.65/1]"}`}>
                          {service.image ? (
                            <img src={service.image} alt={service.label} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                          ) : (
                            <span className="px-2 text-center text-xs font-semibold text-gray-700">{service.label}</span>
                          )}
                        </div>

                        <div className="flex h-8 items-center justify-between bg-white px-2.5">
                          <span className="min-w-0 truncate text-[10px] font-bold text-[#555] lg:text-[11px]">{service.label}</span>
                          <img src="/arrow_right_icon.svg" alt="" className="h-4 w-4 shrink-0 object-contain" />
                        </div>
                      </motion.button>
                    ))}

                  </div>
                </div>

              </div>

            </div>
            {/* ── DESKTOP OFFER + CROCODILE ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="pointer-events-none absolute bottom-0 left-1/2 z-40 w-full max-w-225 -translate-x-1/2"
            >
              <div className="relative h-52.5 w-full">

                <div className="absolute bottom-23 right-75 z-30 w-31.25 rounded-md bg-white px-3 py-3 text-xs leading-[1.15] text-gray-600 shadow-sm">
                  <span className="line-through">£200</span>&nbsp; £160<br />
                  Save £40 with a<br />
                  flexible date.
                  <span className="absolute -bottom-3 right-0 h-0 w-0 border-l-17 border-t-12 border-l-transparent border-t-white" />
                </div>

                <motion.img
                  src="/corcodile_image.png"
                  alt=""
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                  className="pointer-events-none absolute -bottom-28.75 -right-8.75 z-20 w-[clamp(230px,25vw,330px)] object-contain"
                />

              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ── CUSTOMER MESSAGE SECTION ── */}
      <section className="relative z-0 h-[calc(100svh-35px)] overflow-hidden bg-[#FFEA00] md:min-h-122.5">

        <div className="mx-auto w-full max-w-226 px-5 pt-10 md:px-6 lg:px-8 xl:px-0 md:pt-19.5">

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
              className="text-[32px] font-bold leading-[1.15] text-[#555555] md:text-[34px]"
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
              className="mt-5 max-w-147.5 text-[20px] leading-[1.35] text-[#555555] md:text-[16px]"
            >
              We pride ourselves on our guys who take their shoes off at your front door, keep you in the loop every step of the way, and figure out how to get a heavy sofa through an impossibly narrow hallway without scratching the wall or the sofa.
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
              className="mt-5 max-w-150 text-[20px] leading-[1.35] text-[#555555] md:text-[16px]"
            >
              Below are real reviews left by our customers right after their moves wrap up.
            </motion.p>

            <div className="mt-8 w-full">
              <TrustpilotReviewCollector />
            </div>

          </motion.div>

        </div>
      </section>

      {/* ── WHY KHAN MOVES / HOW IT WORKS ── */}
      <section className="relative overflow-hidden bg-white text-[#555555]">
        <div className="block md:hidden">
          <div className="min-h-svh px-5 pt-9.5 pb-6.25">

            {/* HEADING */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[32px] font-bold leading-[1.05] text-[#555555]"
            >
              Reason why
              <br />
              families love us
            </motion.h2>

            {/* DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 text-[22px] leading-tight text-[#555555]"
            >
              We don't want to push you into the most expensive option.
              <br />
              Plus there are no hidden charges and no unnecessary
              <br />
              middlemen.
              <br />
              Moving shouldn't feel like a booking nightmare. Right?
            </motion.p>

            {/* CEO IMAGE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-3.5 flex justify-center"
            >
              <img
                src="/ceo_image.png"
                alt="Khan Moves"
                className="w-45 object-contain"
              />
            </motion.div>

            {/* FEATURE 1 */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 flex items-start gap-2.5"
            >
              <img
                src="/bill_icon.svg"
                alt=""
                className="mt-0.5 h-5 w-5 shrink-0 object-contain"
              />

              <p className="text-[20px] leading-[1.3] text-[#555555]">
                Our prices are competitive and built around
                <br />
                the move you actually need. No inflated costs, and
                <br />
                no job changes. Just a fair price for the job.
              </p>
            </motion.div>

            {/* FEATURE 2 */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-5 flex items-start gap-2.5"
            >
              <img
                src="/calender_icon.svg"
                alt=""
                className="mt-0.5 h-5 w-5 shrink-0 object-contain"
              />

              <p className="text-[15px] leading-[1.3] text-[#555555]">
                Get more flexibility. We allow you to choose a
                <br />
                wider moving window and we can offer better
                <br />
                rates, helping you save more without
                <br />
                compromising the service.
              </p>
            </motion.div>

            {/* FEATURE 3 */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-5 flex items-start gap-2.5"
            >
              <img
                src="/team_icon.svg"
                alt=""
                className="mt-0.5 h-5 w-5 shrink-0 object-contain"
              />

              <p className="text-[15px] leading-[1.3] text-[#555555]">
                We believe quality and trust matter. We
                <br />
                communicate clearly and handle your move
                <br />
                with care, whether you're moving across a
                <br />
                city or across the country.
              </p>
            </motion.div>

          </div>

          <div className="min-h-svh px-5 pt-7.5 pb-7.5">

            {/* TRUCK */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center"
            >

              <img
                src="/truck_image.png"
                alt="Khan Moves truck"
                className="w-47.5 object-contain"
              />

              <button
                type="button"
                onClick={() => navigate("/booking")}
                className="-mt-0.5 rounded-full bg-[#FFEA00] px-6.25 py-2 text-[18px] font-bold text-[#555555]"
              >
                Get Quote
              </button>

              <span className="mt-0.75 text-[15px] text-[#555555]">
                only in 2 min
              </span>

            </motion.div>


            {/* HEADING */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-6 text-[32px] font-bold leading-[1.05] text-[#555555]"
            >
              How Khan Moves
              <br />
              Work?
            </motion.h2>


            {/* DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4.5 text-[15px] leading-tight text-[#555555]"
            >
              Process is actually very simple. Get free
              <br />
              quote with details and prepare yourself
              <br />
              for a move by our expert team. Here's how
              <br />
              we work:
            </motion.p>


            {/* STEP 1 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5.5"
            >
              <h3 className="text-[15px] font-semibold text-[#555555]">
                1. Get a Free Quote
              </h3>

              <p className="mt-1.25 text-[15px] leading-[1.3] text-[#555555]">
                Select pickup and delivery location.
                <br />
                Select items you want moving. You'll get
                <br />
                your price instantly. Pick your date and
                <br />
                get booked in!
              </p>
            </motion.div>


            {/* STEP 2 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-5"
            >
              <h3 className="text-[15px] font-semibold text-[#555555]">
                2. Meet our expert Team
              </h3>

              <p className="mt-1.25 text-[15px] leading-[1.3] text-[#555555]">
                Our expert team will review your
                <br />
                booking and will send confirmation email
                <br />
                or whatsapp.
              </p>
            </motion.div>


            {/* STEP 3 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-5"
            >
              <h3 className="text-[15px] font-semibold text-[#555555]">
                3. Stay updated
              </h3>

              <p className="mt-1.25 text-[15px] leading-[1.3] text-[#555555]">
                You'll be updated every step of the way,
                <br />
                with WhatsApp notifications.
              </p>
            </motion.div>

          </div>

        </div>

        <div className="hidden md:block">
          <div className="relative mx-auto h-svh w-full max-w-226 px-6 lg:px-8 xl:px-0">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="absolute left-6 lg:left-8 xl:left-0 top-13.75 z-10"
            >

              <h2 className="text-[30px] font-bold leading-[1.05] text-[#555555]">
                Reason why
                <br />
                families love us
              </h2>

              <p className="mt-5 text-[13px] leading-[1.35] text-[#555555]">
                We don't want to push you into the most expensive option.
                <br />
                Plus there are no hidden charges and no unnecessary
                <br />
                middlemen.
                <br />
                Moving shouldn't feel like a booking nightmare. Right?
              </p>


              {/* FEATURE 1 */}
              <div className="mt-12 flex items-start gap-3">
                <img
                  src="/bill_icon.svg"
                  alt=""
                  className="h-7 w-7 object-contain"
                />

                <p className="text-[12px] leading-[1.3] text-[#555555]">
                  Our prices are competitive and built around
                  <br />
                  the move you actually need. No inflated costs,
                  <br />
                  and no job changes. Just a fair price for the job.
                </p>
              </div>


              {/* FEATURE 2 */}
              <div className="mt-6.75 flex items-start gap-3">
                <img
                  src="/calender_icon.svg"
                  alt=""
                  className="h-7 w-7 object-contain"
                />

                <p className="text-[12px] leading-[1.3] text-[#555555]">
                  Get more flexibility? We allow you to choose a
                  <br />
                  wider moving window and we can offer better
                  <br />
                  rates, helping you save more without
                  <br />
                  compromising the service.
                </p>
              </div>


              {/* FEATURE 3 */}
              <div className="mt-6.75 flex items-start gap-3">
                <img
                  src="/team_icon.svg"
                  alt=""
                  className="h-7 w-7 object-contain"
                />

                <p className="text-[12px] leading-[1.3] text-[#555555]">
                  We believe quality and trust matter. We
                  <br />
                  communicate clearly and handle your move
                  <br />
                  with care, whether you're moving across a city
                  <br />
                  or across the country.
                </p>
              </div>

            </motion.div>

            {/* DESKTOP CEO  */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute right-8 lg:right-12 xl:right-20 top-12 z-10"
            >
              <img
                src="/ceo_image.png"
                alt="Khan Moves"
                className="w-71.25 object-contain"
              />
            </motion.div>

          </div>

          <div className="relative mx-auto h-svh w-full max-w-226 px-6 lg:px-8 xl:px-0">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="absolute left-6 lg:left-8 xl:left-0 top-16.25 z-10"
            >

              <h2 className="text-[30px] font-bold leading-[1.05] text-[#555555]">
                How Khan Moves
                <br />
                Work?
              </h2>

              <p className="mt-6 text-[13px] leading-[1.35] text-[#555555]">
                Process is actually very simple.
                <br />
                Get free quote within minutes
                <br />
                and prepare yourself for a move
                <br />
                by our expert team. Here's how
                <br />
                we work:
              </p>


              {/* STEP 1 */}
              <div className="mt-6">
                <h3 className="text-[13px] font-semibold text-[#555555]">
                  1. Get a Free Quote
                </h3>

                <p className="mt-1.25 text-[12px] leading-[1.3] text-[#555555]">
                  Select pickup and delivery location.
                  <br />
                  Select items you want moving. You'll get
                  <br />
                  your price instantly. Pick your date and
                  <br />
                  get booked in!
                </p>
              </div>


              {/* STEP 2 */}
              <div className="mt-6">
                <h3 className="text-[13px] font-semibold text-[#555555]">
                  2. Meet our expert Team
                </h3>

                <p className="mt-1.25 text-[12px] leading-[1.3] text-[#555555]">
                  Our expert team will review your
                  <br />
                  booking and will send confirmation email
                  <br />
                  or whatsapp.
                </p>
              </div>


              {/* STEP 3 */}
              <div className="mt-6">
                <h3 className="text-[13px] font-semibold text-[#555555]">
                  3. Stay updated
                </h3>

                <p className="mt-1.25 text-[12px] leading-[1.3] text-[#555555]">
                  You'll be updated every step of the way,
                  <br />
                  with WhatsApp notifications.
                </p>
              </div>

            </motion.div>


            {/* DESKTOP TRUCK */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute right-8 lg:right-12 xl:right-17.5 top-18.75 z-10 flex flex-col items-center"
            >

              <img
                src="/truck_image.png"
                alt="Khan Moves truck"
                className="w-71.25 object-contain"
              />

              <button
                type="button"
                onClick={() => navigate("/booking")}
                className="mt-1.25 rounded-full bg-[#FFEA00] px-6.25 py-2 text-[16px] font-bold text-[#555555]"
              >
                Get Quote
              </button>

              <span className="mt-1 text-[11px] text-[#555555]">
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
