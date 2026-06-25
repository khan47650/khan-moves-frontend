// Pricing tiers based on distance & items
export const calculateBasePrice = ({ distance, volume, isWeekend }) => {
  let price = 100; // Base price

  // Distance multiplier
  if (distance < 10) price += 50;
  else if (distance < 25) price += 100;
  else if (distance < 50) price += 150;
  else price += 200;

  // Volume multiplier (liters to m³)
  const cubicMeters = volume / 1000;
  price += cubicMeters * 40;

  // Weekend surcharge
  if (isWeekend) price *= 1.15;

  return Math.round(price);
};

// Time slot premium
export const getTimeSlotPremium = (timeSlot) => {
  const premiums = {
    'morning': 0,
    'afternoon': 0,
    'flexible': -20, // Discount for flexible
  };
  return premiums[timeSlot] || 0;
};

// Helper helpers count
export const getHelperCost = (helperCount) => {
  if (helperCount === 0) return -75; // Driver only discount
  if (helperCount === 1) return 0; // Included
  return (helperCount - 1) * 50; // Additional helpers
};

// Services & add-ons
export const getServicesCost = ({
  dismantleCount,
  assemblyCount,
  protectionPlus,
  goodsValue,
}) => {
  let cost = 0;
  cost += dismantleCount * 20;
  cost += assemblyCount * 30;

  if (protectionPlus && goodsValue > 0) {
    // £2.4 per £100 of goods value
    cost += Math.round((goodsValue / 100) * 2.4);
  }

  return cost;
};

// Calculate total with all factors
export const calculateTotalPrice = ({
  distance,
  volume,
  date,
  timeSlot,
  helperCount,
  dismantleCount,
  assemblyCount,
  protectionPlus,
  goodsValue,
}) => {
  const dateObj = new Date(date);
  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 5 || dateObj.getDay() === 6;

  const basePrice = calculateBasePrice({ distance, volume, isWeekend });
  const timeSlotPremium = getTimeSlotPremium(timeSlot);
  const helperCost = getHelperCost(helperCount);
  const servicesCost = getServicesCost({
    dismantleCount,
    assemblyCount,
    protectionPlus,
    goodsValue,
  });

  const totalPrice = basePrice + timeSlotPremium + helperCost + servicesCost;
  return Math.max(totalPrice, 100); // Minimum £100
};

// Available dates with prices
export const getAvailableDatePricing = ({ baseDate, distance, volume }) => {
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);

    const isWeekend = date.getDay() === 0 || date.getDay() === 5 || date.getDay() === 6;
    const price = calculateBasePrice({ distance, volume, isWeekend });

    // Availability: unlimited for weekdays, limited for weekends
    const slotsLeft = isWeekend ? Math.floor(Math.random() * 3) + 1 : 999;

    dates.push({
      date: date.toISOString().split('T')[0],
      price,
      isWeekend,
      slotsLeft,
      bestPrice: !isWeekend, // Mark best prices (weekdays)
    });
  }
  return dates;
};
