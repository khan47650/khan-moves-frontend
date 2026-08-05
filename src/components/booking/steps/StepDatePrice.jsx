import React, {
  useMemo,
  useState
} from "react";
import {
  FiAlertTriangle,
  FiCalendar,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiTag,
  FiTruck,
  FiUser,
  FiUsers,
  FiX,
  FiNavigation,
  FiBox,
  FiUsers as FiPeople
} from "react-icons/fi";
import {
  calculatePricing
} from "../../../utils/priceCalculator";
import MapComponent from "../MapComponent";

const TIME_SLOTS = [
  {
    value: "early",
    label: "6:00 AM – 6:00 PM",
    badge: "Free",
    badgeColor:
      "bg-green-500 text-white"
  },
  {
    value: "morning",
    label: "8:00 AM – 6:00 PM",
    badge: "Free",
    badgeColor:
      "bg-green-500 text-white"
  },
  {
    value: "nine_to_five",
    label: "9:00 AM – 5:00 PM",
    badge: "+£15",
    badgeColor:
      "bg-green-500 text-white"
  },
  {
    value: "afternoon",
    label: "9:00 AM – 4:00 PM",
    badge: "+£20",
    badgeColor:
      "bg-green-500 text-white"
  },
  {
    value: "flexible",
    label: "I'm flexible with timing",
    badge: "Free",
    badgeColor:
      "bg-green-500 text-white"
  }
];

const formatPrice = value => Math.round(Number(value) || 0);

const floorLabel = floor => ({
  ground: "Ground floor",
  basement: "Basement",
  "1st": "1st floor",
  "2nd": "2nd floor",
  "3rd": "3rd floor",
  "4th+": "4th floor or above"
}[floor] || "Ground floor");

const getUKDateParts = () => {
  const parts =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone:
          "Europe/London",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        hour12: false
      }
    ).formatToParts(
      new Date()
    );

  const getPart = type =>
    parts.find(
      part =>
        part.type === type
    )?.value || "";

  return {
    date: `${getPart(
      "year"
    )}-${getPart(
      "month"
    )}-${getPart("day")}`,

    hour:
      Number(
        getPart("hour")
      ) || 0
  };
};

