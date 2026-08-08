import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
    FiPhone,
    FiMail,
    FiPackage,
    FiArrowRight,
    FiCheck,
    FiMessageSquare,
    FiX,
    FiEdit2
} from "react-icons/fi";
import MapComponent from "../booking/MapComponent";

const formatJobDate = value => {
    if (!value) return "To be arranged";

    const parsedDate = new Date(`${value}T12:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return value;
    }

    return parsedDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};

const formatTimeSlot = value => {
    const labels = {
        early: "6:00 AM – 6:00 PM",
        morning: "8:00 AM – 6:00 PM",

        nine_to_five: "9:00 AM – 5:00 PM",
        nineToFive: "9:00 AM – 5:00 PM",
        "9_to_5": "9:00 AM – 5:00 PM",
        "9-5": "9:00 AM – 5:00 PM",

        afternoon: "9:00 AM – 4:00 PM",

        flexible: "I'm flexible with timing"
    };

    return labels[value] || value || "To be arranged";
};

const BOX_PACKING_PRICES = {
    "Small Box": 2,
    "Medium Box": 3,
    "Large Box": 4
};

export default function JobDetailsPanel({
    selectedJob,
    activeTab,

    drivers,
    vehicles,

    selectedDriverId,
    selectedVehicleId,

    setSelectedDriverId,
    setSelectedVehicleId,

    assigning,
    updatingStatus,

    handleAssign,
    handleStatusUpdate,
    handleCompleteJob,

    onClose,
    onEdit,
    onUpdated
}) {
    const isBoxesService = [
        "boxes",
        "boxes_parcels",
        "boxes_and_parcels"
    ].includes(selectedJob?.serviceType);
    return (
        <AnimatePresence>
            {selectedJob && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => onClose()}
                        className="fixed inset-0 bg-black/50 z-40"
                    />
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-16 right-0 h-[calc(100vh-64px)] w-96 bg-white z-50 overflow-y-auto shadow-2xl"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-linear-to-r from-[#C0392B] to-red-700 text-white p-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">{selectedJob.customer?.name || '—'}</h2>
                                <p className="text-red-100 text-sm mt-0.5">Ref: {selectedJob.bookingRef}</p>

                            </div>
                            <button onClick={() => onClose()} className="p-2 hover:bg-red-600 rounded-lg transition">
                                <FiX size={22} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">

                            <div className="flex items-center justify-between">

                                <span
                                    className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${activeTab === 'active'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-orange-100 text-orange-700'
                                        }`}
                                >
                                    {activeTab === 'active' ? 'ACTIVE' : 'ON-WAY'}
                                </span>


                                {activeTab === "active" && (
                                    <button
                                        onClick={onEdit}
                                        className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-200"
                                    >
                                        <FiEdit2 size={12} />
                                        Edit
                                    </button>
                                )}

                            </div>

                            {/* Contact */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <h4 className="text-xs font-bold text-gray-500 uppercase">Contact</h4>
                                {selectedJob.customer?.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#C0392B]/10 rounded-lg flex items-center justify-center shrink-0"><FiPhone className="text-[#C0392B]" size={14} /></div>
                                        <p className="text-sm text-gray-700">{selectedJob.customer.phone}</p>
                                    </div>
                                )}
                                {selectedJob.customer?.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#C0392B]/10 rounded-lg flex items-center justify-center shrink-0"><FiMail className="text-[#C0392B]" size={14} /></div>
                                        <p className="text-sm text-gray-700 truncate">{selectedJob.customer.email}</p>
                                    </div>
                                )}
                            </div>

                            {/* Route */}
                            {/* Pickup */}
                            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                                <h4 className="mb-3 text-xs font-bold uppercase text-[#C0392B]">
                                    Pickup
                                </h4>

                                <div className="space-y-2">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-gray-400">
                                            Customer
                                        </p>

                                        <p className="text-sm font-bold text-[#1a1a1a]">
                                            {selectedJob.customer?.name || "—"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-gray-400">
                                            Address
                                        </p>

                                        <p className="text-sm font-bold text-[#1a1a1a]">
                                            {selectedJob.pickup?.address || "—"}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {selectedJob.pickup?.postcode || "—"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-gray-400">
                                                Date
                                            </p>

                                            <p className="text-xs font-semibold text-gray-700">
                                                {selectedJob.dateType === "flexible"
                                                    ? "Flexible"
                                                    : formatJobDate(selectedJob.date)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-gray-400">
                                                Pickup Time
                                            </p>

                                            <p className="text-xs font-semibold text-gray-700">
                                                {selectedJob.dateType === "flexible"
                                                    ? "Flexible"
                                                    : formatTimeSlot(selectedJob.timeSlot)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 border-t border-red-100 pt-2">
                                        <div>
                                            <p className="text-[10px] text-gray-400">
                                                Floor
                                            </p>

                                            <p className="text-xs font-semibold capitalize text-gray-700">
                                                {selectedJob.pickupFloor?.floorLevel || "Ground"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] text-gray-400">
                                                Lift
                                            </p>

                                            <p className="text-xs font-semibold text-gray-700">
                                                {selectedJob.pickupFloor?.hasLift ? "Yes" : "No"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] text-gray-400">
                                                Parking
                                            </p>

                                            <p className="text-xs font-semibold text-gray-700">
                                                {selectedJob.pickupFloor?.hasParking ? "Yes" : "No"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery */}
                            <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                                <h4 className="mb-3 text-xs font-bold uppercase text-green-700">
                                    Delivery
                                </h4>

                                <div className="space-y-2">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-gray-400">
                                            Customer
                                        </p>

                                        <p className="text-sm font-bold text-[#1a1a1a]">
                                            {selectedJob.customer?.name || "—"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-gray-400">
                                            Address
                                        </p>

                                        <p className="text-sm font-bold text-[#1a1a1a]">
                                            {selectedJob.delivery?.address || "—"}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {selectedJob.delivery?.postcode || "—"}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-green-100 bg-white/70 p-3">
                                        <p className="text-[10px] font-bold uppercase text-gray-400">
                                            Estimated Delivery Time
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-green-700">
                                            {selectedJob.estimatedDeliveryTime ||
                                                "To be arranged"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 border-t border-green-100 pt-2">
                                        <div>
                                            <p className="text-[10px] text-gray-400">
                                                Floor
                                            </p>

                                            <p className="text-xs font-semibold capitalize text-gray-700">
                                                {selectedJob.deliveryFloor?.floorLevel || "Ground"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] text-gray-400">
                                                Lift
                                            </p>

                                            <p className="text-xs font-semibold text-gray-700">
                                                {selectedJob.deliveryFloor?.hasLift ? "Yes" : "No"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] text-gray-400">
                                                Parking
                                            </p>

                                            <p className="text-xs font-semibold text-gray-700">
                                                {selectedJob.deliveryFloor?.hasParking ? "Yes" : "No"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Route Map */}

                            {selectedJob.pickup?.lat &&
                                selectedJob.pickup?.lng &&
                                selectedJob.delivery?.lat &&
                                selectedJob.delivery?.lng && (

                                    <div className="overflow-hidden rounded-xl border border-gray-200">

                                        <div className="border-b bg-gray-50 px-4 py-2">

                                            <h4 className="text-xs font-bold uppercase text-gray-500">
                                                Route Map
                                            </h4>

                                        </div>

                                        <MapComponent
                                            pickupLat={selectedJob.pickup?.lat}
                                            pickupLng={selectedJob.pickup?.lng}
                                            deliveryLat={selectedJob.delivery?.lat}
                                            deliveryLng={selectedJob.delivery?.lng}
                                            distance={selectedJob.distance}
                                            time={null}
                                        />

                                    </div>

                                )}

                            {/* Distance */}
                            <div className="grid grid-cols-2 gap-3">

                                <div className="rounded-xl border border-gray-100 p-3">
                                    <p className="text-[10px] uppercase text-gray-400">
                                        Distance
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-[#C0392B]">
                                        {Math.round(selectedJob.distance || 0)} mi
                                    </p>
                                </div>

                                <div className="rounded-xl border border-gray-100 p-3">
                                    <p className="text-[10px] uppercase text-gray-400">
                                        Volume
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-[#C0392B]">
                                        {Number(selectedJob.totalVolume || 0).toFixed(1)} m³
                                    </p>
                                </div>

                                <div className="rounded-xl border border-gray-100 p-3">

                                    <p className="text-[10px] uppercase text-gray-400">
                                        Crew
                                    </p>

                                    <p className="mt-1 text-sm font-bold">
                                        {Number(selectedJob.helperCount || 0) + 1} Crew
                                    </p>

                                </div>

                                {!isBoxesService ? (

                                    <>

                                        <div className="rounded-xl border border-gray-100 p-3">

                                            <p className="text-[10px] uppercase text-gray-400">
                                                Packing
                                            </p>

                                            <p className="mt-1 text-sm font-bold">
                                                {selectedJob.packingService ? "Yes" : "No"}
                                            </p>

                                        </div>

                                        <div className="rounded-xl border border-gray-100 p-3">

                                            <p className="text-[10px] uppercase text-gray-400">
                                                Assembly
                                            </p>

                                            <p className="mt-1 text-sm font-bold">
                                                {selectedJob.assemblyCount || 0}
                                            </p>

                                        </div>

                                        <div className="rounded-xl border border-gray-100 p-3">

                                            <p className="text-[10px] uppercase text-gray-400">
                                                Dismantle
                                            </p>

                                            <p className="mt-1 text-sm font-bold">
                                                {selectedJob.dismantleCount || 0}
                                            </p>

                                        </div>

                                    </>

                                ) : (

                                    <div className="col-span-2 rounded-xl border border-green-200 bg-green-50 p-3">

                                        <p className="mb-2 text-xs font-bold uppercase text-green-700">
                                            Packing Charges
                                        </p>

                                        {[
                                            {
                                                name: "Small Box",
                                                field: "smallBoxPackingCount"
                                            },
                                            {
                                                name: "Medium Box",
                                                field: "mediumBoxPackingCount"
                                            },
                                            {
                                                name: "Large Box",
                                                field: "largeBoxPackingCount"
                                            }
                                        ]
                                            .filter(
                                                box =>
                                                    Number(selectedJob[box.field] || 0) > 0
                                            )
                                            .map(box => {

                                                const quantity =
                                                    Number(
                                                        selectedJob[box.field] || 0
                                                    );

                                                const price =
                                                    BOX_PACKING_PRICES[box.name];

                                                return (
                                                    <div
                                                        key={box.name}
                                                        className="mb-1 flex items-center justify-between text-sm"
                                                    >

                                                        <span>
                                                            {box.name} ×{quantity}
                                                        </span>

                                                        <span className="font-bold">
                                                            £{price * quantity}
                                                        </span>

                                                    </div>
                                                );
                                            })}

                                        {![
                                            "smallBoxPackingCount",
                                            "mediumBoxPackingCount",
                                            "largeBoxPackingCount"
                                        ].some(
                                            field =>
                                                Number(selectedJob[field] || 0) > 0
                                        ) && (

                                                <p className="text-sm text-gray-500">
                                                    No packing charges.
                                                </p>

                                            )}

                                    </div>

                                )}

                            </div>

                            {/* Items */}
                            <div className="border border-gray-100 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <FiPackage size={14} className="text-[#C0392B]" />
                                    <h4 className="text-xs font-bold text-gray-500 uppercase">Items ({selectedJob.items?.length || 0})</h4>
                                </div>
                                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                                    {(selectedJob.items || []).map((it, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                                        >

                                            <div className="min-w-0 flex-1">

                                                <p className="truncate text-sm font-semibold">
                                                    {it.name}
                                                </p>

                                                <p className="text-[11px] text-gray-400">
                                                    {Number(it.volume || 0)} m³ each
                                                </p>

                                            </div>

                                            <span className="ml-3 text-sm font-bold">
                                                ×{it.quantity}
                                            </span>

                                        </div>
                                    ))}
                                </div>
                            </div>
                            {console.log("JOB BREAKDOWN", selectedJob.priceBreakdown)}
                            {selectedJob.priceBreakdown?.length > 0 && (

                                <div className="rounded-xl border border-gray-100 bg-white p-4">

                                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                                        Price Breakdown
                                    </h4>

                                    <div className="space-y-2">

                                        {selectedJob.priceBreakdown.map((item, index) => (

                                            <div
                                                key={index}
                                                className="flex items-center justify-between text-sm"
                                            >

                                                <span className="text-gray-600">
                                                    {item.label}
                                                </span>

                                                <span className="font-bold">
                                                    £{Math.round(item.amount)}
                                                </span>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                            )}

                            {/* Special Instructions */}
                            {selectedJob.specialInstructions && (
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                    <p className="text-xs font-bold text-amber-700 uppercase mb-2">Special Instructions</p>
                                    <p className="text-sm text-amber-800">{selectedJob.specialInstructions}</p>
                                </div>
                            )}

                            {/* Price */}
                            <div className="rounded-xl bg-[#1a1a1a] p-4 text-white">

                                {selectedJob.adminPrice != null ? (
                                    <>

                                        <div className="flex items-center justify-between text-sm">

                                            <span className="text-gray-400">
                                                System Price
                                            </span>

                                            <span className="text-gray-400 line-through">
                                                £{Math.round(selectedJob.originalPrice || 0)}
                                            </span>

                                        </div>

                                        <div className="mt-3 flex items-center justify-between">

                                            <span className="font-semibold">
                                                Final Price
                                            </span>

                                            <span className="text-2xl font-black text-[#F1C40F]">
                                                £{Math.round(selectedJob.totalPrice || 0)}
                                            </span>

                                        </div>
                                        <div className="mb-2 inline-flex rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold uppercase text-green-700">
                                            Admin Override
                                        </div>
                                        <p className="mt-2 text-xs text-gray-400">
                                            Price manually updated by admin.
                                        </p>

                                    </>
                                ) : (

                                    <div className="flex items-center justify-between">

                                        <span className="text-gray-400">
                                            Total Price
                                        </span>

                                        <span className="text-2xl font-black text-[#F1C40F]">
                                            £{Math.round(selectedJob.totalPrice || 0)}
                                        </span>

                                    </div>

                                )}

                            </div>

                            {/* Assign Driver & Vehicle — Active only */}
                            {activeTab === 'active' && (
                                <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase">Assign Driver & Vehicle</h4>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Driver</label>
                                        <select
                                            value={selectedDriverId}
                                            onChange={e => setSelectedDriverId(e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C0392B] transition"
                                        >
                                            <option value="">Select Driver</option>
                                            {drivers.map(d => (
                                                <option key={d._id} value={d._id}>{d.name} — {d.phone}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Vehicle</label>
                                        <select
                                            value={selectedVehicleId}
                                            onChange={e => setSelectedVehicleId(e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C0392B] transition"
                                        >
                                            <option value="">Select Vehicle</option>
                                            {vehicles.map(v => (
                                                <option key={v._id} value={v._id}>{v.regNumber} — {v.makeModel}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleAssign}
                                        disabled={assigning || (!selectedDriverId && !selectedVehicleId)}
                                        className="w-full py-2.5 bg-[#1a1a1a] hover:bg-black text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {assigning
                                            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Assigning...</>
                                            : <><FiMessageSquare size={14} /> Assign & Notify Driver</>}
                                    </button>
                                </div>
                            )}

                            {/* On-Way: show assigned info */}
                            {activeTab === 'on_way' && (
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Assigned</h4>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Driver</span>
                                        <span className="font-semibold text-[#1a1a1a]">{selectedJob.assignedDriverName || '—'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Vehicle</span>
                                        <span className="font-semibold text-[#1a1a1a]">{selectedJob.assignedVehicleReg || '—'}</span>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                {activeTab === 'active' && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedJob._id, 'on_way', 'active')}
                                        disabled={updatingStatus}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition disabled:opacity-50"
                                    >
                                        {updatingStatus ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</> : <><FiArrowRight size={16} /> Go On-Way</>}
                                    </button>
                                )}
                                {activeTab === 'on_way' && (
                                    <button
                                        onClick={() => handleCompleteJob(selectedJob._id)}
                                        disabled={updatingStatus}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition disabled:opacity-50"
                                    >
                                        {updatingStatus ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Completing...</> : <><FiCheck size={16} /> Complete Job</>}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onClose()}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                                >
                                    <FiX size={16} />
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}

        </AnimatePresence>
    );
}