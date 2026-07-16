/**
 * Khan Moves — Price Calculator
 * Based on client pricing document
 */

// ── Volume tiers (per 0.1 m³) ──────────────────────────────────────────────
const getVolumeCharge = (volumeM3) => {
  if (volumeM3 <= 0) return 0;

  let charge = 0;
  const units = volumeM3 / 0.1; // convert to 0.1m³ units

  // Tier 1: 0.0 – 3.0 m³ → £0.90 per 0.1m³
  const tier1Units = Math.min(units, 30);
  charge += tier1Units * 0.90;

  if (units <= 30) return charge;

  // Tier 2: 3.1 – 7.0 m³ → £1.10 per 0.1m³
  const tier2Units = Math.min(units - 30, 40);
  charge += tier2Units * 1.10;

  if (units <= 70) return charge;

  // Tier 3: 7.1 – 12.0 m³ → £1.30 per 0.1m³
  const tier3Units = Math.min(units - 70, 50);
  charge += tier3Units * 1.30;

  if (units <= 120) return charge;

  // Tier 4: Over 12.0 m³ → £1.80 per 0.1m³
  const tier4Units = units - 120;
  charge += tier4Units * 1.80;

  return charge;
};

// ── Distance rate ───────────────────────────────────────────────────────────
const getDistanceCharge = (distanceMiles) => {
  if (!distanceMiles || distanceMiles <= 0) return 0;
  return distanceMiles * 1.5; // £1.50 per mile
};

// ── Floor level charge (per location, per m³) ──────────────────────────────
// Applied for BOTH loading and unloading
const getFloorCharge = (floorLevel, hasLift, volumeM3) => {
  if (!floorLevel || floorLevel === 'ground') return 0;
  if (floorLevel === 'basement') return 5 * volumeM3; // flat £5 per m³

  const floorNumber = {
    '1st': 1, '2nd': 2, '3rd': 3, '4th+': 4,
  }[floorLevel] || 0;

  if (floorNumber === 0) return 0;

  const ratePerFloorPerM3 = hasLift ? 2 : 5;
  return ratePerFloorPerM3 * floorNumber * volumeM3;
};

// ── Parking charge (per location) ──────────────────────────────────────────
const getParkingCharge = (hasParking) => {
  return hasParking ? 0 : 5;
};

// ── Loading time (informational, minutes) ──────────────────────────────────
export const getLoadingTimeMinutes = (volumeM3) => {
  return Math.round(volumeM3 * 5);
};

// ── Base fee ────────────────────────────────────────────────────────────────
const BASE_FEE = 30;

// ── Main calculator ─────────────────────────────────────────────────────────
export const calculateTotalPrice = ({
  distance = 0,
  volume = 0,          // in m³
  pickupFloor = {},
  deliveryFloor = {},
  helperCount = 0,
  dismantleCount = 0,
  assemblyCount = 0,
  packingService = false,
  dateType = 'specific',
  timeSlot = '',
}) => {
  const vol = typeof volume === 'number' ? volume : 0;

  // Base fee
  let total = BASE_FEE;

  // Distance charge
  total += getDistanceCharge(distance);

  // Volume/items charge (tiered)
  total += getVolumeCharge(vol);

  // Floor charge — pickup (loading)
  total += getFloorCharge(
    pickupFloor?.floorLevel,
    pickupFloor?.hasLift,
    vol
  );

  // Floor charge — delivery (unloading) — same charge applies again
  total += getFloorCharge(
    deliveryFloor?.floorLevel,
    deliveryFloor?.hasLift,
    vol
  );

  // Parking — pickup location
  total += getParkingCharge(pickupFloor?.hasParking ?? true);

  // Parking — delivery location
  total += getParkingCharge(deliveryFloor?.hasParking ?? true);

  // Helper
  if (helperCount > 0) total += helperCount * 50;

  // Dismantle
  if (dismantleCount > 0) total += dismantleCount * 20;

  // Assembly
  if (assemblyCount > 0) total += assemblyCount * 30;

  // Packing service
  if (packingService) total += 49;

  // Time slot surcharge
  if (timeSlot === 'afternoon') total += 10;

  // Flexible date discount — 20% off
  if (dateType === 'flexible') total = total * 0.8;

  return Math.round(total);
};

// ── Breakdown (for display) ─────────────────────────────────────────────────
export const getPriceBreakdown = ({
  distance = 0,
  volume = 0,
  pickupFloor = {},
  deliveryFloor = {},
  helperCount = 0,
  dismantleCount = 0,
  assemblyCount = 0,
  packingService = false,
  dateType = 'specific',
  timeSlot = '',
}) => {
  const vol = typeof volume === 'number' ? volume : 0;

  const breakdown = [
    { label: 'Base fee', amount: BASE_FEE },
    { label: `Distance (${distance} mi)`, amount: Math.round(getDistanceCharge(distance)) },
    { label: `Items volume (${vol.toFixed(1)} m³)`, amount: Math.round(getVolumeCharge(vol)) },
  ];

  const pickupFloorCharge = getFloorCharge(pickupFloor?.floorLevel, pickupFloor?.hasLift, vol);
  if (pickupFloorCharge > 0) {
    breakdown.push({
      label: `Pickup floor (${pickupFloor?.floorLevel}${pickupFloor?.hasLift ? ' + lift' : ''})`,
      amount: Math.round(pickupFloorCharge),
    });
  }

  const deliveryFloorCharge = getFloorCharge(deliveryFloor?.floorLevel, deliveryFloor?.hasLift, vol);
  if (deliveryFloorCharge > 0) {
    breakdown.push({
      label: `Delivery floor (${deliveryFloor?.floorLevel}${deliveryFloor?.hasLift ? ' + lift' : ''})`,
      amount: Math.round(deliveryFloorCharge),
    });
  }

  const pickupParking = getParkingCharge(pickupFloor?.hasParking ?? true);
  if (pickupParking > 0) breakdown.push({ label: 'No parking (pickup)', amount: pickupParking });

  const deliveryParking = getParkingCharge(deliveryFloor?.hasParking ?? true);
  if (deliveryParking > 0) breakdown.push({ label: 'No parking (delivery)', amount: deliveryParking });

  if (helperCount > 0) breakdown.push({ label: `Helper ×${helperCount}`, amount: helperCount * 50 });
  if (dismantleCount > 0) breakdown.push({ label: `Dismantle ×${dismantleCount}`, amount: dismantleCount * 20 });
  if (assemblyCount > 0) breakdown.push({ label: `Assembly ×${assemblyCount}`, amount: assemblyCount * 30 });
  if (packingService) breakdown.push({ label: 'Packing service', amount: 49 });
  if (timeSlot === 'afternoon') breakdown.push({ label: 'Afternoon slot', amount: 10 });

  const subtotal = breakdown.reduce((s, i) => s + i.amount, 0);

  if (dateType === 'flexible') {
    breakdown.push({ label: 'Flexible date (20% off)', amount: -Math.round(subtotal * 0.2) });
  }

  const total = dateType === 'flexible' ? Math.round(subtotal * 0.8) : subtotal;

  return { breakdown, total };
};