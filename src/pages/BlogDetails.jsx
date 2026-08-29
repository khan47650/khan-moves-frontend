import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import api from "../api/api";

export default function BlogDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);

                const response = await api.get(`/blogs/${id}`);

                setBlog(response.data.blog || response.data);
            } catch (error) {
                console.error("Failed to fetch blog:", error);
                setError("Unable to load this blog.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FFEA00]">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#E20613]/20 border-t-[#E20613]" />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFEA00] px-5 text-center">
                <h1 className="text-xl font-bold text-[#555555]">
                    {error || "Blog not found"}
                </h1>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#E20613] px-5 py-2.5 text-sm font-semibold text-white"
                >
                    <FiArrowLeft size={17} />
                    Go Back
                </button>
            </div>
        );
    }

    const imageUrl = blog.image?.url || blog.image;
    const blogText = blog.blogText || "";

    return (
        <main className="min-h-screen bg-[#FFEA00]">

            {/* BLOG AREA */}
            <section className="mx-auto w-full max-w-195 px-4 pb-10 pt-4 md:px-0 md:pb-14 md:pt-5">

                {/* BLOG CARD */}
                <motion.article
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.55,
                        ease: "easeOut",
                    }}
                    className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_35px_rgba(0,0,0,0.12)]"
                >

                    {/* IMAGE */}
                    <div className="relative flex h-52 w-full items-center justify-center overflow-hidden bg-[#FFEA00] sm:h-64 md:h-80">

                        {/* BACK BUTTON */}
                        <motion.button
                            type="button"
                            onClick={() => navigate(-1)}
                            whileHover={{
                                scale: 1.08,
                            }}
                            whileTap={{
                                scale: 0.94,
                            }}
                            className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#E20613] shadow-lg backdrop-blur-sm transition hover:bg-white md:left-5 md:top-5 md:h-11 md:w-11"
                            aria-label="Back to blogs"
                        >
                            <FiArrowLeft size={19} />
                        </motion.button>

                        <img
                            src={imageUrl}
                            alt={blog.title}
                            className="h-full w-full object-contain p-4 md:p-6"
                        />
                    </div>


                    {/* ARTICLE CONTENT */}
                    <div className="px-5 py-6 sm:px-7 md:px-10 md:py-8">

                        {/* META */}
                        <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-gray-500 md:text-sm">

                            {blog.createdAt && (
                                <span className="flex items-center gap-1.5">
                                    <FiCalendar size={14} />

                                    {new Date(
                                        blog.createdAt
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            )}

                            <span className="flex items-center gap-1.5">
                                <FiClock size={14} />
                                5 min read
                            </span>

                        </div>


                        {/* TITLE */}
                        <h1 className="max-w-180 text-2xl font-bold leading-tight text-[#333333] sm:text-3xl md:text-[38px]">
                            {blog.title}
                        </h1>


                        {/* RED ACCENT */}
                        <div className="my-5 h-1 w-14 rounded-full bg-[#E20613] md:my-6 md:w-16" />


                        {/* FULL BLOG */}
                        {blogText ? (
                            <div className="whitespace-pre-line text-[15px] leading-7 text-[#555555] md:text-[17px] md:leading-8">
                                {blogText}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">
                                No blog content available.
                            </p>
                        )}

                    </div>

                </motion.article>

            </section>

        </main>
    );
}