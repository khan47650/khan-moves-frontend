import React, { useEffect, useState } from "react";
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiX,
    FiUpload,
    FiImage,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../../api/api";

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [deleteBlog, setDeleteBlog] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        blogText: "",
        image: null,
    });

    const [previewImage, setPreviewImage] = useState(null);


    // ==========================================
    // GET ALL BLOGS
    // ==========================================
    const fetchBlogs = async () => {
        try {
            setLoading(true);

            const response = await api.get("/blogs/all");

            if (response.data.success) {
                setBlogs(response.data.blogs);
            }

        } catch (error) {
            console.error("Fetch blogs error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch blogs"
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchBlogs();
    }, []);


    // ==========================================
    // OPEN ADD MODAL
    // ==========================================
    const openAddModal = () => {
        setEditingBlog(null);

        setFormData({
            title: "",
            blogText: "",
            image: null,
        });

        setPreviewImage(null);
        setShowModal(true);
    };


    // ==========================================
    // OPEN EDIT MODAL
    // ==========================================
    const openEditModal = (blog) => {
        setEditingBlog(blog);

        setFormData({
            title: blog.title || "",
            blogText: blog.blogText || "",
            image: null,
        });

        setPreviewImage(blog.image?.url || null);
        setShowModal(true);
    };


    // ==========================================
    // CLOSE MODAL
    // ==========================================
    const closeModal = () => {
        if (submitting) return;

        setShowModal(false);
        setEditingBlog(null);

        setFormData({
            title: "",
            blogText: "",
            image: null,
        });

        setPreviewImage(null);
    };


    // ==========================================
    // INPUT CHANGE
    // ==========================================
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // ==========================================
    // IMAGE CHANGE
    // ==========================================
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            image: file,
        }));

        setPreviewImage(URL.createObjectURL(file));
    };


    // ==========================================
    // ADD / UPDATE BLOG
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Blog title is required.");
            return;
        }

        if (!formData.blogText.trim()) {
            toast.error("Blog text is required.");
            return;
        }

        if (!editingBlog && !formData.image) {
            toast.error("Blog image is required.");
            return;
        }

        try {
            setSubmitting(true);

            const data = new FormData();

            data.append("title", formData.title);
            data.append("blogText", formData.blogText);

            if (formData.image) {
                data.append("image", formData.image);
            }


            if (editingBlog) {

                const response = await api.put(`/blogs/${editingBlog._id}`, data);

                if (response.data.success) {
                    toast.success("Blog updated successfully.");
                }

            } else {

                const response = await api.post("/blogs/add", data);

                if (response.data.success) {
                    toast.success("Blog added successfully.");
                }
            }

            closeModal();
            fetchBlogs();

        } catch (error) {
            console.error("Save blog error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to save blog."
            );

        } finally {
            setSubmitting(false);
        }
    };


    // ==========================================
    // DELETE BLOG
    // ==========================================
    const openDeleteModal = (blog) => {
        setDeleteBlog(blog);
    };

    const closeDeleteModal = () => {
        if (deleting) return;

        setDeleteBlog(null);
    };

    const handleDelete = async () => {
        if (!deleteBlog) return;

        try {
            setDeleting(true);

            const response = await api.delete(
                `/blogs/${deleteBlog._id}`
            );

            if (response.data.success) {
                toast.success("Blog deleted successfully.");
                setDeleteBlog(null);
                fetchBlogs();
            }
        } catch (error) {
            console.error("Delete blog error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to delete blog."
            );
        } finally {
            setDeleting(false);
        }
    };


    return (
        <div className="w-full">

            {/* ==========================================
                HEADER
            ========================================== */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Blogs
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your website blog posts.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="
                        inline-flex items-center justify-center
                        gap-2 rounded-lg
                        bg-[#C0392B]
                        px-5 py-3
                        text-sm font-semibold text-white
                        shadow-sm
                        transition
                        hover:bg-[#A93226]
                        active:scale-[0.98]
                    "
                >
                    <FiPlus size={18} />
                    Add Blog
                </button>

            </div>


            {/* ==========================================
                LOADING
            ========================================== */}
            {loading ? (

                <div className="flex min-h-75 items-center justify-center">
                    <div className="
                        h-10 w-10
                        animate-spin
                        rounded-full
                        border-4
                        border-gray-200
                        border-t-[#C0392B]
                    " />
                </div>

            ) : blogs.length === 0 ? (

                /* ==========================================
                   EMPTY STATE
                ========================================== */
                <div className="
                    flex min-h-87.5
                    flex-col items-center justify-center
                    rounded-xl
                    border border-dashed border-gray-300
                    bg-white
                    p-8
                    text-center
                ">

                    <div className="
                        mb-4 flex h-16 w-16
                        items-center justify-center
                        rounded-full bg-gray-100
                    ">
                        <FiImage
                            size={28}
                            className="text-gray-400"
                        />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800">
                        No blogs yet
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-gray-500">
                        Start publishing content by creating your first blog post.
                    </p>

                    <button
                        onClick={openAddModal}
                        className="
                            mt-5 inline-flex items-center gap-2
                            rounded-lg bg-[#C0392B]
                            px-5 py-2.5
                            text-sm font-semibold text-white
                            hover:bg-[#A93226]
                        "
                    >
                        <FiPlus size={17} />
                        Create Blog
                    </button>

                </div>

            ) : (

                /* ==========================================
                   BLOG GRID
                ========================================== */
                <div className=" grid grid-cols-1 gap-5 md:grid-cols-2  xl:grid-cols-3 ">

                    {blogs.map((blog) => (

                        <div
                            key={blog._id}
                            className="
                                        w-full
                                        max-w-sm
                                        overflow-hidden
                                        rounded-xl
                                        border border-gray-200
                                        bg-white
                                        shadow-sm
                                        transition
                                        hover:-translate-y-1
                                        hover:shadow-md
                                    "
                        >

                            {/* IMAGE */}
                            <div className="relative h-40 w-full overflow-hidden bg-gray-100">

                                {blog.image?.url ? (
                                    <img
                                        src={blog.image.url}
                                        alt={blog.title}
                                        className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-500
                            hover:scale-105
                        "
                                    />
                                ) : (
                                    <div className="
                        flex h-full
                        w-full
                        items-center
                        justify-center
                        text-gray-400
                    ">
                                        <FiImage size={34} />
                                    </div>
                                )}

                            </div>


                            {/* CONTENT */}
                            <div className="p-4">

                                <h2 className="
                    line-clamp-2
                    text-base
                    font-bold
                    leading-6
                    text-gray-900
                ">
                                    {blog.title}
                                </h2>

                                <p className="
                    mt-1.5
                    line-clamp-2
                    text-sm
                    leading-5
                    text-gray-500
                ">
                                    {blog.blogText}
                                </p>


                                {/* ACTIONS */}
                                <div className="
                    mt-4
                    flex
                    items-center
                    justify-end
                    gap-2
                    border-t
                    border-gray-100
                    pt-3
                ">

                                    <button
                                        onClick={() => openEditModal(blog)}
                                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            border border-gray-200
                            px-3 py-1.5
                            text-xs
                            font-medium
                            text-gray-700
                            transition
                            hover:bg-gray-50
                        "
                                    >
                                        <FiEdit2 size={14} />
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => openDeleteModal(blog)}
                                        className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-lg
                                                border border-red-100
                                                px-3 py-1.5
                                                text-xs
                                                font-medium
                                                text-red-600
                                                transition
                                                hover:bg-red-50
                                            "
                                    >
                                        <FiTrash2 size={14} />
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}
                </div>

            )}


            {/* ==========================================
                ADD / EDIT MODAL
            ========================================== */}
            {showModal && (

                <div className="
                    fixed inset-0 z-100
                    flex items-center justify-center
                    bg-black/50
                    p-4
                    backdrop-blur-sm
                ">

                    <div className="
                        flex max-h-[92vh]
                        w-full max-w-2xl
                        flex-col
                        overflow-hidden
                        rounded-2xl
                        bg-white
                        shadow-2xl
                    ">

                        {/* MODAL HEADER */}
                        <div className="
                            flex items-center
                            justify-between
                            border-b border-gray-200
                            px-6 py-5
                        ">

                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingBlog
                                        ? "Edit Blog"
                                        : "Add New Blog"
                                    }
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {editingBlog
                                        ? "Update your blog content."
                                        : "Create a new blog post."
                                    }
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                disabled={submitting}
                                className="
                                    flex h-9 w-9
                                    items-center justify-center
                                    rounded-lg
                                    text-gray-500
                                    transition
                                    hover:bg-gray-100
                                    hover:text-gray-800
                                "
                            >
                                <FiX size={20} />
                            </button>

                        </div>


                        {/* MODAL BODY */}
                        <form
                            onSubmit={handleSubmit}
                            className="overflow-y-auto"
                        >

                            <div className="space-y-6 p-6">

                                {/* IMAGE */}
                                <div>

                                    <label className="
                                        mb-2 block
                                        text-sm font-semibold
                                        text-gray-800
                                    ">
                                        Blog Image
                                        {!editingBlog && (
                                            <span className="text-red-500">
                                                {" "}*
                                            </span>
                                        )}
                                    </label>

                                    <label className="
                                        relative flex
                                        min-h-55
                                        cursor-pointer
                                        flex-col
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        rounded-xl
                                        border-2
                                        border-dashed
                                        border-gray-300
                                        bg-gray-50
                                        transition
                                        hover:border-[#C0392B]
                                        hover:bg-red-50/20
                                    ">

                                        {previewImage ? (

                                            <img
                                                src={previewImage}
                                                alt="Blog preview"
                                                className="
                                                    absolute inset-0
                                                    h-full w-full
                                                    object-cover
                                                "
                                            />

                                        ) : (

                                            <div className="text-center">

                                                <div className="
                                                    mx-auto mb-3
                                                    flex h-12 w-12
                                                    items-center justify-center
                                                    rounded-full
                                                    bg-white
                                                    shadow-sm
                                                ">
                                                    <FiUpload
                                                        size={22}
                                                        className="text-gray-500"
                                                    />
                                                </div>

                                                <p className="
                                                    text-sm
                                                    font-medium
                                                    text-gray-700
                                                ">
                                                    Click to upload image
                                                </p>

                                                <p className="
                                                    mt-1 text-xs
                                                    text-gray-400
                                                ">
                                                    PNG, JPG or WEBP • Max 5MB
                                                </p>

                                            </div>

                                        )}

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />

                                    </label>

                                    {editingBlog && (
                                        <p className="
                                            mt-2 text-xs
                                            text-gray-400
                                        ">
                                            Leave the image unchanged if you don't want
                                            to replace it.
                                        </p>
                                    )}

                                </div>


                                {/* TITLE */}
                                <div>

                                    <label className="
                                        mb-2 block
                                        text-sm font-semibold
                                        text-gray-800
                                    ">
                                        Blog Title
                                        <span className="text-red-500"> *</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter blog title"
                                        className="
                                            w-full rounded-lg
                                            border border-gray-300
                                            px-4 py-3
                                            text-sm text-gray-900
                                            outline-none
                                            transition
                                            focus:border-[#C0392B]
                                            focus:ring-2
                                            focus:ring-[#C0392B]/10
                                        "
                                    />

                                </div>


                                {/* BLOG TEXT */}
                                <div>

                                    <label className="
                                        mb-2 block
                                        text-sm font-semibold
                                        text-gray-800
                                    ">
                                        Blog Text
                                        <span className="text-red-500"> *</span>
                                    </label>

                                    <textarea
                                        name="blogText"
                                        value={formData.blogText}
                                        onChange={handleInputChange}
                                        rows={9}
                                        placeholder="Write your blog content here..."
                                        className="
                                            w-full resize-y
                                            rounded-lg
                                            border border-gray-300
                                            px-4 py-3
                                            text-sm leading-6
                                            text-gray-900
                                            outline-none
                                            transition
                                            focus:border-[#C0392B]
                                            focus:ring-2
                                            focus:ring-[#C0392B]/10
                                        "
                                    />

                                </div>

                            </div>


                            {/* MODAL FOOTER */}
                            <div className="
                                flex flex-col-reverse
                                gap-3 border-t
                                border-gray-200
                                bg-gray-50
                                px-6 py-4
                                sm:flex-row
                                sm:justify-end
                            ">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                    className="
                                        rounded-lg
                                        border border-gray-300
                                        bg-white
                                        px-5 py-2.5
                                        text-sm font-medium
                                        text-gray-700
                                        transition
                                        hover:bg-gray-100
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-lg
                                        bg-[#C0392B]
                                        px-5 py-2.5
                                        text-sm font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#A93226]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >

                                    {submitting ? (
                                        <>
                                            <span className="
                                                h-4 w-4
                                                animate-spin
                                                rounded-full
                                                border-2
                                                border-white/40
                                                border-t-white
                                            " />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FiPlus size={17} />
                                            {editingBlog
                                                ? "Update Blog"
                                                : "Publish Blog"
                                            }
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* DELETE CONFIRMATION MODAL */}
            {deleteBlog && (
                <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

                        {/* MODAL CONTENT */}
                        <div className="p-6">

                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                                <FiTrash2 size={22} className="text-red-600" />
                            </div>

                            <h2 className="text-xl font-bold text-gray-900">
                                Delete Blog?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Are you sure you want to delete
                                <span className="font-semibold text-gray-700">
                                    {" "}"{deleteBlog.title}"
                                </span>
                                ? This action cannot be undone.
                            </p>

                        </div>

                        {/* MODAL ACTIONS */}
                        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">

                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                disabled={deleting}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FiTrash2 size={15} />
                                        Delete Blog
                                    </>
                                )}
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}