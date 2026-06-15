/**
 * Price Calculator for Khan Moves Booking System
 * 
 * Pricing Structure:
 * - Base price by service type
 * - Volume-based pricing (£ per m³)
 * - Floor level surcharge
 * - Parking surcharge
 * - Weekend surcharge (+15%)
 * - Time slot flexibility discount
 */

const BASE_PRICES = {
  home: 150,
  office: 140,
  furniture: 80,
  parcels: 50,
  vehicle: 90,
  pallets: 100,
};

const VOLUME_RATE = 25; // £ per m³
const FLOOR_SURCHARGE = 20; // per additional floor
const PARKING_SURCHARGE = 25; // no parking fee
const WEEKEND_SURCHARGE_PERCENT = 15; // 15% extra on weekends
const FLEXIBLE_TIME_DISCOUNT = 15; // £15 discount for flexible time

export const calculatePrice = (formData) => {
  let basePrice = BASE_PRICES[formData.serviceType] || 100;

  // Volume-based pricing
  const totalVolume = formData.items.reduce(
    (sum, item) => sum + (item.volume || 0) * item.quantity,
    0
  );
  const volumeInCubicMeters = totalVolume / 1000;
  const volumeCharge = Math.ceil(volumeInCubicMeters * VOLUME_RATE);

  // Floor level surcharge (pickup)
  let floorSurcharge = 0;
  const floorMap = { ground: 0, '1st': 1, '2nd': 2, '3rd': 3 };
  const pickupFloorNumber = floorMap[formData.pickup.floorLevel] || 0;
  const deliveryFloorNumber = floorMap[formData.delivery.floorLevel] || 0;
  floorSurcharge = (pickupFloorNumber + deliveryFloorNumber) * FLOOR_SURCHARGE;

  // Parking surcharge
  let parkingSurcharge = 0;
  if (!formData.pickup.hasParking || !formData.delivery.hasParking) {
    parkingSurcharge = PARKING_SURCHARGE;
  }

  // Weekend surcharge
  let weekendSurcharge = 0;
  if (formData.date) {
    const date = new Date(formData.date);
    const day = date.getDay();
    // Friday = 5, Saturday = 6, Sunday = 0
    const isWeekend = day === 5 || day === 6 || day === 0;
    if (isWeekend) {
      const subtotal = basePrice + volumeCharge + floorSurcharge + parkingSurcharge;
      weekendSurcharge = Math.round((subtotal * WEEKEND_SURCHARGE_PERCENT) / 100);
    }
  }

  // Time slot discount
  let flexibleDiscount = 0;
  if (formData.timeSlot === 'flexible') {
    flexibleDiscount = FLEXIBLE_TIME_DISCOUNT;
  }

  // Calculate total
  let totalPrice =
    basePrice +
    volumeCharge +
    floorSurcharge +
    parkingSurcharge +
    weekendSurcharge -
    flexibleDiscount;

  // Minimum price
  totalPrice = Math.max(totalPrice, 50);

  return {
    basePrice,
    volumeCharge,
    floorSurcharge,
    parkingSurcharge,
    weekendSurcharge,
    flexibleDiscount,
    totalPrice,
  };
};

/**
 * Get pricing breakdown as human-readable text
 */
export const getPricingBreakdown = (formData) => {
  const pricing = calculatePrice(formData);
  return `
    Base Price: £${pricing.basePrice}
    Volume Charge: £${pricing.volumeCharge}
    Floor Surcharge: £${pricing.floorSurcharge}
    Parking Surcharge: £${pricing.parkingSurcharge}
    Weekend Surcharge: £${pricing.weekendSurcharge}
    Flexible Discount: -£${pricing.flexibleDiscount}
    ---
    Total: £${pricing.totalPrice}
  `;
};

/**
 * Estimated price range helper
 */
export const getPriceRange = (minVolume = 0, maxVolume = 10) => {
  const minPrice = BASE_PRICES['furniture'] + minVolume * VOLUME_RATE;
  const maxPrice =
    BASE_PRICES['home'] +
    maxVolume * VOLUME_RATE +
    FLOOR_SURCHARGE * 2 +
    PARKING_SURCHARGE;
  return {
    min: minPrice,
    max: maxPrice,
  };
};
