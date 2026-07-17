import React, { useEffect, useState } from "react";
import { FiPackage } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../../api/api";
import RequestCard from "../../../components/admin/RequestCard";
import RequestDetailsPanel from "../../../components/admin/RequestDetailsPanel";
import RejectDialog from "../../../components/admin/RejectDialog";
import SendInvoiceDialog from "../../../components/admin/SendInvoiceDialog";

function SectionLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-[#C0392B]" />
            <p className="mt-4 text-sm font-semibold text-gray-400">
                Loading requests...
            </p>
        </div>
    );
}

export default function Requests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [sendInvoiceFor, setSendInvoiceFor] = useState(null);
    const [rejectFor, setRejectFor] = useState(null);
    const [acceptingId, setAcceptingId] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);

            const [pendingResponse, progressResponse] = await Promise.all([
                api.get("/bookings?status=pending&limit=100"),
                api.get("/bookings?status=in_progress&limit=100")
            ]);

            setRequests([
                ...(pendingResponse.data?.data || []),
                ...(progressResponse.data?.data || [])
            ]);
        } catch {
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async booking => {
        try {
            setAcceptingId(booking._id);
            await api.post(`/jobs/from-booking/${booking._id}`);

            setRequests(current =>
                current.filter(item => item._id !== booking._id)
            );
            setSelectedRequest(null);

            toast.success(`Booking ${booking.bookingRef} confirmed! Job created.`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to accept booking");
        } finally {
            setAcceptingId(null);
        }
    };

    const handleUpdated = updatedBooking => {
        setRequests(current =>
            current.map(item =>
                item._id === updatedBooking._id ? updatedBooking : item
            )
        );
        setSelectedRequest(updatedBooking);
    };

    const handleRejected = bookingId => {
        setRequests(current =>
            current.filter(item => item._id !== bookingId)
        );
        setSelectedRequest(null);
    };

    const handleInvoiceSent = async bookingId => {
        try {
            await api.patch(`/bookings/${bookingId}/status`, {
                status: "in_progress"
            });

            const updateStatus = booking =>
                booking._id === bookingId
                    ? { ...booking, status: "in_progress" }
                    : booking;

            setRequests(current => current.map(updateStatus));
            setSelectedRequest(current =>
                current ? updateStatus(current) : current
            );
        } catch {
            // Silent
        }
    };

    return (
        <div className="relative">
            <h1 className="mb-2 text-3xl font-bold text-[#1a1a1a]">
                Booking Requests
            </h1>
            <p className="mb-6 text-gray-500">
                Pending customer booking requests waiting for approval.
            </p>

            {loading ? (
                <SectionLoader />
            ) : requests.length === 0 ? (
                <div className="rounded-xl border bg-white p-12 text-center">
                    <FiPackage size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No pending requests</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {requests.map(request => (
                        <RequestCard
                            key={request._id}
                            request={request}
                            accepting={acceptingId === request._id}
                            onView={() => setSelectedRequest(request)}
                            onInvoice={() => setSendInvoiceFor(request)}
                            onAccept={() => handleAccept(request)}
                            onReject={() => setRejectFor(request)}
                        />
                    ))}
                </div>
            )}

            <RequestDetailsPanel
                request={selectedRequest}
                accepting={acceptingId === selectedRequest?._id}
                onClose={() => setSelectedRequest(null)}
                onUpdated={handleUpdated}
                onAccept={handleAccept}
                onReject={request => {
                    setSelectedRequest(null);
                    setRejectFor(request);
                }}
            />

            {sendInvoiceFor && (
                <SendInvoiceDialog
                    booking={sendInvoiceFor}
                    onClose={() => setSendInvoiceFor(null)}
                    onSent={handleInvoiceSent}
                />
            )}

            {rejectFor && (
                <RejectDialog
                    booking={rejectFor}
                    onClose={() => setRejectFor(null)}
                    onRejected={handleRejected}
                />
            )}
        </div>
    );
}