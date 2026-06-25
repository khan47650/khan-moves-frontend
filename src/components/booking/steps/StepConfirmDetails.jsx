import React, { useState } from 'react';
import {
    FiMapPin,
    FiCalendar,
    FiEdit2,
    FiTool,
    FiCheckCircle,
    FiAlertCircle,
} from 'react-icons/fi';
import MapComponent from '../MapComponent';
import ConfirmationDialog from '../ConfirmationDialog';
import ConfirmationScreen from '../ConfirmationScreen';

export default function StepConfirmDetails({
    data,
    onEdit,
    onSubmit,
    errors,
    loading = false,
    totalPrice = 346,
    pickupLat = 52.509,
    pickupLng = -1.885,
    deliveryLat = 51.5074,
    deliveryLng = -0.1278,
    distance = 99,
}) {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);

    const handleProceedClick = () => {
        if (!termsAccepted) {
            alert('Please accept the terms & conditions');
            return;
        }
        setDialogOpen(true);
    };

    const handleDialogConfirm = (formData) => {
        setConfirmationData(formData);
        setShowConfirmation(true);
        setDialogOpen(false);
    };

    const handleFinalSubmit = () => {
        onSubmit(confirmationData);
    };

    if (showConfirmation && confirmationData) {
        return (
            <ConfirmationScreen
                data={data}
                confirmationData={confirmationData}
                totalPrice={totalPrice}
                pickupLat={pickupLat}
                pickupLng={pickupLng}
                deliveryLat={deliveryLat}
                deliveryLng={deliveryLng}
                distance={distance}
                onConfirmSubmit={handleFinalSubmit}
                loading={loading}
            />
        );
    }

    return (
        <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
            {/* Heading */}
            <div className="max-w-7xl mx-auto mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">
                    Confirm your details
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                    Review everything before we book your move
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* LEFT: Confirmation Details */}
                <div className="lg:col-span-2 space-y-3">

                    {/* Pickup Details */}
                    <div
                        className="bg-white rounded-2xl p-4"
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <FiMapPin size={18} className="text-gray-700" />
                                <h4 className="font-bold text-sm text-[#1a1a1a]">Pickup location</h4>
                            </div>
                            <button
                                onClick={() => onEdit('location')}
                                className="text-gray-600 hover:text-[#1a1a1a] flex items-center gap-1 text-xs font-semibold"
                            >
                                <FiEdit2 size={14} /> Edit
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <p className="text-xs text-gray-500 font-semibold mb-0.5">Address</p>
                                <p className="text-sm font-semibold text-[#1a1a1a]">{data.pickup.address}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold mb-0.5">Postcode</p>
                                <p className="text-sm font-semibold text-[#1a1a1a]">{data.pickup.postcode}</p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Details */}
                    <div
                        className="bg-white rounded-2xl p-4"
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <FiMapPin size={18} className="text-gray-700" />
                                <h4 className="font-bold text-sm text-[#1a1a1a]">Delivery location</h4>
                            </div>
                            <button
                                onClick={() => onEdit('location')}
                                className="text-gray-600 hover:text-[#1a1a1a] flex items-center gap-1 text-xs font-semibold"
                            >
                                <FiEdit2 size={14} /> Edit
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <p className="text-xs text-gray-500 font-semibold mb-0.5">Address</p>
                                <p className="text-sm font-semibold text-[#1a1a1a]">{data.delivery.address}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold mb-0.5">Postcode</p>
                                <p className="text-sm font-semibold text-[#1a1a1a]">{data.delivery.postcode}</p>
                            </div>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div
                        className="bg-white rounded-2xl p-4"
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <FiCalendar size={18} className="text-gray-700" />
                                <h4 className="font-bold text-sm text-[#1a1a1a]">Date & time</h4>
                            </div>
                            <button
                                onClick={() => onEdit('dateTime')}
                                className="text-gray-600 hover:text-[#1a1a1a] flex items-center gap-1 text-xs font-semibold"
                            >
                                <FiEdit2 size={14} /> Edit
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-gray-500 font-semibold mb-0.5">Date</p>
                                <p className="text-sm font-semibold text-[#1a1a1a]">
                                    {new Date(data.date).toLocaleDateString('en-GB', {
                                        weekday: 'short',
                                        day: 'numeric',
                                        month: 'short',
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold mb-0.5">Time</p>
                                <p className="text-sm font-semibold text-[#1a1a1a] capitalize">
                                    {data.timeSlot || 'Flexible'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    {(data.protectionPlus || data.dismantleCount > 0 || data.assemblyCount > 0) && (
                        <div
                            className="bg-white rounded-2xl p-4"
                            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <FiTool size={18} className="text-gray-700" />
                                <h4 className="font-bold text-sm text-[#1a1a1a]">Added services</h4>
                            </div>

                            <div className="space-y-2 text-xs">
                                {data.protectionPlus && (
                                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700 font-semibold">Protection+</span>
                                        <span className="text-gray-700 font-bold">
                                            +£{Math.round((data.protectionGoodsValue / 100) * 2.4)}
                                        </span>
                                    </div>
                                )}
                                {data.dismantleCount > 0 && (
                                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700 font-semibold">
                                            Dismantle (×{data.dismantleCount})
                                        </span>
                                        <span className="text-gray-700 font-bold">+£{data.dismantleCount * 20}</span>
                                    </div>
                                )}
                                {data.assemblyCount > 0 && (
                                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700 font-semibold">
                                            Assembly (×{data.assemblyCount})
                                        </span>
                                        <span className="text-gray-700 font-bold">+£{data.assemblyCount * 30}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Special Instructions */}
                    {data.specialInstructions && (
                        <div
                            className="bg-white rounded-2xl p-4"
                            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                        >
                            <h4 className="font-bold text-sm text-[#1a1a1a] mb-2 flex items-center gap-2">
                                <FiAlertCircle size={16} />
                                Special instructions
                            </h4>
                            <p className="text-xs text-gray-700">{data.specialInstructions}</p>
                        </div>
                    )}

                    {/* Terms */}
                    <div
                        className="bg-white rounded-2xl p-4"
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                    >
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="w-4 h-4 mt-0.5 shrink-0"
                            />
                            <span className="text-xs text-gray-700">
                                I agree to Khan Moves'{' '}
                                <a href="/terms" className="text-[#1a1a1a] font-bold hover:underline">
                                    Terms & Conditions
                                </a>{' '}
                                and{' '}
                                <a href="/privacy" className="text-[#1a1a1a] font-bold hover:underline">
                                    Privacy Policy
                                </a>
                                .
                            </span>
                        </label>
                    </div>
                </div>

                {/* RIGHT: Map & Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-20 space-y-3">
                        {/* Map */}
                        <div
                            className="bg-white rounded-2xl overflow-hidden"
                            style={{
                                isolation: 'isolate',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                            }}
                        >
                            <MapComponent
                                pickupLat={pickupLat}
                                pickupLng={pickupLng}
                                deliveryLat={deliveryLat}
                                deliveryLng={deliveryLng}
                                distance={distance}
                                time="119 mins"
                            />
                        </div>

                        {/* Summary Card */}
                        <div
                            className="bg-white rounded-2xl p-4"
                            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                        >
                            <h4 className="font-bold text-sm text-[#1a1a1a] mb-2">Total to pay</h4>
                            <p className="text-3xl font-bold text-[#1a1a1a] mb-3">£{totalPrice}</p>

                            <button
                                onClick={handleProceedClick}
                                disabled={loading || !termsAccepted}
                                className={`w-full py-3 rounded-lg font-bold text-white text-sm transition flex items-center justify-center gap-2 ${termsAccepted && !loading
                                        ? 'bg-[#1a1a1a] hover:bg-black'
                                        : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin">⏳</span> Processing
                                    </>
                                ) : (
                                    <>
                                        <FiCheckCircle size={16} /> Proceed & Book
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleDialogConfirm}
                loading={loading}
            />
        </div>
    );
}