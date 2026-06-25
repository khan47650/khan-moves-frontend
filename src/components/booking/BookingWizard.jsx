import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';

// Import all steps
import StepServiceType from './steps/StepServiceType';
import StepLocation from './steps/StepLocation';
import StepFloorParking from './steps/StepFloorParking';
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
  { id: 'location', label: 'Where?', title: 'Location' },
  { id: 'floor', label: 'Access', title: 'Floor & Parking' },
  { id: 'items', label: 'What Items?', title: 'Item Selection' },
  { id: 'datePrice', label: 'When?', title: 'Date & Price' },
  { id: 'services', label: 'Add-ons', title: 'Additional Services' },
  { id: 'confirm', label: 'Review', title: 'Confirm Details' },
];

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // All booking data
  const [bookingData, setBookingData] = useState({
    // Step 1: Service Type
    serviceType: '',

    // Step 2: Location
    pickup: { address: '', postcode: '', town: '', region: '', lat: null, lng: null },
    delivery: { address: '', postcode: '', town: '', region: '', lat: null, lng: null },

    // Step 3: Floor & Parking
    pickupFloor: { floorLevel: 'ground', hasLift: true, hasParking: true },
    deliveryFloor: { floorLevel: 'ground', hasLift: true, hasParking: true },

    // Step 4: Items
    items: [],

    // Step 5: Date & Price
    dateType: 'specific', // ✅ ADD THIS
    date: '',
    timeSlot: 'morning',
    helperCount: 1,

    // Step 6: Services
    protectionPlus: false,
    protectionGoodsValue: 1000,
    dismantleCount: 0,
    assemblyCount: 0,
    specialInstructions: '',

    // Step 7: Customer Details
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });

  // Calculate distance (mock - in real app use coordinates)
  const distance = 25;
  const totalVolume = bookingData.items.reduce((sum, item) => sum + (item.volume || 0) * item.quantity, 0);

  // Calculate total price
  const totalPrice = calculateTotalPrice({
    distance,
    volume: totalVolume,
    date: bookingData.date,
    timeSlot: bookingData.timeSlot,
    helperCount: bookingData.helperCount,
    dismantleCount: bookingData.dismantleCount,
    assemblyCount: bookingData.assemblyCount,
    protectionPlus: bookingData.protectionPlus,
    goodsValue: bookingData.protectionGoodsValue,
  });

  const handleChange = (key, value) => {
    setBookingData((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field
    if (errors[key]) {
      const newErrors = { ...errors };
      delete newErrors[key];
      setErrors(newErrors);
    }
  };

  const validateStep = () => {
    const newErrors = {};

    switch (STEPS[currentStep].id) {
      case 'service':
        if (!bookingData.serviceType) newErrors.serviceType = 'Please select a service';
        break;

      case 'location':
        if (!bookingData.pickup.postcode) newErrors.pickupPostcode = 'Pickup postcode required';
        if (!bookingData.delivery.postcode) newErrors.deliveryPostcode = 'Delivery postcode required';
        break;

      case 'items':
        if (bookingData.items.length === 0) newErrors.items = 'Please select at least one item';
        break;

      case 'datePrice':
        if (bookingData.dateType !== 'flexible' && !bookingData.date) {
          newErrors.date = 'Please select a date';
        }
        break;

      case 'confirm':
        if (!bookingData.customerName) newErrors.customerName = 'Name required';
        if (!bookingData.customerEmail) newErrors.customerEmail = 'Email required';
        if (!bookingData.customerPhone) newErrors.customerPhone = 'Phone required';
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      // Send booking to backend
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          totalPrice,
          distance,
          volume: totalVolume,
        }),
      });

      if (response.ok) {
        // Redirect to confirmation page
        const { bookingRef } = await response.json();
        window.location.href = `/confirmation/${bookingRef}`;
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (err) {
      alert('Error submitting booking');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stepId) => {
    const stepIndex = STEPS.findIndex((s) => s.id === stepId);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
      window.scrollTo(0, 0);
    }
  };

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const isConfirmStep = step.id === 'confirm';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`max-w-7xl mx-auto px-4 ${isConfirmStep ? 'pt-0' : 'pt-4'}`}>
        {/* Header - HIDE ON CONFIRM STEP */}
        {!isConfirmStep && (
          <div className="mb-3">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-1">Get Your Moving Quote</h1>
            <p className="text-gray-600 text-sm mb-3">
              Step {currentStep + 1} of {STEPS.length} — {step.title}
            </p>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-[#C0392B] to-red-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Step indicators - HIDE ON CONFIRM STEP */}
        {!isConfirmStep && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => idx < currentStep && setCurrentStep(idx)}
                className={`shrink-0 px-3 py-1.5 rounded-lg font-semibold text-sm transition ${idx === currentStep
                  ? 'bg-[#C0392B] text-white'
                  : idx < currentStep
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {idx < currentStep ? <FiCheckCircle className="inline mr-1" size={14} /> : `${idx + 1}.`}
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            {step.id === 'service' && (
              <StepServiceType value={bookingData.serviceType} onChange={(v) => handleChange('serviceType', v)} error={errors.serviceType} />
            )}
            {step.id === 'location' && (
              <StepLocation data={bookingData} onChange={handleChange} errors={errors} />
            )}
            {step.id === 'floor' && (
              <StepFloorParking
                data={bookingData}
                onChange={(key, field, value) =>
                  handleChange(key, { ...bookingData[key], [field]: value })
                }
              />
            )}
            {step.id === 'items' && (() => {
              const itemProps = {
                items: bookingData.items,
                onChange: (items) => handleChange('items', items),
                error: errors.items,
                pickup: bookingData.pickup,
                delivery: bookingData.delivery,
                serviceType: bookingData.serviceType,
              };

              switch (bookingData.serviceType) {
                case 'furniture':
                  return <StepItemSelectionFurniture {...itemProps} />;
                case 'office':
                  return <StepItemSelectionOffice {...itemProps} />;
                case 'parcels':
                  return <StepItemSelectionParcels {...itemProps} />;
                case 'vehicle':
                  return <StepItemSelectionVehicle {...itemProps} />;
                case 'pallets':
                  return <StepItemSelectionPallets {...itemProps} />;
                case 'home':
                default:
                  return <StepItemSelection {...itemProps} />;
              }
            })()}
            {step.id === 'datePrice' && (
              <StepDatePrice
                data={bookingData}
                onChange={handleChange}
                errors={errors}
                distance={distance}
                volume={totalVolume}
              />
            )}
            {step.id === 'services' && (
              <StepAdditionalServices
                data={bookingData}
                onChange={handleChange}
                errors={errors}
                basePrice={Math.round(totalPrice * 0.7)}
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
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation - smaller buttons */}
        {!isConfirmStep && (
          <div className="flex gap-4 justify-between items-center pb-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
            >
              <FiChevronLeft size={18} /> Back
            </button>

            <div className="text-center text-xs text-gray-600">
              Step {currentStep + 1} of {STEPS.length}
            </div>

            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#C0392B] text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm"
              >
                Next <FiChevronRight size={18} />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}