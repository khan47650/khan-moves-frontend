import React, { useEffect, useMemo, useState } from "react";
import {
    FiLoader, FiMapPin, FiMinus, FiPackage,
    FiPlus, FiSave, FiX
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/api";
import PostCodeInput from "../PostCodeInput";
import MapComponent from "../booking/MapComponent";
import { calculateTotalPrice } from "../../utils/priceCalculator";
import { formatPostcode, isValidUKPostcode } from "../../utils/postcodeValidator";

const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#C0392B]";

function TextField({ label, value, onChange, type = "text", min }) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">{label}</label>
            <input
                type={type}
                min={min}
                value={value ?? ""}
                onChange={onChange}
                className={inputClass}
            />
        </div>
    );
}

function SelectField({ label, value, onChange, children }) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">{label}</label>
            <select value={value ?? ""} onChange={onChange} className={inputClass}>
                {children}
            </select>
        </div>
    );
}

function CheckboxField({ label, checked, onChange }) {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-gray-600">
            <input
                type="checkbox"
                checked={Boolean(checked)}
                onChange={onChange}
                className="h-4 w-4 accent-[#C0392B]"
            />
            {label}
        </label>
    );
}

function LocationEditor({
    title,
    location,
    floor,
    onLocationChange,
    onPostcodeChange,
    onResolved,
    onFloorChange
}) {
    const showLift = !["ground", "basement"].includes(floor?.floorLevel);

    return (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="mb-3 flex items-center gap-2">
                <FiMapPin size={14} className="text-blue-600" />
                <h4 className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    {title}
                </h4>
            </div>

            <div className="space-y-3">
                <TextField
                    label="Address"
                    value={location?.address}
                    onChange={e => onLocationChange("address", e.target.value)}
                />

                <PostCodeInput
                    label="Postcode"
                    value={location?.postcode || ""}
                    onChange={onPostcodeChange}
                    onResolved={onResolved}
                    placeholder="e.g. B1 1AA"
                />

                {location?.town && (
                    <p className="rounded-lg bg-white/80 px-3 py-2 text-xs font-semibold text-gray-700">
                        {location.town}{location.region ? `, ${location.region}` : ""}
                    </p>
                )}

                <SelectField
                    label="Floor"
                    value={floor?.floorLevel || "ground"}
                    onChange={e => onFloorChange("floorLevel", e.target.value)}
                >
                    <option value="ground">Ground Floor</option>
                    <option value="basement">Basement</option>
                    <option value="1st">1st Floor</option>
                    <option value="2nd">2nd Floor</option>
                    <option value="3rd">3rd Floor</option>
                    <option value="4th+">4th Floor+</option>
                </SelectField>

                <div className="flex flex-wrap gap-4 rounded-lg bg-white/70 p-3">
                    {showLift && (
                        <CheckboxField
                            label="Lift Available"
                            checked={floor?.hasLift}
                            onChange={e => onFloorChange("hasLift", e.target.checked)}
                        />
                    )}
                    <CheckboxField
                        label="Parking Available"
                        checked={floor?.hasParking}
                        onChange={e => onFloorChange("hasParking", e.target.checked)}
                    />
                </div>
            </div>
        </div>
    );
}

