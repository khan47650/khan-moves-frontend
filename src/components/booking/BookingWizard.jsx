import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../api/api';

import StepServiceType from './steps/StepServiceType';
import StepLocation from './steps/StepLocation';
import StepItemSelection from './steps/StepItemSelection';
import StepItemSelectionFurniture from './steps/StepItemSelectionFurniture';
import StepItemSelectionOffice from './steps/StepItemSelectionOffice';
import StepItemSelectionParcels from './steps/StepItemSelectionParcels';
import StepItemSelectionVehicle from './steps/StepItemSelectionVehicle';
import StepItemSelectionPallets from './steps/StepItemSelectionPallets';
import StepDatePrice from './steps/StepDatePrice';
import StepAdditionalServices from './steps/StepAdditionalServices';
import StepConfirmDetails from './steps/StepConfirmDetails';
import { calculateTotalPrice } from '../../utils/priceCalculator';

const STEPS = [
    { id: 'service', label: 'What?', title: 'Service Type' },
    { id: 'location', label: 'Where?', title: 'Locations & Access' },
    { id: 'items', label: 'Items', title: 'Item Selection' },
    { id: 'datePrice', label: 'When?', title: 'Date & Price' },
    { id: 'services', label: 'Add-ons', title: 'Additional Services' },
    { id: 'confirm', label: 'Review', title: 'Confirm Details' },
];

