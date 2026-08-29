import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiLogOut, FiGrid, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/api";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [servicesOpen, setServicesOpen] = useState(false);

  const navigate = useNavigate();

  const {
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();

  // ============================================
  // FETCH SERVICES
  // ============================================
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/inventory/services");
        setServices(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    fetchServices();
  }, []);

  // ============================================
  // CLOSE MOBILE MENU
  // ============================================
  const closeMenu = () => {
    setIsOpen(false);
    setServicesOpen(false);
  };

  // ============================================
  // SERVICE CLICK
  // ============================================
  const handleServiceClick = (slug) => {
    closeMenu();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    navigate("/booking", {
      state: {
        serviceType: slug,
      },
    });
  };

  // ============================================
  // BLOG CLICK
  // ============================================
  const handleBlogsClick = () => {
    closeMenu();

    const scrollToBlog = () => {
      const blogSection = document.getElementById("blog-section");

      if (!blogSection) return;

      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        const navbarHeight = 59; // mobile navbar height
        const top =
          blogSection.getBoundingClientRect().top +
          window.scrollY -
          navbarHeight;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      } else {
        blogSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    // If already on home page
    if (window.location.pathname === "/") {
      setTimeout(scrollToBlog, 100);
      return;
    }

    // If coming from another page
    navigate("/", {
      state: {
        scrollTo: "blog-section",
      },
    });
  };

  // ============================================
  // REVIEWS CLICK
  // ============================================
  const handleReviewsClick = () => {
    closeMenu();

    const scrollToReviews = () => {
      const reviewsSection = document.getElementById("reviews-section");

      if (!reviewsSection) return;

      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        const navbarHeight = 59;

        const top =
          reviewsSection.getBoundingClientRect().top +
          window.scrollY -
          navbarHeight;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      } else {
        reviewsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    // If already on home page
    if (window.location.pathname === "/") {
      setTimeout(scrollToReviews, 100);
      return;
    }

    // If coming from another page
    navigate("/", {
      state: {
        scrollTo: "reviews-section",
      },
    });
  };
  // ============================================
  // WHATSAPP
  // ============================================
  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/447869416748",
      "_blank",
      "noopener,noreferrer"
    );

    closeMenu();
  };

  const handleCall = () => {
    window.location.href = "tel:+447869416748";
    closeMenu();
  };

  // ============================================
  // SIGN IN
  // ============================================
  const handleSignIn = () => {
    navigate("/signin");
    closeMenu();
  };

  // ============================================
  // DASHBOARD
  // ============================================
  const handleDashboard = () => {
    navigate("/admin");
    closeMenu();
  };

  // ============================================
  // LOGOUT
  // ============================================
  const handleLogout = () => {
    logout();
    closeMenu();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <nav className="sticky top-0 z-1000 w-full overflow-x-clip bg-[#E20613] text-white">

        <div className="mx-auto flex h-20 w-[92%] max-w-360 items-center justify-center max-md:h-14.75 max-md:w-full max-md:px-4 md:max-lg:w-[94%] md:max-lg:px-2">

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}
          <div className="hidden items-center gap-2 md:flex md:max-lg:gap-0.5">

            {/* LOGO */}
            <Link
              to="/"
              onClick={() => {
                closeMenu();

                window.scrollTo({
                  top: 0,
                  behavior: "instant",
                });
              }}
              className="mr-10 flex shrink-0 items-center md:max-lg:mr-5"
            >
              <img
                src="/Khan_moves_new_logo.png"
                alt="Khan Moves"
                className="h-8.75 w-auto object-contain"
              />
            </Link>


            {/* =================================================
                SERVICES
            ================================================= */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >

              <button
                type="button"
                onClick={() => setServicesOpen((value) => !value)}
                className="flex items-center gap-1 px-5 text-[14px] font-semibold text-white transition-opacity duration-200 hover:opacity-75 md:max-lg:px-3"
              >
                Services

                <FiChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""
                    }`}
                />
              </button>


              {/* SERVICES DROPDOWN */}
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 0.97,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    className="absolute left-1/2 top-full z-1100 mt-3 w-55 -translate-x-1/2 overflow-hidden rounded-lg bg-white shadow-xl"
                  >

                    {/* Small top arrow */}
                    <div className="absolute left-1/2 -top-1.5 h-3 w-3 -translate-x-1/2 rotate-45 bg-white" />

                    <div className="relative py-2">

                      {services.length > 0 ? (
                        services.map((service, index) => (
                          <motion.button
                            key={service._id || service.slug || index}
                            type="button"
                            onClick={() =>
                              handleServiceClick(service.slug)
                            }
                            whileHover={{
                              x: 4,
                            }}
                            className="block w-full border-b border-gray-100 px-5 py-3 text-left text-[13px] font-medium text-[#555555] transition-colors last:border-b-0 hover:bg-[#FFEA00]"
                          >
                            {service.label}
                          </motion.button>
                        ))
                      ) : (
                        <div className="px-5 py-3 text-[12px] text-gray-400">
                          Loading services...
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>


            {/* BLOGS */}
            <button
              type="button"
              onClick={handleBlogsClick}
              className="px-5 text-[14px] font-semibold text-white transition-opacity duration-200 hover:opacity-75 md:max-lg:px-3"
            >
              Blogs
            </button>


            <button
              type="button"
              onClick={handleReviewsClick}
              className="px-5 text-[14px] font-semibold text-white transition-opacity duration-200 hover:opacity-75 md:max-lg:px-3"
            >
              Reviews
            </button>


            {/* SIGN IN */}
            {!isAuthenticated && (
              <button
                type="button"
                onClick={handleSignIn}
                className="px-5 text-[14px] font-semibold text-white transition-opacity duration-200 hover:opacity-75 md:max-lg:px-3"
              >
                Sign In
              </button>
            )}


            {/* LOGOUT */}
            {isAuthenticated && !isAdmin && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 text-[14px] font-semibold text-white transition-opacity duration-200 hover:opacity-75"
              >
                <FiLogOut size={14} />
                Logout
              </button>
            )}


            {/* DASHBOARD */}
            {isAuthenticated && isAdmin && (
              <button
                type="button"
                onClick={handleDashboard}
                className="flex items-center gap-1.5 px-3 text-[14px] font-semibold text-white transition-opacity duration-200 hover:opacity-75"
              >
                <FiGrid size={14} />
                Dashboard
              </button>
            )}


            {/* WHATSAPP */}
            <button
              type="button"
              onClick={handleWhatsApp}
              aria-label="WhatsApp"
              className="relative top-0.5 ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hover:drop-shadow-[0_0_8px_rgba(255,234,0,0.8)] md:max-lg:ml-2"
            >
              <img
                src="/whats_app_icon.svg"
                alt="WhatsApp"
                className="h-8 w-8 object-contain"
              />
            </button>


            {/* CONTACT NUMBER */}
            <button
              type="button"
              onClick={handleCall}
              aria-label="Call 07869416748"
              className="ml-4 flex h-7 shrink-0 items-center overflow-hidden rounded-md bg-white text-black transition-all duration-200 hover:scale-105 hover:shadow-[0_0_8px_rgba(255,234,0,0.6)] md:max-lg:ml-2"
            >
              <span className="px-2 text-[10px] font-bold leading-none">
                07869416748
              </span>

              <span className="flex h-7 w-7 items-center justify-center bg-[#FFEA00]">
                <img
                  src="/contact_person.svg"
                  alt="Contact"
                  className="h-5 w-5 object-contain"
                />
              </span>
            </button>

          </div>


          {/* =================================================
              MOBILE HEADER
          ================================================= */}
          <div className="flex w-full items-center justify-between md:hidden">

            {/* LOGO */}
            <Link
              to="/"
              onClick={() => {
                closeMenu();

                window.scrollTo({
                  top: 0,
                  behavior: "instant",
                });
              }}
              className="flex shrink-0 items-center"
            >
              <img
                src="/Khan_moves_new_logo.png"
                alt="Khan Moves"
                className="h-6 w-auto object-contain"
              />
            </Link>


            {/* HAMBURGER */}
            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              aria-label="Toggle navigation"
              className="relative flex h-10 w-10 items-center justify-center"
            >
              <FiMenu
                size={24}
                strokeWidth={2.8}
                className={`absolute transition-all duration-200 ${isOpen
                  ? "rotate-90 scale-50 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
                  }`}
              />

              <FiX
                size={28}
                strokeWidth={2.8}
                className={`absolute transition-all duration-200 ${isOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-50 opacity-0"
                  }`}
              />
            </button>

          </div>

        </div>


        {/* =================================================
            MOBILE MENU
        ================================================= */}
        <AnimatePresence>
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
              className="overflow-hidden bg-[#E20613] md:hidden"
            >

              <div className="mx-auto w-[92%] pb-5 pt-2">

                {/* SERVICES */}
                <div className="border-b border-white/20">

                  <button
                    type="button"
                    onClick={() =>
                      setServicesOpen((value) => !value)
                    }
                    className="flex w-full items-center justify-between py-3 text-left text-[15px] font-semibold text-white"
                  >
                    <span>Services</span>

                    <FiChevronDown
                      size={18}
                      className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>


                  {/* MOBILE SERVICES */}
                  <AnimatePresence initial={false}>
                    {servicesOpen && (
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
                          duration: 0.25,
                        }}
                        className="overflow-hidden"
                      >

                        <div className="mb-2 rounded-md bg-white/10 py-1">

                          {services.length > 0 ? (
                            services.map((service, index) => (
                              <motion.button
                                key={
                                  service._id ||
                                  service.slug ||
                                  index
                                }
                                type="button"
                                onClick={() =>
                                  handleServiceClick(service.slug)
                                }
                                whileTap={{
                                  scale: 0.98,
                                }}
                                className="block w-full px-4 py-2.5 text-left text-[13px] font-medium text-white transition-colors hover:bg-white/10"
                              >
                                {service.label}
                              </motion.button>
                            ))
                          ) : (
                            <div className="px-4 py-2.5 text-[12px] text-white/60">
                              Loading services...
                            </div>
                          )}

                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>


                {/* BLOGS */}
                <button
                  type="button"
                  onClick={handleBlogsClick}
                  className="block w-full border-b border-white/20 py-3 text-left text-[15px] font-semibold text-white"
                >
                  Blogs
                </button>


                {/* REVIEWS */}
                <button
                  type="button"
                  onClick={handleReviewsClick}
                  className="block w-full border-b border-white/20 py-3 text-left text-[15px] font-semibold text-white"
                >
                  Reviews
                </button>


                {/* SIGN IN */}
                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={handleSignIn}
                    className="block w-full border-b border-white/20 py-3 text-left text-[15px] font-semibold text-white"
                  >
                    Sign In
                  </button>
                )}


                {/* LOGOUT */}
                {isAuthenticated && !isAdmin && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-b border-white/20 py-3 text-left text-[15px] font-semibold text-white"
                  >
                    <FiLogOut size={16} />
                    Logout
                  </button>
                )}


                {/* DASHBOARD */}
                {isAuthenticated && isAdmin && (
                  <button
                    type="button"
                    onClick={handleDashboard}
                    className="flex w-full items-center gap-2 border-b border-white/20 py-3 text-left text-[15px] font-semibold text-white"
                  >
                    <FiGrid size={16} />
                    Dashboard
                  </button>
                )}


                {/* WHATSAPP */}
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex w-full items-center gap-3 border-b border-white/20 py-3 text-left text-[15px] font-semibold text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-[5px] bg-[#FFEA00]">
                    <img
                      src="/whats_app_icon.svg"
                      alt="WhatsApp"
                      className="h-5 w-5 object-contain"
                    />
                  </span>

                  WhatsApp
                </button>


                {/* CONTACT */}
                <button
                  type="button"
                  onClick={handleCall}
                  className="mt-4 flex h-9.5 w-fit items-center justify-start overflow-hidden rounded-[7px] bg-white text-black"
                >
                  <span className="px-3 text-[13px] font-bold">
                    07869416748
                  </span>

                  <span className="flex h-9.5 w-9.5 shrink-0 items-center justify-center bg-[#FFEA00]">
                    <img
                      src="/contact_person.svg"
                      alt="Contact"
                      className="h-6.5 w-6.5 object-contain"
                    />
                  </span>
                </button>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </nav>
    </>
  );
}