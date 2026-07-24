import React, { useEffect, useState } from "react";
import { FiMessageSquare, FiLink, FiCopy, FiTrash2, FiEdit2, FiPlus, FiX } from "react-icons/fi";
import { FaCalculator } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../../api/api";

function SectionLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-12 h-12 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C0392B] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#C0392B]/20 animate-pulse" />
                </div>
            </div>
            <p className="text-sm font-semibold text-gray-400">
                Loading tools...
            </p>
        </div>
    );
}

export default function Tools() {
    const [calculatorBase, setCalculatorBase] = useState("");
    const [calculatorDiscount, setCalculatorDiscount] = useState("");
    const [links, setLinks] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [linkModal, setLinkModal] = useState(false);
    const [messageModal, setMessageModal] = useState(false);
    const [editLink, setEditLink] = useState(null);
    const [editMessage, setEditMessage] = useState(null);
    const [savingLink, setSavingLink] = useState(false);
    const [savingMessage, setSavingMessage] = useState(false);
    const [deleteModal, setDeleteModal] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [linkForm, setLinkForm] = useState({
        name: "",
        link: ""
    });

    const [messageForm, setMessageForm] = useState({
        title: "",
        text: ""
    });

    const basePrice = Math.max(
        0,
        Number(calculatorBase) || 0
    );

    const discount = Math.max(
        0,
        Number(calculatorDiscount) || 0
    );

    const final = Math.max(
        0,
        basePrice - discount
    );

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        try {
            setLoading(true);

            const [linksRes, messagesRes] = await Promise.all([
                api.get("/tools/links"),
                api.get("/tools/messages")
            ]);

            setLinks(linksRes.data?.data || []);
            setMessages(messagesRes.data?.data || []);

        } catch (err) {
            toast.error("Failed to load tools");
        } finally {
            setLoading(false);
        }
    };

    const saveLink = async () => {
        try {
            setSavingLink(true);

            if (editLink) {
                await api.patch(`/tools/links/${editLink._id}`, linkForm);
                toast.success("Link updated");
            } else {
                await api.post("/tools/links", linkForm);
                toast.success("Link added");
            }

            setLinkModal(false);
            setEditLink(null);
            setLinkForm({ name: "", link: "" });
            fetchTools();

        } catch {
            toast.error("Failed to save link");
        } finally {
            setSavingLink(false);
        }
    };

    const saveMessage = async () => {
        try {
            setSavingMessage(true);

            if (editMessage) {
                await api.patch(`/tools/messages/${editMessage._id}`, messageForm);
                toast.success("Message updated");
            } else {
                await api.post("/tools/messages", messageForm);
                toast.success("Message added");
            }

            setMessageModal(false);
            setEditMessage(null);
            setMessageForm({ title: "", text: "" });
            fetchTools();

        } catch {
            toast.error("Failed to save message");
        } finally {
            setSavingMessage(false);
        }
    };

    const confirmDelete = async () => {
        try {
            setDeleting(true);

            if (deleteModal.type === "link") {
                await api.delete(`/tools/links/${deleteModal.id}`);
                toast.success("Link deleted");
            }

            if (deleteModal.type === "message") {
                await api.delete(`/tools/messages/${deleteModal.id}`);
                toast.success("Message deleted");
            }

            setDeleteModal(null);
            fetchTools();

        } catch {
            toast.error("Delete failed");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <SectionLoader />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
                Quick Tools
            </h1>

            <p className="text-gray-500 mb-8">
                Useful tools for daily operations.
            </p>

            <div className="grid lg:grid-cols-2 gap-8">

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <FaCalculator className="text-[#C0392B]" size={24} />
                        <h2 className="text-xl font-bold">
                            Price Calculator
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                                Total Price
                            </label>

                            <div className="relative">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    £
                                </span>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={calculatorBase}
                                    onChange={(event) => {
                                        const value = event.target.value;

                                        if (
                                            value === "" ||
                                            Number(value) >= 0
                                        ) {
                                            setCalculatorBase(value);
                                        }
                                    }}
                                    placeholder="Enter total price"
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-8 pr-4 outline-none transition focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/10"
                                />
                            </div>

                            <p className="mt-1 text-xs text-gray-400">
                                Enter the current total booking price.
                            </p>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                                Discount
                            </label>

                            <div className="relative">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    £
                                </span>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={calculatorDiscount}
                                    onChange={(event) => {
                                        const value = event.target.value;

                                        if (
                                            value === "" ||
                                            Number(value) >= 0
                                        ) {
                                            setCalculatorDiscount(value);
                                        }
                                    }}
                                    placeholder="Enter discount amount"
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-8 pr-4 outline-none transition focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/10"
                                />
                            </div>

                            <p className="mt-1 text-xs text-gray-400">
                                This amount will be deducted from the total price.
                            </p>
                        </div>

                        <div className="p-4 bg-red-50 rounded-lg">
                            <p className="text-xs text-red-600">
                                Final Price
                            </p>
                            <p className="text-3xl font-bold text-[#C0392B]">
                                £{final.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded-lg border border-gray-200 p-6">

                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <FiLink className="text-[#C0392B]" size={24} />
                            <h2 className="text-xl font-bold">
                                Quick Links
                            </h2>
                        </div>

                        <button
                            onClick={() => {
                                setEditLink(null);
                                setLinkForm({ name: "", link: "" });
                                setLinkModal(true);
                            }}
                            className="bg-[#C0392B] text-white px-3 py-2 rounded-lg"
                        >
                            <FiPlus />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {links.map(link => (
                            <div
                                key={link._id}
                                className="border rounded-lg p-3"
                            >
                                <div className="flex justify-between">
                                    <a
                                        href={link.link}
                                        target="_blank"
                                        className="font-semibold text-[#C0392B]"
                                    >
                                        {link.name}
                                    </a>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditLink(link);
                                                setLinkForm({
                                                    name: link.name,
                                                    link: link.link
                                                });
                                                setLinkModal(true);
                                            }}
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button onClick={() => setDeleteModal({ type: "link", id: link._id })}>
                                            <FiTrash2 className="text-red-600" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500">
                                    {link.link}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>

            </div>


            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">

                <div className="flex justify-between items-center mb-6">

                    <div className="flex items-center gap-2">
                        <FiMessageSquare
                            className="text-[#C0392B]"
                            size={24}
                        />

                        <h2 className="text-xl font-bold">
                            Quick Messages
                        </h2>
                    </div>

                    <button
                        onClick={() => {
                            setEditMessage(null);
                            setMessageForm({ title: "", text: "" });
                            setMessageModal(true);
                        }}
                        className="bg-[#C0392B] text-white px-3 py-2 rounded-lg"
                    >
                        <FiPlus />
                    </button>

                </div>


                <div className="grid sm:grid-cols-2 gap-4">

                    {messages.map(msg => (
                        <div
                            key={msg._id}
                            className="border rounded-lg p-4"
                        >

                            <div className="flex justify-between">
                                <h3 className="font-semibold">
                                    {msg.title}
                                </h3>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditMessage(msg);
                                            setMessageForm({
                                                title: msg.title,
                                                text: msg.text
                                            });
                                            setMessageModal(true);
                                        }}
                                    >
                                        <FiEdit2 />
                                    </button>

                                    <button onClick={() => setDeleteModal({ type: "message", id: msg._id })}>
                                        <FiTrash2 className="text-red-600" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 italic my-3">
                                "{msg.text}"
                            </p>

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(msg.text);
                                    toast.success("Message copied");
                                }}
                                className="flex items-center gap-2 text-[#C0392B] font-semibold text-sm"
                            >
                                <FiCopy />
                                Copy
                            </button>

                        </div>
                    ))}

                </div>

            </div>


            {linkModal && (
                <Modal title="Quick Link" close={() => setLinkModal(false)}>
                    <input
                        value={linkForm.name}
                        onChange={e => setLinkForm({ ...linkForm, name: e.target.value })}
                        placeholder="Name"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C0392B] transition"
                    />

                    <input
                        value={linkForm.link}
                        onChange={e => setLinkForm({ ...linkForm, link: e.target.value })}
                        placeholder="Link"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C0392B] transition"
                    />

                    <button
                        onClick={saveLink}
                        disabled={savingLink}
                        className="w-full flex items-center justify-center gap-2 bg-[#C0392B] text-white rounded-xl py-3 font-semibold hover:bg-red-800 transition disabled:opacity-60"
                    >
                        {savingLink ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Link"
                        )}
                    </button>
                </Modal>
            )}


            {messageModal && (
                <Modal title="Quick Message" close={() => setMessageModal(false)}>

                    <input
                        value={messageForm.title}
                        onChange={e => setMessageForm({ ...messageForm, title: e.target.value })}
                        placeholder="Title"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C0392B] transition"
                    />

                    <textarea
                        value={messageForm.text}
                        onChange={e => setMessageForm({ ...messageForm, text: e.target.value })}
                        placeholder="Message"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C0392B] transition"
                    />

                    <button
                        onClick={saveMessage}
                        disabled={savingMessage}
                        className="w-full flex items-center justify-center gap-2 bg-[#C0392B] text-white rounded-xl py-3 font-semibold hover:bg-red-800 transition disabled:opacity-60"
                    >
                        {savingMessage ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Message"
                        )}
                    </button>

                </Modal>
            )}

            {deleteModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                        <h3 className="text-xl font-bold mb-2">
                            Confirm Delete
                        </h3>

                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to delete this item? This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModal(null)}
                                className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold disabled:opacity-60"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}


function Modal({ title, children, close }) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100">
                <div className="flex items-center justify-between px-6 py-5 border-b">
                    <h3 className="text-xl font-bold text-[#1a1a1a]">
                        {title}
                    </h3>

                    <button
                        onClick={close}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
}