const toDateString = date => {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function StepDatePrice({
  data,
  onChange,
  errors = {},
  distance = 0,
  volume = 0
}) {
  const [
    currentMonth,
    setCurrentMonth
  ] = useState(
    new Date()
  );

  const [
    timePopup,
    setTimePopup
  ] = useState(null);

  const [
    closing,
    setClosing
  ] = useState(false);

  const isFlexible =
    data.dateType ===
    "flexible";

  const ukNow =
    getUKDateParts();

  const totalItems = (data.items || []).reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const hasMapCoordinates =
    Number.isFinite(Number(data.pickup?.lat)) &&
    Number.isFinite(Number(data.pickup?.lng)) &&
    Number.isFinite(Number(data.delivery?.lat)) &&
    Number.isFinite(Number(data.delivery?.lng));

  const buildPriceData = (
    overrides = {}
  ) => ({
    distance,
    volume,

    pickupFloor:
      data.pickupFloor,

    deliveryFloor:
      data.deliveryFloor,

    helperCount:
      data.helperCount,

    dismantleCount:
      data.dismantleCount,

    assemblyCount:
      data.assemblyCount,

    packingService:
      data.packingService,

    dateType:
      data.dateType,

    date:
      data.date,

    timeSlot:
      data.timeSlot,

    ...overrides
  });

  const pricingResult =
    useMemo(
      () =>
        calculatePricing(
          buildPriceData()
        ),
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

  const parkingCharge = pricingResult.breakdown
    ?.filter(item =>
      item.label.toLowerCase().includes("parking")
    )
    .reduce((total, item) => total + item.amount, 0) || 0;


  const isDateDisabled = dateStr => {
    const selectedDate = new Date(`${dateStr}T00:00:00`);

    const today = new Date(`${ukNow.date}T00:00:00`);

    // Past dates
    if (selectedDate < today) {
      return true;
    }

    // Same day after 2 PM UK time
    if (dateStr === ukNow.date && ukNow.hour >= 14) {
      return true;
    }

    // Booking allowed only for next 3 months
    const lastAllowedDate = new Date(today);
    lastAllowedDate.setMonth(lastAllowedDate.getMonth() + 3);

    if (selectedDate > lastAllowedDate) {
      return true;
    }

    return false;
  };

  const buildDays = () => {
    const firstDay =
      new Date(
        currentMonth
          .getFullYear(),

        currentMonth
          .getMonth(),

        1
      ).getDay();

    const offset =
      firstDay === 0
        ? 6
        : firstDay - 1;

    const totalDays =
      new Date(
        currentMonth
          .getFullYear(),

        currentMonth
          .getMonth() + 1,

        0
      ).getDate();

    const days = [];

    const visibleStart = Math.max(
      1,
      new Date(ukNow.date).getDate() - 3
    );

    // sirf utni empty cells jitni zaroori hain
    const startWeekDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      visibleStart
    ).getDay();

    const visibleOffset =
      startWeekDay === 0 ? 6 : startWeekDay - 1;

    for (let i = 0; i < visibleOffset; i++) {
      days.push(null);
    }

    for (
      let day = visibleStart;
      day <= totalDays;
      day++
    ) {
      const currentDate =
        new Date(
          currentMonth
            .getFullYear(),

          currentMonth
            .getMonth(),

          day
        );

      const dateStr =
        toDateString(
          currentDate
        );

      const disabled =
        isDateDisabled(
          dateStr
        );

      const dayPricing =
        calculatePricing(
          buildPriceData({
            dateType:
              "specific",

            date:
              dateStr,

            timeSlot:
              data.date ===
                dateStr
                ? data.timeSlot
                : ""
          })
        );

      const hasSurcharge =
        dayPricing.breakdown.some(
          item =>
            item.label
              .toLowerCase()
              .includes(
                "surcharge"
              )
        );

      days.push({
        day,
        dateStr,
        disabled,

        price:
          dayPricing.total,

        hasSurcharge
      });
    }

    return days;
  };

  const days =
    buildDays();

  const handleDateClick = (
    dateStr,
    disabled
  ) => {
    if (disabled) {
      return;
    }

    onChange(
      "dateType",
      "specific"
    );

    onChange(
      "date",
      dateStr
    );

    onChange(
      "timeSlot",
      ""
    );

    setTimePopup(
      dateStr
    );

    setClosing(false);
  };

  const handleTimeSelect =
    slotValue => {
      onChange(
        "timeSlot",
        slotValue
      );

      setClosing(true);

      setTimeout(() => {
        setTimePopup(null);
        setClosing(false);
      }, 280);
    };

  const handleFlexibleChange =
    checked => {
      onChange(
        "dateType",
        checked
          ? "flexible"
          : "specific"
      );

      onChange(
        "date",
        ""
      );

      onChange(
        "timeSlot",
        ""
      );

      setTimePopup(null);
    };

  return (
    <div className="-mx-4 px-4 py-4">
      <div className="mx-auto mb-3 max-w-7xl">
        <h3 className="text-xl font-bold text-[#1a1a1a] md:text-2xl">
          When should we collect your items?
        </h3>

        <p className="mt-0.5 text-xs text-gray-500">
          Select your pickup date, arrival window and moving crew.
        </p>
      </div>

      {(errors.date ||
        errors.timeSlot) && (
          <div className="mx-auto mb-3 max-w-7xl rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errors.date ||
              errors.timeSlot}
          </div>
        )}

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
          <div>
            <div
              className="rounded-2xl bg-[#FDFBF8] px-4 pt-3 pb-2"
              style={{
                boxShadow:
                  "0 2px 12px rgba(0,0,0,0.06)"
              }}
            >
              <div className="mb-2 grid grid-cols-2 gap-2 md:grid-cols-3">

                {/* Driver */}

                <button
                  type="button"
                  onClick={() => onChange("helperCount", 0)}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition ${"border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 ${data.helperCount === 0
                      ? "border-black bg-black"
                      : "border-gray-300"
                      }`}
                  >
                    {data.helperCount === 0 && (
                      <FiCheck size={12} className="text-white" />
                    )}
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-semibold leading-4">
                      Driver Only
                    </p>

                    <p className="text-[10px] text-gray-500">
                      1 Person
                    </p>
                  </div>
                </button>

                {/* Driver + Helper */}

                <button
                  type="button"
                  onClick={() => onChange("helperCount", 1)}
                  className={`relative flex items-center gap-3 rounded-lg border px-3 py-2 transition ${"border-gray-200 hover:border-gray-300"
                    }`}
                >

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 ${data.helperCount === 1
                      ? "border-black bg-black"
                      : "border-gray-300"
                      }`}
                  >
                    {data.helperCount === 1 && (
                      <FiCheck size={12} className="text-white" />
                    )}
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-semibold leading-4">
                      Driver + Helper
                    </p>

                    <p className="text-[10px] text-gray-500">
                      2 People
                    </p>
                  </div>
                </button>

                {/* Flexible */}

                <button
                  type="button"
                  onClick={() => handleFlexibleChange(!isFlexible)}
                  className={`col-span-2 md:col-span-1 flex items-center justify-between rounded-lg border px-3 py-2 transition ${"border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border-2 ${isFlexible
                        ? "border-black bg-black"
                        : "border-gray-300"
                        }`}
                    >
                      {isFlexible && (
                        <FiCheck
                          size={12}
                          className="text-white"
                        />
                      )}
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-semibold leading-4">
                        Flexible Date
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-green-600 px-2 py-1 text-[8px] md:text-[9px] font-bold text-white whitespace-nowrap">
                    SAVE 20%
                  </span>
                </button>

              </div>
              <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-1">
                <h4 className="flex-1 text-center text-base font-bold text-[#1a1a1a]">
                  {currentMonth.toLocaleString(
                    "en-GB",
                    {
                      month:
                        "long",
                      year:
                        "numeric"
                    }
                  )}
                </h4>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() -
                          1,
                          1
                        )
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:border-[#C0392B] hover:text-[#C0392B]"
                  >
                    <FiChevronLeft
                      size={15}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() +
                          1,
                          1
                        )
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:border-[#C0392B] hover:text-[#C0392B]"
                  >
                    <FiChevronRight
                      size={15}
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 border-x border-t border-gray-200 bg-gray-50">
                {[
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                  "Sun"
                ].map(day => (
                  <div
                    key={day}
                    className="border-r border-gray-200 py-2 text-center text-[11px] font-semibold uppercase text-gray-500 last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden">
                {days.map(
                  (
                    day,
                    index
                  ) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${index}`}
                        />
                      );
                    }

                    const isSelected =
                      data.date ===
                      day.dateStr;

                    return (
                      <button
                        key={
                          day.dateStr
                        }
                        type="button"
                        onClick={() =>
                          handleDateClick(
                            day.dateStr,
                            day.disabled
                          )
                        }
                        disabled={
                          day.disabled
                        }
                        className={`relative flex h-11 flex-col justify-between border-r border-b border-gray-200 bg-white px-2 py-1 transition ${day.disabled
                          ? "cursor-not-allowed border-transparent text-gray-300 opacity-40"
                          : isSelected
                            ? "border-2 border-[#C0392B] bg-white shadow-md"
                            : "bg-white hover:bg-gray-50"
                          }`}
                      >
                        {isSelected && (
                          <div className="absolute right-1 top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-[#C0392B] shadow-md ring-2 ring-white">
                            <FiCheck
                              size={11}
                              strokeWidth={3.5}
                              className="text-white"
                            />
                          </div>
                        )}

                        <span
                          className={`self-start text-[10px] font-semibold ${isSelected
                            ? "text-[#1A1A1A]"
                            : "text-gray-500"
                            }`}
                        >
                          {day.day}
                        </span>

                        {!day.disabled && (
                          <span

                            className={`self-start text-[11px] font-semibold leading-none ${isSelected
                              ? "text-[#E87511]"
                              : "text-[#E87511]"
                              }`}
                          >
                            `£${formatPrice(day.price)}`
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>


            </div>
          </div>
        </div>


        <div className="self-start lg:col-span-1">
          <div
            className="sticky top-16 h-fit rounded-2xl bg-[#FDFBF8] p-3"
            style={{
              boxShadow:
                "0 2px 12px rgba(0,0,0,0.06)"
            }}
          >
            <>
              <p className="mb-3 mt-1 text-3xl font-black text-[#C0392B]">
                £ {formatPrice(pricingResult.total)}
              </p>
              {/* {pricingResult.breakdown?.length > 0 && (
                <div className="mb-3 rounded-xl border border-gray-200 bg-white p-3">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Price Breakdown
                  </h4>

                  <div className="space-y-1.5">
                    {pricingResult.breakdown.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-gray-600">
                          {item.label}
                        </span>

                        <span
                          className={`font-semibold ${item.amount < 0
                              ? "text-green-600"
                              : "text-[#1a1a1a]"
                            }`}
                        >
                          {item.amount < 0
                            ? `-£${Math.abs(formatPrice(item.amount))}`
                            : `£${formatPrice(item.amount)}`}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="my-2 border-t border-dashed border-gray-300" />

                  <div className="flex items-center justify-between text-sm font-bold">
                    <span>Total</span>
                    <span className="text-[#C0392B]">
                      £{formatPrice(pricingResult.total)}
                    </span>
                  </div>
                </div>
              )} */}

              <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                {hasMapCoordinates && (
                  <div className="h-24 overflow-hidden rounded-xl border border-gray-200">
                    <MapComponent
                      pickupLat={Number(data.pickup.lat)}
                      pickupLng={Number(data.pickup.lng)}
                      deliveryLat={Number(data.delivery.lat)}
                      deliveryLng={Number(data.delivery.lng)}
                      distance={Number(distance) || 0}
                      time={data.estimatedDeliveryTime}
                    />
                  </div>
                )}

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
                  <div className="grid grid-cols-2 gap-4">

                    {/* Pickup */}

                    <div className="flex items-start gap-2">
                      <FiMapPin
                        size={14}
                        className="mt-0.5 shrink-0 text-[#C0392B]"
                      />

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase text-gray-400">
                          Pickup
                        </p>

                        <p className="truncate text-xs font-semibold text-gray-800">
                          {data.pickup?.address || "Address not available"}
                        </p>

                        <p className="mt-0.5 text-[11px] text-gray-500">
                          {data.pickup?.postcode || "No postcode"}
                        </p>

                        <p className="mt-0.5 text-[10px] text-gray-400">
                          {floorLabel(data.pickupFloor?.floorLevel)}
                          {data.pickupFloor?.floorLevel !== "ground"
                            ? data.pickupFloor?.hasLift
                              ? " · Lift"
                              : " · No Lift"
                            : ""}
                        </p>
                      </div>
                    </div>

                    {/* Delivery */}

                    <div className="flex items-start gap-2">
                      <FiMapPin
                        size={14}
                        className="mt-0.5 shrink-0 text-green-600"
                      />

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase text-gray-400">
                          Delivery
                        </p>

                        <p className="truncate text-xs font-semibold text-gray-800">
                          {data.delivery?.address || "Address not available"}
                        </p>

                        <p className="mt-0.5 text-[11px] text-gray-500">
                          {data.delivery?.postcode || "No postcode"}
                        </p>

                        <p className="mt-0.5 text-[10px] text-gray-400">
                          {floorLabel(data.deliveryFloor?.floorLevel)}
                          {data.deliveryFloor?.floorLevel !== "ground"
                            ? data.deliveryFloor?.hasLift
                              ? " · Lift"
                              : " · No Lift"
                            : ""}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FiPackage size={14} className="text-[#C0392B]" />

                      <p className="text-xs font-bold text-gray-800">
                        Selected items
                      </p>
                    </div>

                    <span className=" top-4 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#C0392B]">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(data.items || []).map((item, index) => (
                      <div
                        key={item.itemId || `${item.name}-${index}`}
                        className="rounded-full bg-white px-2 py-1 text-[10px] font-medium"
                      >
                        <span>
                          {item.name}
                        </span>

                        <span className="ml-1 font-semibold text-[#C0392B]">
                          ×{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>

            <div className="mt-2 border-t border-gray-100 pt-2">

              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">

                <div className="flex items-center gap-1.5">
                  <FiNavigation
                    size={14}
                    className="text-[#C0392B]"
                  />

                  <span className="text-[11px] font-semibold">
                    {Number(distance).toFixed(1)} mi
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <FiBox
                    size={14}
                    className="text-[#C0392B]"
                  />

                  <span className="text-[11px] font-semibold">
                    {Number(volume).toFixed(2)} m³
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <FiPeople
                    size={14}
                    className="text-[#C0392B]"
                  />

                  <span className="text-[11px] font-semibold">
                    {data.helperCount > 0 ? "2 People" : "1 Person"}
                  </span>
                </div>

                {parkingCharge > 0 && (
                  <div className="flex items-center gap-1.5">
                    <FiMapPin
                      size={14}
                      className="text-[#C0392B]"
                    />

                    <span className="text-[11px] font-semibold">
                      Parking £{formatPrice(parkingCharge)}
                    </span>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      </div>

      {timePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            className={`w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 ${closing
              ? "scale-75 opacity-0"
              : "scale-100 opacity-100"
              }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-base font-black text-[#1a1a1a]">
                  Choose a pickup
                  time slot
                </h4>

                <p className="mt-0.5 text-xs text-gray-500">
                  {new Date(
                    `${timePopup}T12:00:00`
                  ).toLocaleDateString(
                    "en-GB",
                    {
                      weekday:
                        "long",
                      day:
                        "numeric",
                      month:
                        "long"
                    }
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTimePopup(null);

                  onChange(
                    "date",
                    ""
                  );

                  onChange(
                    "timeSlot",
                    ""
                  );
                }}
                className="rounded-lg p-1.5 hover:bg-gray-100"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {TIME_SLOTS.map(
                slot => {
                  const isSelected =
                    data.timeSlot ===
                    slot.value;

                  return (
                    <button
                      key={
                        slot.value
                      }
                      type="button"
                      onClick={() =>
                        handleTimeSelect(
                          slot.value
                        )
                      }
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${"border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${isSelected
                          ? "border-black bg-black"
                          : "border-gray-300"
                          }`}
                      >
                        {isSelected && (
                          <FiCheck
                            size={
                              10
                            }
                            strokeWidth={
                              3
                            }
                            className="text-white"
                          />
                        )}
                      </div>

                      <span className="flex-1 text-sm font-semibold text-[#1a1a1a]">
                        {
                          slot.label
                        }
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-black ${slot.badgeColor}`}
                      >
                        {
                          slot.badge
                        }
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}