function ItemEditor({
    items,
    availableItems,
    loading,
    selectedItem,
    onSelect,
    onAdd,
    onIncrease,
    onDecrease,
    onRemove
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
                <FiPackage size={15} className="text-[#C0392B]" />
                <h4 className="text-xs font-bold uppercase text-gray-500">
                    Items ({items.length})
                </h4>
            </div>

            <div className="mb-4 flex gap-2">
                <select
                    value={selectedItem}
                    disabled={loading}
                    onChange={e => onSelect(e.target.value)}
                    className={`${inputClass} min-w-0 flex-1 disabled:bg-gray-100`}
                >
                    <option value="">
                        {loading ? "Loading items..." : "Select item to add"}
                    </option>
                    {availableItems.map(item => (
                        <option key={item._id || item.name} value={item._id || item.name}>
                            {item.name} — {Number(item.volume || 0)} m³
                        </option>
                    ))}
                </select>

                <button
                    onClick={onAdd}
                    disabled={!selectedItem}
                    className="flex items-center gap-1 rounded-lg bg-[#C0392B] px-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                    <FiPlus size={15} /> Add
                </button>
            </div>

            {items.length === 0 ? (
                <p className="py-5 text-center text-sm text-gray-400">No items selected.</p>
            ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                    {items.map((item, index) => (
                        <div key={`${item.name}-${index}`} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">{item.name}</p>
                                <p className="text-[11px] text-gray-400">
                                    {Number(item.volume || 0)} m³ each
                                </p>
                            </div>

                            <button onClick={() => onDecrease(index)} className="flex h-7 w-7 items-center justify-center rounded-full border">
                                <FiMinus size={12} />
                            </button>
                            <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                            <button onClick={() => onIncrease(index)} className="flex h-7 w-7 items-center justify-center rounded-full border">
                                <FiPlus size={12} />
                            </button>
                            <button onClick={() => onRemove(index)} className="p-1.5 text-red-500">
                                <FiX size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const cloneBooking = booking => ({
    ...JSON.parse(JSON.stringify(booking)),
    pickup: booking.pickup || {},
    delivery: booking.delivery || {},
    pickupFloor: booking.pickupFloor || {
        floorLevel: "ground",
        hasLift: true,
        hasParking: true
    },
    deliveryFloor: booking.deliveryFloor || {
        floorLevel: "ground",
        hasLift: true,
        hasParking: true
    },
    items: booking.items || [],
    helperCount: Number(booking.helperCount || 0),
    dismantleCount: Number(booking.dismantleCount || 0),
    assemblyCount: Number(booking.assemblyCount || 0),
    distance: Number(booking.distance || 0)
});

export default function RequestEditForm({ booking, onUpdated, onCancel }) {
    const [data, setData] = useState(() => cloneBooking(booking));
    const [availableItems, setAvailableItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");
    const [loadingItems, setLoadingItems] = useState(true);
    const [calculatingRoute, setCalculatingRoute] = useState(false);
    const [routeTime, setRouteTime] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const response = await api.get("/inventory/services");
                const service = (response.data?.data || []).find(
                    item => item.slug === booking.serviceType
                );
                setAvailableItems((service?.items || []).filter(item => !item.isPaused));
            } catch {
                toast.error("Failed to load service items");
            } finally {
                setLoadingItems(false);
            }
        };

        loadItems();
    }, [booking.serviceType]);

    useEffect(() => {
        const pLat = data.pickup?.lat;
        const pLng = data.pickup?.lng;
        const dLat = data.delivery?.lat;
        const dLng = data.delivery?.lng;

        if (!pLat || !pLng || !dLat || !dLng) return;

        const controller = new AbortController();

        const calculateRoute = async () => {
            setCalculatingRoute(true);

            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`,
                    { signal: controller.signal }
                );

                const route = (await response.json()).routes?.[0];
                if (!route) throw new Error("Route not found");

                setData(current => ({
                    ...current,
                    distance: Math.round(route.distance * 0.000621371)
                }));
                setRouteTime(`${Math.round(route.duration / 60)} mins`);
            } catch (error) {
                if (error.name === "AbortError") return;

                const earthRadius = 3959;
                const latDiff = (dLat - pLat) * Math.PI / 180;
                const lngDiff = (dLng - pLng) * Math.PI / 180;
                const value =
                    Math.sin(latDiff / 2) ** 2 +
                    Math.cos(pLat * Math.PI / 180) *
                    Math.cos(dLat * Math.PI / 180) *
                    Math.sin(lngDiff / 2) ** 2;

                const miles = Math.round(
                    2 * earthRadius * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
                );

                setData(current => ({ ...current, distance: miles }));
                setRouteTime(`${Math.round(miles / 0.5)} mins`);
            } finally {
                setCalculatingRoute(false);
            }
        };

        calculateRoute();
        return () => controller.abort();
    }, [
        data.pickup?.lat,
        data.pickup?.lng,
        data.delivery?.lat,
        data.delivery?.lng
    ]);

    const updateField = (field, value) =>
        setData(current => ({ ...current, [field]: value }));

    const updateNested = (section, field, value) =>
        setData(current => ({
            ...current,
            [section]: { ...current[section], [field]: value }
        }));

    const changePostcode = (section, postcode) => {
        setData(current => ({
            ...current,
            [section]: {
                ...current[section],
                postcode,
                town: "",
                region: "",
                lat: null,
                lng: null
            },
            distance: 0
        }));
        setRouteTime(null);
    };

    const resolvePostcode = (section, details) =>
        setData(current => ({
            ...current,
            [section]: {
                ...current[section],
                postcode: details.postcode,
                town: details.district || details.town || "",
                region: details.region || "",
                lat: details.lat,
                lng: details.lng
            }
        }));

    const changeItemQuantity = (index, amount) =>
        setData(current => ({
            ...current,
            items: current.items
                .map((item, itemIndex) =>
                    itemIndex === index
                        ? { ...item, quantity: Number(item.quantity || 0) + amount }
                        : item
                )
                .filter(item => Number(item.quantity) > 0)
        }));

    const removeItem = index =>
        setData(current => ({
            ...current,
            items: current.items.filter((_, itemIndex) => itemIndex !== index)
        }));

    const addItem = () => {
        const inventoryItem = availableItems.find(
            item => String(item._id || item.name) === String(selectedItem)
        );
        if (!inventoryItem) return;

        setData(current => {
            const exists = current.items.findIndex(item => item.name === inventoryItem.name);

            if (exists !== -1) {
                return {
                    ...current,
                    items: current.items.map((item, index) =>
                        index === exists
                            ? { ...item, quantity: Number(item.quantity || 0) + 1 }
                            : item
                    )
                };
            }

            return {
                ...current,
                items: [
                    ...current.items,
                    {
                        name: inventoryItem.name,
                        volume: Number(inventoryItem.volume || 0),
                        quantity: 1,
                        custom: false
                    }
                ]
            };
        });

        setSelectedItem("");
    };

    const totalVolume = useMemo(
        () => data.items.reduce(
            (sum, item) =>
                sum + Number(item.volume || 0) * Number(item.quantity || 1),
            0
        ),
        [data.items]
    );

    const totalPrice = useMemo(
        () => calculateTotalPrice({
            distance: Number(data.distance || 0),
            volume: totalVolume,
            pickupFloor: data.pickupFloor,
            deliveryFloor: data.deliveryFloor,
            helperCount: Number(data.helperCount || 0),
            dismantleCount: Number(data.dismantleCount || 0),
            assemblyCount: Number(data.assemblyCount || 0),
            packingService: Boolean(data.packingService),
            dateType: data.dateType || "specific",
            timeSlot: data.timeSlot || ""
        }),
        [data, totalVolume]
    );

    const handleUpdate = async () => {
        if (!isValidUKPostcode(data.pickup?.postcode))
            return toast.error("Enter a valid pickup postcode");

        if (!isValidUKPostcode(data.delivery?.postcode))
            return toast.error("Enter a valid delivery postcode");

        if (!data.pickup?.lat || !data.pickup?.lng)
            return toast.error("Select pickup postcode from suggestions");

        if (!data.delivery?.lat || !data.delivery?.lng)
            return toast.error("Select delivery postcode from suggestions");

        if (!data.items.length)
            return toast.error("Add at least one item");

        if (data.dateType === "specific" && (!data.date || !data.timeSlot))
            return toast.error("Select date and time slot");

        try {
            setUpdating(true);

            const response = await api.patch(`/bookings/${booking._id}`, {
                pickup: {
                    ...data.pickup,
                    postcode: formatPostcode(data.pickup.postcode)
                },
                delivery: {
                    ...data.delivery,
                    postcode: formatPostcode(data.delivery.postcode)
                },
                pickupFloor: data.pickupFloor,
                deliveryFloor: data.deliveryFloor,
                items: data.items,
                distance: data.distance,
                dateType: data.dateType,
                date: data.date,
                timeSlot: data.timeSlot,
                helperCount: data.helperCount,
                dismantleCount: data.dismantleCount,
                assemblyCount: data.assemblyCount,
                packingService: data.packingService,
                specialInstructions: data.specialInstructions
            });

            toast.success("Booking request updated");
            onUpdated(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update request");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="space-y-4">
            <LocationEditor
                title="Pickup Location"
                location={data.pickup}
                floor={data.pickupFloor}
                onLocationChange={(field, value) => updateNested("pickup", field, value)}
                onPostcodeChange={value => changePostcode("pickup", value)}
                onResolved={details => resolvePostcode("pickup", details)}
                onFloorChange={(field, value) => updateNested("pickupFloor", field, value)}
            />

            <LocationEditor
                title="Delivery Location"
                location={data.delivery}
                floor={data.deliveryFloor}
                onLocationChange={(field, value) => updateNested("delivery", field, value)}
                onPostcodeChange={value => changePostcode("delivery", value)}
                onResolved={details => resolvePostcode("delivery", details)}
                onFloorChange={(field, value) => updateNested("deliveryFloor", field, value)}
            />

            {calculatingRoute ? (
                <div className="flex min-h-55 items-center justify-center gap-2 rounded-2xl bg-white">
                    <FiLoader className="animate-spin text-gray-400" />
                    <span className="text-xs text-gray-400">Calculating route...</span>
                </div>
            ) : data.pickup?.lat && data.delivery?.lat ? (
                <MapComponent
                    pickupLat={data.pickup.lat}
                    pickupLng={data.pickup.lng}
                    deliveryLat={data.delivery.lat}
                    deliveryLng={data.delivery.lng}
                    distance={data.distance}
                    time={routeTime}
                />
            ) : (
                <div className="rounded-2xl border bg-white p-6 text-center text-xs text-gray-400">
                    Select both postcodes to calculate the route
                </div>
            )}

            <div className="rounded-xl border p-4">
                <h4 className="mb-3 text-xs font-bold uppercase text-gray-500">
                    Date, Time & Distance
                </h4>

                <div className="space-y-3">
                    <SelectField
                        label="Date Type"
                        value={data.dateType}
                        onChange={e => {
                            const value = e.target.value;
                            setData(current => ({
                                ...current,
                                dateType: value,
                                ...(value === "flexible" && { date: "", timeSlot: "" })
                            }));
                        }}
                    >
                        <option value="specific">Specific Date</option>
                        <option value="flexible">Flexible Date</option>
                    </SelectField>

                    {data.dateType === "specific" && (
                        <div className="grid grid-cols-2 gap-3">
                            <TextField
                                label="Date"
                                type="date"
                                value={data.date}
                                onChange={e => updateField("date", e.target.value)}
                            />
                            <SelectField
                                label="Time Slot"
                                value={data.timeSlot}
                                onChange={e => updateField("timeSlot", e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="morning">Morning</option>
                                <option value="afternoon">Afternoon</option>
                            </SelectField>
                        </div>
                    )}

                    <div className="flex justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                        <span className="text-xs font-semibold text-gray-600">Driving Distance</span>
                        <span className="text-sm font-bold text-[#C0392B]">
                            {data.distance || 0} mi
                            {routeTime && <span className="ml-2 font-normal text-gray-400">· {routeTime}</span>}
                        </span>
                    </div>
                </div>
            </div>

            <ItemEditor
                items={data.items}
                availableItems={availableItems}
                loading={loadingItems}
                selectedItem={selectedItem}
                onSelect={setSelectedItem}
                onAdd={addItem}
                onIncrease={index => changeItemQuantity(index, 1)}
                onDecrease={index => changeItemQuantity(index, -1)}
                onRemove={removeItem}
            />

            <div className="rounded-xl border p-4">
                <h4 className="mb-3 text-xs font-bold uppercase text-gray-500">
                    Additional Services
                </h4>

                <div className="grid grid-cols-2 gap-3">
                    <TextField label="Helpers" type="number" min="0" value={data.helperCount}
                        onChange={e => updateField("helperCount", Number(e.target.value) || 0)} />
                    <TextField label="Dismantle" type="number" min="0" value={data.dismantleCount}
                        onChange={e => updateField("dismantleCount", Number(e.target.value) || 0)} />
                    <TextField label="Assembly" type="number" min="0" value={data.assemblyCount}
                        onChange={e => updateField("assemblyCount", Number(e.target.value) || 0)} />

                    <div className="flex items-end pb-3">
                        <CheckboxField
                            label="Packing Service"
                            checked={data.packingService}
                            onChange={e => updateField("packingService", e.target.checked)}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-xl border p-4">
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                    Special Instructions
                </label>
                <textarea
                    rows={3}
                    value={data.specialInstructions || ""}
                    onChange={e => updateField("specialInstructions", e.target.value)}
                    className={`${inputClass} resize-none`}
                />
            </div>

            <div className="rounded-xl bg-[#1a1a1a] p-4">
                <div className="mb-2 flex justify-between">
                    <span className="text-sm text-gray-400">Total Volume</span>
                    <span className="font-bold text-white">{totalVolume.toFixed(2)} m³</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Updated Price</span>
                    <span className="text-2xl font-black text-[#F1C40F]">£{totalPrice}</span>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onCancel}
                    disabled={updating}
                    className="flex-1 rounded-xl border px-4 py-3 text-sm font-bold"
                >
                    Cancel Edit
                </button>

                <button
                    onClick={handleUpdate}
                    disabled={updating || calculatingRoute}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C0392B] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                    {updating ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Updating...
                        </>
                    ) : (
                        <><FiSave size={16} /> Update Changes</>
                    )}
                </button>
            </div>
        </div>
    );
}