export default function BookingWizard() {
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [bookingData, setBookingData] = useState({
        serviceType: location.state?.serviceType || '',
        pickup: { address: '', postcode: '', town: '', region: '', lat: null, lng: null },
        delivery: { address: '', postcode: '', town: '', region: '', lat: null, lng: null },
        pickupFloor: { floorLevel: 'ground', hasLift: true, hasParking: true },
        deliveryFloor: { floorLevel: 'ground', hasLift: true, hasParking: true },
        items: [],
        dateType: 'specific',
        date: '',
        timeSlot: '',
        helperCount: 1,
        dismantleCount: 0,
        assemblyCount: 0,
        specialInstructions: '',
        packingService: false,
        distance: 25,
    });

    useEffect(() => {
        if (location.state?.serviceType) setCurrentStep(1);
    }, [location.state]);

    // ── Correct volume calculation ──────────────────────
    const totalVolume = bookingData.items.reduce(
        (s, it) => s + (it.volume || 0) * (it.quantity || 1), 0
    );

    // ── Correct price calculation per client formula ─────────────
    const totalPrice = calculateTotalPrice({
        distance: bookingData.distance,
        volume: totalVolume,
        pickupFloor: bookingData.pickupFloor,
        deliveryFloor: bookingData.deliveryFloor,
        helperCount: bookingData.helperCount,
        dismantleCount: bookingData.dismantleCount,
        assemblyCount: bookingData.assemblyCount,
        packingService: bookingData.packingService,
        dateType: bookingData.dateType,
        timeSlot: bookingData.timeSlot,
    });

    const handleChange = (key, value) => {
        setBookingData(prev => ({ ...prev, [key]: value }));
        if (errors[key]) { const e = { ...errors }; delete e[key]; setErrors(e); }
    };

    const validateStep = () => {
        const e = {};
        switch (STEPS[currentStep].id) {
            case 'service':
                if (!bookingData.serviceType) e.serviceType = 'Please select a service';
                break;
            case 'location':
                if (!bookingData.pickup.postcode) e.pickupPostcode = 'Pickup postcode required';
                if (!bookingData.delivery.postcode) e.deliveryPostcode = 'Delivery postcode required';
                break;
            case 'items':
                if (bookingData.items.length === 0) e.items = 'Please select at least one item';
                break;
            case 'datePrice':
                if (bookingData.dateType === 'specific') {
                    if (!bookingData.date) e.date = 'Please select a date';
                    if (!bookingData.timeSlot) e.timeSlot = 'Please select a time slot';
                }
                break;
            default:
                break;
        }
        if (Object.keys(e).length > 0) { setErrors(e); return false; }
        setErrors({});
        return true;
    };

    const handleNext = () => {
        if (validateStep() && currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    // ── API call — only fires when user confirms dialog ─────────────────────
    const handleSubmit = async (customerData) => {
        setLoading(true);
        try {
            const payload = {
                serviceType: bookingData.serviceType,
                pickup: bookingData.pickup,
                delivery: bookingData.delivery,
                pickupFloor: bookingData.pickupFloor,
                deliveryFloor: bookingData.deliveryFloor,
                items: bookingData.items,
                totalVolume,
                dateType: bookingData.dateType,
                date: bookingData.date,
                timeSlot: bookingData.timeSlot,
                helperCount: bookingData.helperCount,
                dismantleCount: bookingData.dismantleCount,
                assemblyCount: bookingData.assemblyCount,
                packingService: bookingData.packingService,
                specialInstructions: bookingData.specialInstructions,
                distance: bookingData.distance,
                totalPrice,
                customer: customerData,
            };

            const res = await api.post('/bookings', payload);
            return res.data; // { success, data, bookingRef }
        } catch (err) {
            toast.error('Failed to submit booking. Please try again.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (stepId) => {
        const idx = STEPS.findIndex(s => s.id === stepId);
        if (idx !== -1) { setCurrentStep(idx); window.scrollTo(0, 0); }
    };

    const step = STEPS[currentStep];
    const progress = ((currentStep + 1) / STEPS.length) * 100;
    const isConfirm = step.id === 'confirm';

    const itemProps = {
        items: bookingData.items,
        onChange: its => handleChange('items', its),
        error: errors.items,
        pickup: bookingData.pickup,
        delivery: bookingData.delivery,
        serviceType: bookingData.serviceType,
    };

    return (
        <div className="min-h-screen bg-[#F5F1ED]">
            <div className={`max-w-7xl mx-auto px-4 ${isConfirm ? 'pt-0' : 'pt-4'}`}>
                {!isConfirm && (
                    <>
                        <div className="mb-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Get Your Moving Quote</h1>
                            <p className="text-gray-600 text-sm mb-3">Step {currentStep + 1} of {STEPS.length} — {step.title}</p>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-linear-to-r from-[#DC2626] to-red-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                            {STEPS.map((s, idx) => (
                                <button
                                    key={s.id}
                                    onClick={() => idx < currentStep && setCurrentStep(idx)}
                                    className={`shrink-0 px-3 py-1.5 rounded-lg font-semibold text-sm transition ${idx === currentStep
                                        ? 'bg-[#DC2626] text-white'
                                        : idx < currentStep
                                            ? 'bg-green-100 text-green-700 cursor-pointer'
                                            : 'bg-gray-200 text-gray-500 cursor-default'
                                        }`}
                                >
                                    {idx < currentStep ? <FiCheckCircle className="inline mr-1" size={13} /> : `${idx + 1}. `}
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step.id === 'items' ? `items-${bookingData.serviceType}` : step.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25 }}
                        className="mb-4"
                    >
                        {step.id === 'service' && (
                            <StepServiceType
                                value={bookingData.serviceType}
                                onChange={v => handleChange('serviceType', v)}
                                error={errors.serviceType}
                            />
                        )}
                        {step.id === 'location' && (
                            <StepLocation data={bookingData} onChange={handleChange} errors={errors} />
                        )}
                        {step.id === 'items' && (() => {
                            switch (bookingData.serviceType) {
                                case 'furniture':
                                case 'furniture_move':
                                    return <StepItemSelectionFurniture {...itemProps} />;
                                case 'office':
                                case 'office_removal':
                                    return <StepItemSelectionOffice {...itemProps} />;
                                case 'parcels':
                                case 'boxes_parcels':
                                case 'packing':
                                case 'packing_service':
                                    return <StepItemSelectionParcels {...itemProps} />;
                                case 'vehicle':
                                case 'vehicle_parts':
                                    return <StepItemSelectionVehicle {...itemProps} />;
                                case 'pallets':
                                    return <StepItemSelectionPallets {...itemProps} />;
                                default:
                                    return <StepItemSelection {...itemProps} />;
                            }
                        })()}
                        {step.id === 'datePrice' && (
                            <StepDatePrice
                                data={bookingData}
                                onChange={handleChange}
                                errors={errors}
                                distance={bookingData.distance}
                                volume={totalVolume}
                            />
                        )}
                        {step.id === 'services' && (
                            <StepAdditionalServices
                                data={bookingData}
                                onChange={handleChange}
                                errors={errors}
                                basePrice={totalPrice}
                            />
                        )}
                        {step.id === 'confirm' && (
                            <StepConfirmDetails
                                data={bookingData}
                                onEdit={handleEdit}
                                onSubmit={handleSubmit}
                                errors={errors}
                                loading={loading}
                                totalPrice={totalPrice}
                                totalVolume={totalVolume}
                                pickupLat={bookingData.pickup.lat}
                                pickupLng={bookingData.pickup.lng}
                                deliveryLat={bookingData.delivery.lat}
                                deliveryLng={bookingData.delivery.lng}
                                distance={bookingData.distance}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                {!isConfirm && (
                    <div className="flex gap-4 justify-between items-center pb-6">
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm"
                        >
                            <FiChevronLeft size={18} /> Back
                        </button>
                        <span className="text-xs text-gray-400">Step {currentStep + 1} of {STEPS.length}</span>
                        {currentStep < STEPS.length - 1 && (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition font-bold text-sm shadow-sm"
                            >
                                Next <FiChevronRight size={18} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
