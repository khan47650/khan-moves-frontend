import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    FiCheck, FiClock, FiDollarSign, FiEdit2, FiMail, FiMapPin,
    FiMessageSquare, FiPackage, FiPhone, FiTruck, FiUser, FiX
} from "react-icons/fi";
import RequestEditForm from "./RequestEditForm";

const TIME_SLOT_LABELS = {
    early: "Early slot — 6:00 AM – 6:00 PM",
    morning: "Morning slot — 8:00 AM – 6:00 PM",
    nine_to_five: "9-to-5 slot — 9:00 AM – 5:00 PM",
    afternoon: "Afternoon slot — 9:00 AM – 4:00 PM",
    flexible: "Flexible timing"
};

const floorLabel = level => ({
    ground: "Ground floor",
    basement: "Basement (treated as 1st floor)",
    "1st": "1st floor",
    "2nd": "2nd floor",
    "3rd": "3rd floor",
    "4th+": "4th floor or above"
}[level] || level || "—");

const money = value => Math.round(Number(value) || 0);

const parkingCharge = (hasParking, volume) => {
    if (hasParking !== false) return 0;
    if (Number(volume) >= 6) return 50;
    if (Number(volume) >= 2) return 20;
    return 0;
};

export default function RequestDetailsPanel({
    request,
    accepting,
    onClose,
    onUpdated,
    onAccept,
    onReject
}) {
    const [editing, setEditing] = useState(false);

    const close = () => {
        setEditing(false);
        onClose();
    };

    const updated = booking => {
        setEditing(false);
        onUpdated(booking);
    };

    const totalItems = (request?.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const dismantleCount = Number(request?.dismantleCount) || (request?.dismantleItems || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const assemblyCount = Number(request?.assemblyCount) || (request?.assemblyItems || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const pickupParkingCharge = parkingCharge(request?.pickupFloor?.hasParking, request?.totalVolume);
    const deliveryParkingCharge = parkingCharge(request?.deliveryFloor?.hasParking, request?.totalVolume);

    return (
        <AnimatePresence>
            {request && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={close}
                        className="fixed inset-0 z-40 bg-black/50"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-16 z-50 h-[calc(100vh-64px)] w-full overflow-y-auto bg-white shadow-2xl sm:w-110"
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between bg-linear-to-r from-[#C0392B] to-red-700 p-5 text-white">
                            <div>
                                <h2 className="text-xl font-bold">{request.customer?.name || "—"}</h2>
                                <p className="text-sm text-red-100">Ref: {request.bookingRef}</p>
                            </div>
                            <button onClick={close} className="rounded-lg p-2 hover:bg-red-600">
                                <FiX size={22} />
                            </button>
                        </div>

                        <div className="space-y-4 p-5">
                            <div className="flex items-center justify-between">
                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${request.status === "in_progress"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-yellow-100 text-yellow-800"
                                    }`}>
                                    {request.status === "in_progress" ? "IN PROGRESS" : "PENDING"}
                                </span>

                                {!editing && (
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                                    >
                                        <FiEdit2 size={14} /> Edit
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                                <h4 className="text-xs font-bold uppercase text-gray-500">Contact</h4>

                                {[
                                    [FiPhone, request.customer?.phone],
                                    [FiMail, request.customer?.email],
                                    [FiMessageSquare, request.customer?.whatsapp]
                                ].map(([Icon, value], index) => value && (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C0392B]/10">
                                            <Icon size={15} className="text-[#C0392B]" />
                                        </div>
                                        <p className="truncate text-sm text-gray-700">{value}</p>
                                    </div>
                                ))}

                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C0392B]/10">
                                        <FiUser size={15} className="text-[#C0392B]" />
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        Business delivery: <strong>{request.customer?.businessDelivery ? "Yes" : "No"}</strong>
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-4">
                                <h4 className="mb-3 text-xs font-bold uppercase text-gray-500">Move Setup</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between gap-3">
                                        <span className="text-gray-500">Service</span>
                                        <span className="font-semibold capitalize">{request.serviceType?.replaceAll("_", " ") || "—"}</span>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                        <span className="text-gray-500">Crew</span>
                                        <span className="font-semibold">{request.helperCount > 0 ? "2 people" : "1 person"}</span>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                        <span className="text-gray-500">Estimated delivery</span>
                                        <span className="font-semibold">{request.estimatedDeliveryTime || "—"}</span>
                                    </div>
                                </div>
                            </div>

                            {editing ? (
                                <RequestEditForm
                                    booking={request}
                                    onUpdated={updated}
                                    onCancel={() => setEditing(false)}
                                />
                            ) : (
                                <>
                                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <FiMapPin size={15} className="text-blue-600" />
                                            <h4 className="text-xs font-bold uppercase text-blue-600">Route & Access</h4>
                                        </div>

                                        <div className="rounded-lg bg-white/70 p-3">
                                            <p className="text-[10px] font-bold uppercase text-[#C0392B]">Pickup</p>
                                            <p className="text-sm font-bold">{request.pickup?.address || "—"}</p>
                                            <p className="text-xs text-gray-500">
                                                {[request.pickup?.town, request.pickup?.region, request.pickup?.postcode].filter(Boolean).join(", ")}
                                            </p>
                                            <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                                                <div><p className="text-gray-400">Floor</p><p className="font-semibold">{floorLabel(request.pickupFloor?.floorLevel)}</p></div>
                                                <div><p className="text-gray-400">Lift</p><p className="font-semibold">{request.pickupFloor?.hasLift ? "Available" : "No lift"}</p></div>
                                                <div><p className="text-gray-400">Parking</p><p className="font-semibold">{request.pickupFloor?.hasParking ? "Available" : `No (+£${pickupParkingCharge})`}</p></div>
                                            </div>
                                        </div>

                                        <div className="my-2 text-center text-[#C0392B]">↓</div>

                                        <div className="rounded-lg bg-white/70 p-3">
                                            <p className="text-[10px] font-bold uppercase text-green-700">Delivery</p>
                                            <p className="text-sm font-bold">{request.delivery?.address || "—"}</p>
                                            <p className="text-xs text-gray-500">
                                                {[request.delivery?.town, request.delivery?.region, request.delivery?.postcode].filter(Boolean).join(", ")}
                                            </p>
                                            <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                                                <div><p className="text-gray-400">Floor</p><p className="font-semibold">{floorLabel(request.deliveryFloor?.floorLevel)}</p></div>
                                                <div><p className="text-gray-400">Lift</p><p className="font-semibold">{request.deliveryFloor?.hasLift ? "Available" : "No lift"}</p></div>
                                                <div><p className="text-gray-400">Parking</p><p className="font-semibold">{request.deliveryFloor?.hasParking ? "Available" : `No (+£${deliveryParkingCharge})`}</p></div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex justify-between border-t border-blue-100 pt-3 text-xs">
                                            <span className="text-gray-500">Distance</span>
                                            <span className="font-bold">{Number(request.distance || 0).toFixed(1)} miles</span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border p-4">
                                        <h4 className="mb-3 text-xs font-bold uppercase text-gray-500">Date & Time</h4>
                                        <div className="flex items-start gap-2">
                                            <FiClock size={15} className="mt-0.5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">
                                                    {request.dateType === "flexible"
                                                        ? "Flexible dates (20% discount)"
                                                        : request.date
                                                            ? new Date(`${request.date}T12:00:00`).toLocaleDateString("en-GB", {
                                                                weekday: "long", day: "numeric", month: "long", year: "numeric"
                                                            })
                                                            : "—"}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {request.dateType === "flexible" ? "Pickup time to be confirmed" : TIME_SLOT_LABELS[request.timeSlot] || request.timeSlot || "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <FiPackage size={15} className="text-[#C0392B]" />
                                            <h4 className="text-xs font-bold uppercase text-gray-500">
                                                Items ({totalItems})
                                            </h4>
                                        </div>

                                        <div className="max-h-40 space-y-1.5 overflow-y-auto">
                                            {(request.items || []).map((item, index) => (
                                                <div key={item.itemId || `${item.name}-${index}`} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
                                                    <div className="flex justify-between gap-3">
                                                        <span className="truncate font-semibold">{item.name}</span>
                                                        <span className="font-bold text-gray-500">×{item.quantity}</span>
                                                    </div>
                                                    <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                                                        <span>{item.categoryName || "Uncategorised"}</span>
                                                        <span>{Number(item.volume || 0).toFixed(2)} m³ each</span>
                                                    </div>
                                                </div>
                                            ))}

                                            {!request.items?.length && (
                                                <p className="text-xs text-gray-400">No items selected.</p>
                                            )}
                                        </div>

                                        <div className="rounded-xl border p-4">
                                            <div className="mb-3 flex items-center gap-2">
                                                <FiPackage size={15} className="text-[#C0392B]" />
                                                <h4 className="text-xs font-bold uppercase text-gray-500">Additional Services</h4>
                                            </div>

                                            <div className="space-y-3 text-xs">
                                                {dismantleCount > 0 && (
                                                    <div>
                                                        <div className="flex justify-between font-semibold">
                                                            <span>Dismantling ×{dismantleCount}</span>
                                                            <span className="text-[#C0392B]">+£{dismantleCount * 20}</span>
                                                        </div>
                                                        <p className="mt-1 text-gray-500">
                                                            {(request.dismantleItems || []).map(item => `${item.name} ×${item.quantity}`).join(", ") || "Items not specified"}
                                                        </p>
                                                    </div>
                                                )}

                                                {assemblyCount > 0 && (
                                                    <div className="border-t pt-3">
                                                        <div className="flex justify-between font-semibold">
                                                            <span>Assembly ×{assemblyCount}</span>
                                                            <span className="text-[#C0392B]">+£{assemblyCount * 30}</span>
                                                        </div>
                                                        <p className="mt-1 text-gray-500">
                                                            {(request.assemblyItems || []).map(item => `${item.name} ×${item.quantity}`).join(", ") || "Items not specified"}
                                                        </p>
                                                    </div>
                                                )}

                                                {request.packingService && (
                                                    <div className="flex justify-between border-t pt-3 font-semibold">
                                                        <span>Professional packing</span>
                                                        <span className="text-[#C0392B]">+£20</span>
                                                    </div>
                                                )}

                                                {!dismantleCount && !assemblyCount && !request.packingService && (
                                                    <p className="text-gray-400">No additional services selected.</p>
                                                )}
                                            </div>
                                        </div>

                                        {request.multiTrip && Number(request.tripsNeeded) > 1 && (
                                            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                                                <div className="flex items-start gap-3">
                                                    <FiTruck size={18} className="mt-0.5 text-blue-700" />
                                                    <div>
                                                        <p className="text-sm font-bold text-blue-900">{request.tripsNeeded} van trips required</p>
                                                        <p className="mt-1 text-xs text-blue-700">{request.pricingNote || "Multiple van trips are included in the total price."}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-3 flex justify-between border-t pt-3">
                                            <span className="text-xs text-gray-500">Total Volume</span>
                                            <span className="text-sm font-bold">
                                                {Number(request.totalVolume || 0).toFixed(2)} m³
                                            </span>
                                        </div>
                                    </div>

                                    <div className="overflow-hidden rounded-xl border border-gray-200">
                                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-3">
                                            <FiDollarSign size={15} className="text-[#C0392B]" />
                                            <h4 className="text-xs font-bold uppercase text-gray-500">Price Breakdown</h4>
                                        </div>

                                        <div className="space-y-2 p-4">
                                            {(request.priceBreakdown || []).map((item, index) => (
                                                <div key={`${item.label}-${index}`} className="flex justify-between gap-3 text-xs">
                                                    <span className="text-gray-500">{item.label}</span>
                                                    <span className={item.amount < 0 ? "font-bold text-green-600" : "font-bold"}>
                                                        {item.amount < 0 ? "-" : "+"}£{money(Math.abs(item.amount))}
                                                    </span>
                                                </div>
                                            ))}

                                            {pickupParkingCharge > 0 && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-500">Pickup parking adjustment</span>
                                                    <span className="font-bold">+£{pickupParkingCharge}</span>
                                                </div>
                                            )}

                                            {deliveryParkingCharge > 0 && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-500">Delivery parking adjustment</span>
                                                    <span className="font-bold">+£{deliveryParkingCharge}</span>
                                                </div>
                                            )}

                                            {request.priceBreakdown?.length === 0 && (
                                                <p className="text-xs text-gray-400">No saved price breakdown.</p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between bg-[#1a1a1a] p-4">
                                            <span className="text-sm text-gray-400">Total Price</span>
                                            <span className="text-2xl font-black text-[#F1C40F]">£{money(request.totalPrice)}</span>
                                        </div>
                                    </div>

                                    {request.specialInstructions && (
                                        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                                            <p className="mb-2 text-xs font-bold uppercase text-amber-700">
                                                Special Instructions
                                            </p>
                                            <p className="text-sm text-amber-800">
                                                {request.specialInstructions}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onAccept(request)}
                                            disabled={accepting}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                                        >
                                            {accepting ? "Accepting..." : <><FiCheck size={16} /> Accept</>}
                                        </button>

                                        <button
                                            onClick={() => onReject(request)}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-700"
                                        >
                                            <FiX size={16} /> Reject
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}