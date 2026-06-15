import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import StepIndicator from './StepIndicator';
import StepServiceType from './steps/StepServiceType';
import StepLocation from './steps/StepLocation';
import StepFloorParking from './steps/StepFloorParking';
import StepItemSelection from './steps/StepItemSelection';
import StepDatePrice from './steps/StepDatePrice';
import { generateAVNumber } from '../../utils/generateAVNumber';

export default function BookingWizard({ setBookingData, setAVNumber }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: '',
    pickup: {
      address: '',
      postcode: '',
      floorLevel: 'ground',
      hasLift: false,
      hasParking: false,
    },
    delivery: {
      address: '',
      postcode: '',
      floorLevel: 'ground',
      hasLift: false,
      hasParking: false,
    },
    items: [],
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    timeSlot: 'morning',
    specialInstructions: '',
  });

  const [errors, setErrors] = useState({});

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.serviceType) {
          newErrors.serviceType = 'Please select a service type';
        }
        break;
      case 2:
        if (!formData.pickup.postcode.trim()) {
          newErrors.pickupPostcode = 'Pickup postcode is required';
        }
        if (!formData.delivery.postcode.trim()) {
          newErrors.deliveryPostcode = 'Delivery postcode is required';
        }
        break;
      case 3:
        // Floor and parking are pre-selected, no validation needed
        break;
      case 4:
        if (formData.items.length === 0) {
          newErrors.items = 'Please select at least one item';
        }
        break;
      case 5:
        if (!formData.customerName.trim()) {
          newErrors.customerName = 'Name is required';
        }
        if (!formData.customerEmail.trim()) {
          newErrors.customerEmail = 'Email is required';
        }
        if (!formData.customerPhone.trim()) {
          newErrors.customerPhone = 'Phone is required';
        }
        if (!formData.date) {
          newErrors.date = 'Date is required';
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    const avNumber = generateAVNumber();
    setAVNumber(avNumber);
    setBookingData({
      ...formData,
      avNumber,
    });
    navigate('/confirmation');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepServiceType
            value={formData.serviceType}
            onChange={(serviceType) =>
              setFormData({ ...formData, serviceType })
            }
            error={errors.serviceType}
          />
        );
      case 2:
        return (
          <StepLocation
            data={formData}
            onChange={(field, value) =>
              setFormData({ ...formData, [field]: value })
            }
            errors={errors}
          />
        );
      case 3:
        return (
          <StepFloorParking
            data={formData}
            onChange={(section, field, value) =>
              setFormData({
                ...formData,
                [section]: { ...formData[section], [field]: value },
              })
            }
          />
        );
      case 4:
        return (
          <StepItemSelection
            items={formData.items}
            onChange={(items) => setFormData({ ...formData, items })}
            error={errors.items}
          />
        );
      case 5:
        return (
          <StepDatePrice
            data={formData}
            onChange={(field, value) =>
              setFormData({ ...formData, [field]: value })
            }
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  const stepTitles = [
    'Service Type',
    'Location Details',
    'Floor & Parking',
    'Items to Move',
    'Booking Details',
  ];

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {/* Header with Progress */}
        <StepIndicator currentStep={currentStep} totalSteps={5} title={stepTitles[currentStep - 1]} />

        {/* Step Content */}
        <div className="p-8 md:p-10">
          <div className="min-h-96">{renderStep()}</div>

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FiArrowLeft size={18} /> Back
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 rounded-lg font-semibold bg-[#C0392B] text-white hover:bg-red-800 transition"
            >
              {currentStep === 5 ? 'Complete Booking' : 'Next'}{' '}
              <FiArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
