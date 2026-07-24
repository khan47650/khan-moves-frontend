import React, { useMemo, useState } from "react";
import {
  FiCheck, FiChevronLeft, FiChevronRight, FiTag, FiUser, FiX
} from "react-icons/fi";
import {
  calculateTotalPrice,
  getLoadingTimeMinutes,
  getPriceBreakdown
} from "../../../utils/priceCalculator";

const TIME_SLOTS = [
  {
    value: "early",
    label: "6:00 AM – 6:00 PM",
    badge: "Free",
    badgeColor: "bg-green-500 text-white"
  },
  {
    value: "morning",
    label: "8:00 AM – 6:00 PM",
    badge: "Free",
    badgeColor: "bg-green-500 text-white"
  },
  {
    value: "afternoon",
    label: "9:00 AM – 4:00 PM",
    badge: "+£10",
    badgeColor: "bg-amber-400 text-[#1a1a1a]"
  },
  {
    value: "flexible",
    label: "I'm flexible with timing",
    badge: "Free",
    badgeColor: "bg-green-500 text-white"
  }
];

const getUKDateParts = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    hour12: false
  }).formatToParts(new Date());

  const getPart = type => parts.find(part => part.type === type)?.value || "";

  return {
    date: `${getPart("year")}-${getPart("month")}-${getPart("day")}`,
    hour: Number(getPart("hour")) || 0
  };
};

