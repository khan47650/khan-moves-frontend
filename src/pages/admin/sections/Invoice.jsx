import React, { useEffect, useRef, useState } from "react";
import { FiDownload, FiPackage, FiSearch, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../../api/api";
import InvoicePreview from "../../../components/admin/InvoicePreview";


const STATUS_STYLES = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    in_progress: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700"
};

const SectionLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-12 h-12 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C0392B] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#C0392B]/20 animate-pulse" />
                </div>
            </div>
            <p className="text-sm font-semibold text-gray-400">
                Loading invoices...
            </p>
        </div>
    );
};

const formatServiceName = (value = "") => {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default function Invoice() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [invoiceBasePrice, setInvoiceBasePrice] = useState(0);

    const [invoiceData, setInvoiceData] = useState({
        notes: "",
        discount: "",
        tax: ""
    });

    const invoiceRef = useRef(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get("/bookings/invoices");
            setBookings(response.data?.data || []);
        } catch (err) {
            console.error("Fetch invoice bookings error:", err);
            toast.error(
                err.response?.data?.message || "Failed to load bookings"
            );
        } finally {
            setLoading(false);
        }
    };
    const handleSelectBooking = (booking) => {
        setSelectedBooking(booking);

        // Database ki current totalPrice hi new base hogi
        setInvoiceBasePrice(
            Number(booking.totalPrice) || 0
        );

        setInvoiceData({
            notes: booking.invoiceNotes || "",
            discount: "",
            tax: ""
        });
    };

    const filteredBookings = bookings.filter((booking) => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) return true;

        return (
            booking.bookingRef?.toLowerCase().includes(search) ||
            booking.customer?.name?.toLowerCase().includes(search) ||
            booking.customer?.phone?.toLowerCase().includes(search) ||
            booking.customer?.email?.toLowerCase().includes(search) ||
            booking.serviceType?.toLowerCase().includes(search)
        );
    });

    const basePrice = Math.max(
        0,
        Number(invoiceBasePrice) || 0
    );

    const discount = Math.max(
        0,
        Number(invoiceData.discount) || 0
    );

    const tax = Math.max(
        0,
        Number(invoiceData.tax) || 0
    );

    const finalTotal = Math.max(
        0,
        Math.round(
            (basePrice - discount + tax) * 100
        ) / 100
    );


    const previewBooking = selectedBooking
        ? {
            ...selectedBooking,

            // InvoicePreview ko adjustment se pehle wali price milegi
            totalPrice: basePrice
        }
        : null;

    const handleDownload = async () => {
        if (!selectedBooking) {
            toast.error("Please select a booking");
            return;
        }

        if (!invoiceRef.current) {
            toast.error("Invoice preview is not ready");
            return;
        }

        const priceToSave = Math.max(
            0,
            Math.round(finalTotal * 100) / 100
        );

        const printWindow = window.open(
            "",
            "_blank",
            "width=900,height=800"
        );

        if (!printWindow) {
            toast.error("Please allow popups to download invoice");
            return;
        }

        try {
            setDownloading(true);

            const response = await api.patch(
                `/bookings/${selectedBooking._id}/price`,
                {
                    finalPrice: priceToSave,
                    discount,
                    tax,
                    notes: invoiceData.notes
                }
            );

            if (!response.data?.success || !response.data?.data) {
                throw new Error(
                    response.data?.message ||
                    "Booking price was not updated"
                );
            }

            const updatedBooking = response.data.data;

            // Database-returned booking me totalPrice ab final price hai
            setSelectedBooking(updatedBooking);

            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking._id === updatedBooking._id
                        ? updatedBooking
                        : booking
                )
            );

            // Preview ko render hone ka time
            await new Promise((resolve) =>
                setTimeout(resolve, 150)
            );

            const invoiceElement = invoiceRef.current;
            const invoiceHTML = invoiceElement.outerHTML;

            printWindow.document.open();

            printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8" />
                    <title>Invoice ${updatedBooking.bookingRef}</title>

                    <style>
                        * {
                            box-sizing: border-box;
                        }

                        html,
                        body {
                            margin: 0;
                            padding: 0;
                            background: #ffffff;
                            font-family: Arial, sans-serif;
                        }

                        body {
                            display: flex;
                            justify-content: center;
                        }

                        img {
                            max-width: 100%;
                        }

                        @page {
                            size: A4;
                            margin: 0;
                        }

                        @media print {
                            html,
                            body {
                                width: 210mm;
                                min-height: 297mm;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                        }
                    </style>
                </head>

                <body>
                    ${invoiceHTML}

                    <script>
                        window.onload = function () {
                            setTimeout(function () {
                                window.print();
                            }, 300);
                        };

                        window.onafterprint = function () {
                            window.close();
                        };
                    <\/script>
                </body>
            </html>
        `);

            printWindow.document.close();

            /*
             * Ab saved final total hi next base price hogi.
             *
             * Example:
             * old total = 37
             * discount = 10
             * saved total = 27
             *
             * Ab UI base = 27 aur fields empty.
             * Dobara 10 subtract nahi hoga.
             */
            setInvoiceBasePrice(
                Number(updatedBooking.totalPrice) || priceToSave
            );

            setInvoiceData((current) => ({
                ...current,
                discount: "",
                tax: ""
            }));

            toast.success(
                `Price updated to £${priceToSave.toFixed(2)}. Invoice ready.`
            );
        } catch (err) {
            printWindow.close();

            console.error("Generate invoice error:", err);

            toast.error(
                err.response?.data?.message ||
                err.message ||
                "Failed to generate invoice"
            );
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div>
            <h1 className="mb-2 text-3xl font-bold text-[#1a1a1a]">
                Generate Invoice
            </h1>

            <p className="mb-6 text-gray-500">
                Search a booking and generate a professional invoice PDF.
            </p>

            <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-2">
                    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
                        <div className="relative">
                            <FiSearch
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                placeholder="Search by ref, name, phone or service..."
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-[#C0392B]"
                            />
                        </div>
                    </div>

                    <div className="max-h-130 space-y-2 overflow-y-auto pr-1">
                        {loading ? (
                            <SectionLoader />
                        ) : filteredBookings.length === 0 ? (
                            <div className="py-10 text-center text-sm text-gray-400">
                                No invoice bookings found
                            </div>
                        ) : (
                            filteredBookings.map((booking) => (
                                <button
                                    key={booking._id}
                                    type="button"
                                    onClick={() =>
                                        handleSelectBooking(booking)
                                    }
                                    className={`w-full rounded-xl border-2 p-3.5 text-left transition ${selectedBooking?._id === booking._id
                                        ? "border-[#C0392B] bg-red-50"
                                        : "border-gray-200 bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="mb-1 flex items-center justify-between gap-2">
                                        <span className="font-mono text-sm font-bold text-[#1a1a1a]">
                                            {booking.bookingRef}
                                        </span>

                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLES[
                                                booking.status
                                            ] ||
                                                "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {booking.status
                                                ?.replace(/_/g, " ")
                                                .toUpperCase()}
                                        </span>
                                    </div>

                                    <p className="text-sm font-medium text-gray-700">
                                        {booking.customer?.name || "—"}
                                    </p>

                                    <div className="mt-1 flex items-center justify-between gap-3">
                                        <p className="truncate text-xs text-gray-500">
                                            {formatServiceName(
                                                booking.serviceType
                                            )}
                                        </p>

                                        <p className="shrink-0 text-sm font-bold text-[#C0392B]">
                                            £
                                            {Number(
                                                booking.totalPrice || 0
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="min-w-0 lg:col-span-3">
                    {selectedBooking ? (
                        <>
                            <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="font-bold text-[#1a1a1a]">
                                        Invoice Settings
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedBooking(null)
                                        }
                                        className="rounded-lg p-1.5 transition hover:bg-gray-100"
                                    >
                                        <FiX
                                            size={18}
                                            className="text-gray-500"
                                        />
                                    </button>
                                </div>

                                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                                            Base Price (£)
                                        </label>

                                        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-bold text-[#C0392B]">
                                            £{basePrice.toFixed(2)}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                                            Discount (£)
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={invoiceData.discount}
                                            onChange={(event) => {
                                                const value = event.target.value;

                                                if (value === "" || Number(value) >= 0) {
                                                    setInvoiceData((current) => ({
                                                        ...current,
                                                        discount: value
                                                    }));
                                                }
                                            }}
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#C0392B]"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                                            Tax / VAT (£)
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={invoiceData.tax}
                                            onChange={(event) => {
                                                const value = event.target.value;

                                                if (value === "" || Number(value) >= 0) {
                                                    setInvoiceData((current) => ({
                                                        ...current,
                                                        tax: value
                                                    }));
                                                }
                                            }}
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#C0392B]"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                                        Message / Notes
                                    </label>

                                    <textarea
                                        rows={3}
                                        value={invoiceData.notes}
                                        placeholder="Payment or invoice notes..."
                                        onChange={(event) =>
                                            setInvoiceData((current) => ({
                                                ...current,
                                                notes: event.target.value
                                            }))
                                        }
                                        className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#C0392B]"
                                    />
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Final Total
                                        </p>

                                        <p className="text-2xl font-black text-[#1a1a1a]">
                                            £{finalTotal.toFixed(2)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={downloading}
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 rounded-xl bg-[#C0392B] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {downloading ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Generating PDF...
                                            </>
                                        ) : (
                                            <>
                                                <FiDownload size={18} />
                                                Download Invoice PDF
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-xl bg-gray-100 p-3 overflow-hidden w-full">
                                <p className="mb-3 text-center text-xs text-gray-500">
                                    Invoice Preview
                                </p>

                                <div className="flex justify-center w-full overflow-hidden">
                                    <div className="origin-top scale-[0.38] sm:scale-[0.55] md:scale-[0.72] mb-[-620px] sm:mb-[-430px] md:mb-[-270px]">
                                        <InvoicePreview
                                            ref={invoiceRef}
                                            booking={previewBooking}
                                            invoiceData={invoiceData}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white">
                            <FiPackage
                                size={32}
                                className="text-gray-300"
                            />

                            <p className="text-sm text-gray-400">
                                Select a booking to generate invoice
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
