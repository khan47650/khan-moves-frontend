import React, {
  useMemo,
  useState
} from "react";
import {
  FiAlertTriangle,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiTag,
  FiTruck,
  FiUser,
  FiX
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
      "bg-amber-400 text-[#1a1a1a]"
  },
  {
    value: "afternoon",
    label: "9:00 AM – 4:00 PM",
    badge: "+£20",
    badgeColor:
      "bg-amber-400 text-[#1a1a1a]"
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

  const requiresContactSupport =
    pricingResult
      .requiresContactSupport;

  const isDateDisabled =
    dateStr => {
      if (
        dateStr <
        ukNow.date
      ) {
        return true;
      }

      if (dateStr === ukNow.date && ukNow.hour >= 14) {
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

    for (
      let index = 0;
      index < offset;
      index += 1
    ) {
      days.push(null);
    }

    for (
      let day = 1;
      day <= totalDays;
      day += 1
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

        requiresContactSupport:
          dayPricing
            .requiresContactSupport,

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
    <div className="-mx-4 bg-[#F9F8F6] px-4 py-4">
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

      {requiresContactSupport && (
        <div className="mx-auto mb-4 max-w-7xl rounded-xl border border-amber-300 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <FiAlertTriangle
                size={20}
              />
            </div>

            <div>
              <h4 className="font-bold text-amber-900">
                Custom Quote Required
              </h4>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                Due to the size and
                distance of this move,
                please contact our
                customer support team
                for a confirmed quote.
              </p>

              <a
                href="tel:+447424153126"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#C0392B] px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800"
              >
                <FiPhone size={15} />
                Call 07424 153126
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div
            className="rounded-2xl bg-white p-4"
            style={{
              boxShadow:
                "0 2px 12px rgba(0,0,0,0.06)"
            }}
          >
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition ${isFlexible
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <input
                type="checkbox"
                checked={
                  isFlexible
                }
                onChange={event =>
                  handleFlexibleChange(
                    event.target
                      .checked
                  )
                }
                className="mt-0.5 h-4 w-4 shrink-0 accent-green-500"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-[#1a1a1a]">
                    I'm flexible
                    with dates
                  </p>

                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#1a1a1a]">
                    <FiTag
                      size={9}
                    />
                    Save 20%
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-gray-500">
                  We will choose the
                  best available date
                  and apply a 20%
                  discount.
                </p>
              </div>
            </label>
          </div>

          {!isFlexible && (
            <div
              className="rounded-2xl bg-white p-4"
              style={{
                boxShadow:
                  "0 2px 12px rgba(0,0,0,0.06)"
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#1a1a1a]">
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
                    className="rounded-lg p-1.5 hover:bg-gray-100"
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
                    className="rounded-lg p-1.5 hover:bg-gray-100"
                  >
                    <FiChevronRight
                      size={15}
                    />
                  </button>
                </div>
              </div>

              <div className="mb-1 grid grid-cols-7">
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
                    className="py-1 text-center text-[10px] font-bold text-gray-400"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
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
                        className={`relative flex min-h-14 flex-col items-center justify-center rounded-lg border-2 py-1.5 transition ${day.disabled
                          ? "cursor-not-allowed border-transparent text-gray-300 opacity-40"
                          : isSelected
                            ? "border-[#C0392B] bg-red-50 shadow-sm"
                            : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                          }`}
                      >
                        {isSelected && (
                          <div className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C0392B]">
                            <FiCheck
                              size={
                                9
                              }
                              strokeWidth={
                                3
                              }
                              className="text-white"
                            />
                          </div>
                        )}

                        <span className="text-xs font-bold">
                          {day.day}
                        </span>

                        {!day.disabled && (
                          <span
                            className={`text-[9px] font-semibold ${day.hasSurcharge
                              ? "text-amber-600"
                              : "text-gray-400"
                              }`}
                          >
                            {day.requiresContactSupport
                              ? "Quote"
                              : `£${formatPrice(
                                day.price
                              )}`}
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-3">
                <span className="text-[10px] text-gray-500">
                  Today: +30%
                </span>
                <span className="text-[10px] text-gray-500">
                  Tomorrow:
                  +22%
                </span>

                <span className="text-[10px] text-gray-500">
                  2nd day:
                  +14%
                </span>

                <span className="text-[10px] text-gray-500">
                  Fri: +7%
                </span>

                <span className="text-[10px] text-gray-500">
                  Sat: +4%
                </span>

                <span className="text-[10px] text-gray-500">
                  Sun: +5%
                </span>
              </div>

              {data.date && (
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-gray-400">
                      Selected date
                    </p>

                    <p className="text-sm font-bold text-[#1a1a1a]">
                      {new Date(
                        `${data.date}T12:00:00`
                      ).toLocaleDateString(
                        "en-GB",
                        {
                          weekday:
                            "short",
                          day:
                            "numeric",
                          month:
                            "short",
                          year:
                            "numeric"
                        }
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onChange(
                        "date",
                        ""
                      );

                      onChange(
                        "timeSlot",
                        ""
                      );
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
            className="rounded-2xl bg-white p-4"
            style={{
              boxShadow:
                "0 2px 12px rgba(0,0,0,0.06)"
            }}
          >
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1a1a1a]">
              <FiUser size={15} />
              Choose your moving crew
            </h4>

            <div className="space-y-2">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition ${data.helperCount ===
                  0
                  ? "border-[#C0392B] bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name="movingCrew"
                  value="driver"
                  checked={
                    data.helperCount ===
                    0
                  }
                  onChange={() =>
                    onChange(
                      "helperCount",
                      0
                    )
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#C0392B]"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#1a1a1a]">
                    Driver only
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Best when you can
                    assist the driver
                    with loading and
                    unloading.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition ${data.helperCount ===
                  1
                  ? "border-[#C0392B] bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name="movingCrew"
                  value="helper"
                  checked={
                    data.helperCount ===
                    1
                  }
                  onChange={() =>
                    onChange(
                      "helperCount",
                      1
                    )
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#C0392B]"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-[#1a1a1a]">
                      Driver with
                      professional
                      helper
                    </p>

                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      Recommended
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    Sit back while
                    our two-person
                    crew handles the
                    loading and
                    unloading.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div
            className="sticky top-20 rounded-2xl bg-white p-4"
            style={{
              boxShadow:
                "0 2px 12px rgba(0,0,0,0.06)"
            }}
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#1a1a1a]">
                {requiresContactSupport
                  ? "Your quote"
                  : "Your price"}
              </h4>

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${requiresContactSupport
                  ? "bg-amber-100 text-amber-800"
                  : "bg-green-50 text-green-700"
                  }`}
              >
                {requiresContactSupport
                  ? "Support required"
                  : "Calculated"}
              </span>
            </div>

            {requiresContactSupport ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <FiAlertTriangle
                  size={23}
                  className="mb-2 text-amber-700"
                />

                <p className="font-bold text-amber-900">
                  Custom Quote
                  Required
                </p>

                <p className="mt-2 text-xs leading-5 text-amber-800">
                  This move needs a
                  custom transport
                  review because of
                  its volume and
                  distance.
                </p>
              </div>
            ) : (
              <>
                <p className="text-3xl font-black text-[#C0392B]">
                  £
                  {formatPrice(
                    pricingResult.total
                  )}
                </p>

                {isFlexible && (
                  <p className="mt-1 text-xs font-bold text-green-600">
                    20% flexible-date
                    discount applied
                  </p>
                )}

                {pricingResult.multiTrip && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3">
                    <FiTruck
                      size={16}
                      className="mt-0.5 shrink-0 text-blue-700"
                    />

                    <p className="text-xs leading-5 text-blue-800">
                      {
                        pricingResult.tripsNeeded
                      }{" "}
                      van trips are
                      included in this
                      price.
                    </p>
                  </div>
                )}

                <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                  {hasMapCoordinates && (
                    <div className="h-44 overflow-hidden rounded-xl border border-gray-200">
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

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <div className="mb-2 flex items-start gap-2">
                      <FiMapPin size={14} className="mt-0.5 shrink-0 text-[#C0392B]" />

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
                              ? " · Lift available"
                              : " · No lift"
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex items-start gap-2">
                        <FiMapPin size={14} className="mt-0.5 shrink-0 text-green-600" />

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
                                ? " · Lift available"
                                : " · No lift"
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FiPackage size={14} className="text-[#C0392B]" />

                        <p className="text-xs font-bold text-gray-800">
                          Selected items
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#C0392B]">
                        {totalItems}
                      </span>
                    </div>

                    <div className="max-h-28 space-y-1 overflow-y-auto pr-1">
                      {(data.items || []).map((item, index) => (
                        <div
                          key={item.itemId || `${item.name}-${index}`}
                          className="flex items-center justify-between gap-2 rounded-md bg-white px-2.5 py-1.5 text-[11px]"
                        >
                          <span className="truncate text-gray-600">
                            {item.name}
                          </span>

                          <span className="shrink-0 font-bold text-gray-800">
                            ×{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Distance
                </span>

                <span className="font-semibold">
                  {Number(
                    distance
                  ).toFixed(1)}{" "}
                  mi
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Volume
                </span>

                <span className="font-semibold">
                  {Number(
                    volume
                  ).toFixed(2)}{" "}
                  m³
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Crew
                </span>

                <span className="font-semibold">
                  {data.helperCount >
                    0
                    ? "2 people"
                    : "1 person"}
                </span>
              </div>

              {!requiresContactSupport &&
                pricingResult.tripsNeeded >
                1 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Van trips
                    </span>

                    <span className="font-semibold">
                      {
                        pricingResult.tripsNeeded
                      }
                    </span>
                  </div>
                )}
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
                      className={`flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition ${isSelected
                        ? "border-[#C0392B] bg-red-50"
                        : "border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${isSelected
                          ? "border-[#C0392B] bg-[#C0392B]"
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