const toDateString = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function StepDatePrice({
  data,
  onChange,
  errors,
  distance = 0,
  volume = 0
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timePopup, setTimePopup] = useState(null);
  const [closing, setClosing] = useState(false);

  const isFlexible = data.dateType === "flexible";
  const ukNow = getUKDateParts();
  const loadingMinutes = getLoadingTimeMinutes(volume);

  const buildPriceData = (overrides = {}) => ({
    distance,
    volume,
    pickupFloor: data.pickupFloor,
    deliveryFloor: data.deliveryFloor,
    helperCount: data.helperCount,
    dismantleCount: data.dismantleCount,
    assemblyCount: data.assemblyCount,
    packingService: data.packingService,
    dateType: data.dateType,
    date: data.date,
    timeSlot: data.timeSlot,
    ...overrides
  });

  const selectedPrice = useMemo(
    () => calculateTotalPrice(buildPriceData()),
    [
      distance,
      volume,
      data.pickupFloor,
      data.deliveryFloor,
      data.helperCount,
      data.dismantleCount,
      data.assemblyCount,
      data.packingService,
      data.dateType,
      data.date,
      data.timeSlot
    ]
  );

  const priceDetails = useMemo(
    () => getPriceBreakdown(buildPriceData()),
    [
      distance,
      volume,
      data.pickupFloor,
      data.deliveryFloor,
      data.helperCount,
      data.dismantleCount,
      data.assemblyCount,
      data.packingService,
      data.dateType,
      data.date,
      data.timeSlot
    ]
  );

  const isDateDisabled = dateStr => {
    if (dateStr < ukNow.date) return true;
    if (dateStr === ukNow.date && ukNow.hour >= 16) return true;
    return false;
  };

  const buildDays = () => {
    const firstDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();

    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const totalDays = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();

    const days = [];

    for (let i = 0; i < offset; i++)days.push(null);

    for (let day = 1; day <= totalDays; day++) {
      const currentDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );

      const dateStr = toDateString(currentDate);
      const disabled = isDateDisabled(dateStr);

      const price = calculateTotalPrice(
        buildPriceData({
          dateType: "specific",
          date: dateStr,
          timeSlot: data.date === dateStr ? data.timeSlot : ""
        })
      );

      days.push({
        day,
        dateStr,
        disabled,
        price,
        weekDay: currentDate.getDay()
      });
    }

    return days;
  };

  const days = buildDays();

  const handleDateClick = (dateStr, disabled) => {
    if (disabled) return;

    onChange("dateType", "specific");
    onChange("date", dateStr);
    onChange("timeSlot", "");
    setTimePopup(dateStr);
    setClosing(false);
  };

  const handleTimeSelect = slotValue => {
    onChange("timeSlot", slotValue);
    setClosing(true);

    setTimeout(() => {
      setTimePopup(null);
      setClosing(false);
    }, 280);
  };

  const handleFlexibleChange = checked => {
    onChange("dateType", checked ? "flexible" : "specific");
    onChange("date", "");
    onChange("timeSlot", "");
    setTimePopup(null);
  };

  return (
    <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
      <div className="max-w-7xl mx-auto mb-3">
        <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">
          When should we collect your items?
        </h3>
        <p className="text-gray-500 text-xs mt-0.5">
          Select your pickup date, arrival window and moving crew.
        </p>
      </div>

      {(errors.date || errors.timeSlot) && (
        <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
          {errors.date || errors.timeSlot}
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 space-y-3">
          <div
            className="bg-white rounded-2xl p-4"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${isFlexible
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300"
              }`}>
              <input
                type="checkbox"
                checked={isFlexible}
                onChange={e => handleFlexibleChange(e.target.checked)}
                className="w-4 h-4 mt-0.5 shrink-0 accent-green-500"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-sm text-[#1a1a1a]">
                    I'm flexible with dates
                  </p>

                  <span className="inline-flex items-center gap-1 bg-amber-400 text-[#1a1a1a] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                    <FiTag size={9} /> Save 20%
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-0.5">
                  We will choose the best available date and apply a 20% discount.
                </p>
              </div>
            </label>
          </div>

          {!isFlexible && (
            <div
              className="bg-white rounded-2xl p-4"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-[#1a1a1a]">
                  {currentMonth.toLocaleString("en-GB", {
                    month: "long",
                    year: "numeric"
                  })}
                </h4>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                      1
                    ))}
                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                  >
                    <FiChevronLeft size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                      1
                    ))}
                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                  >
                    <FiChevronRight size={15} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 mb-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                  <div
                    key={day}
                    className="text-center text-[10px] font-bold text-gray-400 py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (!day) return <div key={`empty-${index}`} />;

                  const isSelected = data.date === day.dateStr;
                  const hasSurcharge = [0, 5, 6].includes(day.weekDay);

                  return (
                    <button
                      key={day.dateStr}
                      type="button"
                      onClick={() => handleDateClick(day.dateStr, day.disabled)}
                      disabled={day.disabled}
                      className={`relative flex flex-col items-center justify-center min-h-12 py-1.5 rounded-lg border-2 transition ${day.disabled
                        ? "text-gray-300 opacity-40 cursor-not-allowed border-transparent"
                        : isSelected
                          ? "border-[#C0392B] bg-red-50 shadow-sm"
                          : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C0392B] flex items-center justify-center">
                          <FiCheck size={9} className="text-white" strokeWidth={3} />
                        </div>
                      )}

                      <span className="text-xs font-bold">
                        {day.day}
                      </span>

                      {!day.disabled && (
                        <span className={`text-[9px] font-semibold ${hasSurcharge
                          ? "text-amber-600"
                          : "text-gray-400"
                          }`}>
                          £{day.price}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                <span className="text-[10px] text-gray-500">
                  Mon–Thu: standard
                </span>
                <span className="text-[10px] text-gray-500">
                  Fri: +5%
                </span>
                <span className="text-[10px] text-gray-500">
                  Sat: +10%
                </span>
                <span className="text-[10px] text-gray-500">
                  Sun: +15%
                </span>
              </div>

              {data.date && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">
                      Selected date
                    </p>
                    <p className="text-sm font-bold text-[#1a1a1a]">
                      {new Date(`${data.date}T12:00:00`).toLocaleDateString(
                        "en-GB",
                        {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        }
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onChange("date", "");
                      onChange("timeSlot", "");
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FiX size={15} />
                  </button>
                </div>
              )}
            </div>
          )}

          <div
            className="bg-white rounded-2xl p-4"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <h4 className="font-bold text-sm text-[#1a1a1a] mb-3 flex items-center gap-2">
              <FiUser size={15} />
              Choose your moving crew
            </h4>

            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${data.helperCount === 0
                  ? "border-[#C0392B] bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name="movingCrew"
                  value="driver"
                  checked={data.helperCount === 0}
                  onChange={() => onChange("helperCount", 0)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#C0392B]"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#1a1a1a]">
                    Driver only
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Best when you can assist the driver with loading and unloading.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${data.helperCount === 1
                  ? "border-[#C0392B] bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name="movingCrew"
                  value="helper"
                  checked={data.helperCount === 1}
                  onChange={() => onChange("helperCount", 1)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#C0392B]"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm text-[#1a1a1a]">
                      Driver with professional helper
                    </p>

                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Sit back while our two-person crew handles the loading and unloading.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div
            className="sticky top-20 bg-white rounded-2xl p-4"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-[#1a1a1a]">
                Your price
              </h4>
              <span className="text-[10px] font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                Calculated
              </span>
            </div>

            <p className="text-3xl font-black text-[#C0392B]">
              £{selectedPrice}
            </p>

            {isFlexible && (
              <p className="text-xs text-green-600 font-bold mt-1">
                20% flexible-date discount applied
              </p>
            )}

            <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
              {priceDetails.breakdown
                .filter(item => !item.label.toLowerCase().startsWith("base fee"))
                .map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="flex justify-between gap-3 text-xs"
                  >
                    <span className="text-gray-500">
                      {item.label}
                    </span>
                    <span className={`font-semibold ${item.amount < 0 ? "text-green-600" : "text-[#1a1a1a]"
                      }`}>
                      {item.amount < 0 ? "-" : "+"}£{Math.abs(item.amount)}
                    </span>
                  </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Distance</span>
                <span className="font-semibold">{distance} mi</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Volume</span>
                <span className="font-semibold">
                  {Number(volume).toFixed(1)} m³
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Estimated loading</span>
                <span className="font-semibold">
                  {loadingMinutes} mins per location
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Crew</span>
                <span className="font-semibold">
                  {data.helperCount > 0 ? "2 people" : "1 person"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {timePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className={`bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transition-all duration-300 ${closing ? "scale-75 opacity-0" : "scale-100 opacity-100"
            }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-black text-[#1a1a1a] text-base">
                  Choose a pickup time slot
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(`${timePopup}T12:00:00`).toLocaleDateString(
                    "en-GB",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long"
                    }
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTimePopup(null);
                  onChange("date", "");
                  onChange("timeSlot", "");
                }}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {TIME_SLOTS.map(slot => {
                const isSelected = data.timeSlot === slot.value;

                return (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => handleTimeSelect(slot.value)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition ${isSelected
                      ? "border-[#C0392B] bg-red-50"
                      : "border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${isSelected
                      ? "bg-[#C0392B] border-[#C0392B]"
                      : "border-gray-300"
                      }`}>
                      {isSelected && (
                        <FiCheck size={10} className="text-white" strokeWidth={3} />
                      )}
                    </div>

                    <span className="flex-1 font-semibold text-sm text-[#1a1a1a]">
                      {slot.label}
                    </span>

                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${slot.badgeColor}`}>
                      {slot.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}