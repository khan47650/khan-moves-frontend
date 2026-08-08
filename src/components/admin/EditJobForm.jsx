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
    categories,
    selectedCategoryId,
    onCategoryChange,
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

            <div className="mb-3">
                <SelectField
                    label="Category"
                    value={selectedCategoryId}
                    onChange={e =>
                        onCategoryChange(
                            e.target.value
                        )
                    }
                >
                    {categories.map(category => (
                        <option
                            key={category._id}
                            value={category._id}
                        >
                            {category.name}
                        </option>
                    ))}
                </SelectField>
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

const cloneJob = job => ({
    ...JSON.parse(JSON.stringify(job)),
    pickup: job.pickup || {},
    delivery: job.delivery || {},
    pickupFloor: job.pickupFloor || {},

    deliveryFloor: job.deliveryFloor || {},
    items: job.items || [],
    helperCount: Number(job.helperCount || 0),
    dismantleCount: Number(job.dismantleCount || 0),
    assemblyCount: Number(job.assemblyCount || 0),
    distance: Number(job.distance || 0),
    smallBoxPackingCount:
        Number(job.smallBoxPackingCount || 0),

    mediumBoxPackingCount:
        Number(job.mediumBoxPackingCount || 0),

    largeBoxPackingCount:
        Number(job.largeBoxPackingCount || 0)
});

export default function EditJobForm({ job, onUpdated, onCancel }) {
    const [data, setData] = useState(() => cloneJob(job));
    const [adminPrice, setAdminPrice] = useState("");
    const [isManualPrice, setIsManualPrice] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [availableItems, setAvailableItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");
    const [loadingItems, setLoadingItems] = useState(true);
    const [calculatingRoute, setCalculatingRoute] = useState(false);
    const [routeTime, setRouteTime] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {

        const loadItems = async () => {

            try {

                const response =
                    await api.get("/inventory/services");

                const service =
                    (response.data?.data || []).find(
                        item =>
                            item.slug === job.serviceType
                    );

                const serviceCategories =
                    service?.categories || [];

                setCategories(serviceCategories);

                if (serviceCategories.length) {

                    const firstCategory =
                        serviceCategories[0];

                    setSelectedCategoryId(
                        firstCategory._id
                    );

                    setAvailableItems(
                        (firstCategory.items || []).filter(
                            item => !item.isPaused
                        )
                    );

                }

            } catch {

                toast.error(
                    "Failed to load service items"
                );

            } finally {

                setLoadingItems(false);

            }

        };

        loadItems();

    }, [job.serviceType]);


    useEffect(() => {

        const category =
            categories.find(
                c => c._id === selectedCategoryId
            );

        setAvailableItems(
            (category?.items || []).filter(
                item => !item.isPaused
            )
        );

    }, [selectedCategoryId, categories]);

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

    const updateField = (field, value) => {

        setIsManualPrice(false);

        setData(current => ({
            ...current,
            [field]: value
        }));

    };

    const updateNested = (section, field, value) => {

        setIsManualPrice(false);

        setData(current => ({
            ...current,
            [section]: {
                ...current[section],
                [field]: value
            }
        }));

    };

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

    const changeItemQuantity = (index, amount) => {
        setIsManualPrice(false);

        setData(current => {
            const item = current.items[index];

            const nextQuantity =
                Number(item?.quantity || 0) + amount;

            const nextData = {
                ...current,
                items: current.items
                    .map((item, itemIndex) =>
                        itemIndex === index
                            ? {
                                ...item,
                                quantity:
                                    Number(item.quantity || 0) + amount
                            }
                            : item
                    )
                    .filter(item => Number(item.quantity) > 0)
            };

            if (nextQuantity <= 0) {
                if (item?.name === "Small Box") {
                    nextData.smallBoxPackingCount = 0;
                }

                if (item?.name === "Medium Box") {
                    nextData.mediumBoxPackingCount = 0;
                }

                if (item?.name === "Large Box") {
                    nextData.largeBoxPackingCount = 0;
                }
            }

            return nextData;
        });
    };

    const getSelectedBoxQuantity = boxName => {
        const item = (data.items || []).find(
            item => item.name === boxName
        );

        return Number(item?.quantity || 0);
    };

    const packingFields = {
        "Small Box": "smallBoxPackingCount",
        "Medium Box": "mediumBoxPackingCount",
        "Large Box": "largeBoxPackingCount"
    };

    const getPackingCount = boxName => {
        const field = packingFields[boxName];

        return Number(data[field] || 0);
    };

    const changePackingCount = (boxName, amount) => {
        const field = packingFields[boxName];

        const current =
            getPackingCount(boxName);

        const max =
            getSelectedBoxQuantity(boxName);

        let next =
            current + amount;

        if (next < 0) {
            next = 0;
        }

        if (next > max) {
            next = max;
        }

        setData(current => ({
            ...current,
            [field]: next
        }));

        setIsManualPrice(false);
    };
    const removeItem = index => {
        setIsManualPrice(false);

        setData(current => {
            const item = current.items[index];

            const nextData = {
                ...current,
                items: current.items.filter(
                    (_, itemIndex) => itemIndex !== index
                )
            };

            if (item?.name === "Small Box") {
                nextData.smallBoxPackingCount = 0;
            }

            if (item?.name === "Medium Box") {
                nextData.mediumBoxPackingCount = 0;
            }

            if (item?.name === "Large Box") {
                nextData.largeBoxPackingCount = 0;
            }

            return nextData;
        });
    };

    const addItem = () => {
        setIsManualPrice(false);
        const inventoryItem = availableItems.find(
            item => String(item._id || item.name) === String(selectedItem)
        );
        if (!inventoryItem) return;

        setData(current => {
            const exists =
                current.items.findIndex(
                    item =>
                        String(item.itemId) ===
                        String(inventoryItem._id)
                );

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
                        itemId: inventoryItem._id,

                        categoryId: selectedCategoryId,

                        categoryName:
                            categories.find(
                                c => c._id === selectedCategoryId
                            )?.name || "",

                        name: inventoryItem.name,

                        volume: Number(
                            inventoryItem.volume || 0
                        ),

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

    const isBoxesService = [
        "boxes",
        "boxes_parcels",
        "boxes_and_parcels"
    ].includes(data.serviceType);

    const BOX_PACKING_PRICES = {
        "Small Box": 2,
        "Medium Box": 3,
        "Large Box": 4
    };

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
            smallBoxPackingCount:
                Number(data.smallBoxPackingCount || 0),

            mediumBoxPackingCount:
                Number(data.mediumBoxPackingCount || 0),

            largeBoxPackingCount:
                Number(data.largeBoxPackingCount || 0),
            serviceType: data.serviceType,

            items: data.items,
            dateType: data.dateType || "specific",
            date: data.date,

            timeSlot: data.timeSlot || ""
        }),
        [data, totalVolume]
    );

    useEffect(() => {

        if (
            job.adminPrice === null ||
            job.adminPrice === undefined
        ) {

            setAdminPrice(totalPrice);

        }

    }, [totalPrice, job.adminPrice]);

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

            const response = await api.patch(
                `/jobs/${job._id}`, {
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
                smallBoxPackingCount:
                    Number(data.smallBoxPackingCount || 0),

                mediumBoxPackingCount:
                    Number(data.mediumBoxPackingCount || 0),

                largeBoxPackingCount:
                    Number(data.largeBoxPackingCount || 0),
                totalPrice: isManualPrice ? adminPrice : totalPrice,
                adminPrice: isManualPrice ? adminPrice : null,
                specialInstructions: data.specialInstructions
            });

            toast.success("Job updated successfully");
            onUpdated(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update job");
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        if (job.adminPrice != null) {
            setAdminPrice(job.adminPrice);
            setIsManualPrice(true);
        } else {
            setAdminPrice(totalPrice);
            setIsManualPrice(false);
        }
    }, []);

    useEffect(() => {

        if (!isManualPrice) {
            setAdminPrice(totalPrice);
        }

    }, [totalPrice, isManualPrice]);
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
                                <option value="">Select Time Slot</option>

                                <option value="early">
                                    6:00 AM – 6:00 PM
                                </option>

                                <option value="morning">
                                    8:00 AM – 6:00 PM
                                </option>

                                <option value="nine_to_five">
                                    9:00 AM – 5:00 PM
                                </option>

                                <option value="afternoon">
                                    9:00 AM – 4:00 PM
                                </option>

                                <option value="flexible">
                                    I'm flexible with timing
                                </option>
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

                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={setSelectedCategoryId}

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

                    <SelectField
                        label="Crew"
                        value={data.helperCount}
                        onChange={e =>
                            updateField(
                                "helperCount",
                                Number(e.target.value)
                            )
                        }
                    >
                        <option value={0}>1 Crew</option>
                        <option value={1}>2 Crew</option>
                    </SelectField>

                    {!isBoxesService ? (

                        <>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                                    Dismantle
                                </label>

                                <div className="flex h-10.5 items-center justify-between rounded-lg border border-gray-200 px-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateField(
                                                "dismantleCount",
                                                Math.max(
                                                    0,
                                                    Number(data.dismantleCount || 0) - 1
                                                )
                                            )
                                        }
                                        disabled={Number(data.dismantleCount || 0) <= 0}
                                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white hover:border-[#C0392B] hover:text-[#C0392B] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <FiMinus size={11} />
                                    </button>

                                    <span className="flex h-7 w-8 items-center justify-center rounded-md border border-gray-300 bg-gray-50 text-xs font-bold">
                                        {Number(data.dismantleCount || 0)}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateField(
                                                "dismantleCount",
                                                Number(data.dismantleCount || 0) + 1
                                            )
                                        }
                                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white hover:border-[#C0392B] hover:text-[#C0392B]"
                                    >
                                        <FiPlus size={11} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                                    Assembly
                                </label>

                                <div className="flex h-10.5 items-center justify-between rounded-lg border border-gray-200 px-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateField(
                                                "assemblyCount",
                                                Math.max(
                                                    0,
                                                    Number(data.assemblyCount || 0) - 1
                                                )
                                            )
                                        }
                                        disabled={Number(data.assemblyCount || 0) <= 0}
                                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white hover:border-[#C0392B] hover:text-[#C0392B] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <FiMinus size={11} />
                                    </button>

                                    <span className="flex h-7 w-8 items-center justify-center rounded-md border border-gray-300 bg-gray-50 text-xs font-bold">
                                        {Number(data.assemblyCount || 0)}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateField(
                                                "assemblyCount",
                                                Number(data.assemblyCount || 0) + 1
                                            )
                                        }
                                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white hover:border-[#C0392B] hover:text-[#C0392B]"
                                    >
                                        <FiPlus size={11} />
                                    </button>
                                </div>
                            </div>

                        </>

                    ) : (

                        <div className="col-span-2 rounded-xl border border-green-200 bg-green-50 p-3">
                            <h5 className="mb-3 text-sm font-bold text-green-700">
                                Packing
                            </h5>

                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(BOX_PACKING_PRICES).map(
                                    ([boxName, price]) => {

                                        const max =
                                            getSelectedBoxQuantity(boxName);

                                        const value =
                                            getPackingCount(boxName);

                                        if (max <= 0) {
                                            return null;
                                        }

                                        return (
                                            <div
                                                key={boxName}
                                                className="rounded-lg border border-gray-200 bg-white p-2.5"
                                            >
                                                <p className="text-center text-xs font-bold text-gray-800">
                                                    {boxName}
                                                </p>

                                                <p className="mt-0.5 text-center text-[10px] text-gray-500">
                                                    £{price} per box
                                                </p>

                                                <div className="mt-2 flex items-center justify-center gap-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            changePackingCount(
                                                                boxName,
                                                                -1
                                                            )
                                                        }
                                                        disabled={value <= 0}
                                                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white hover:border-[#C0392B] hover:text-[#C0392B] disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <FiMinus size={10} />
                                                    </button>

                                                    <span className="flex h-6 w-7 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-50 text-xs font-bold">
                                                        {value}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            changePackingCount(
                                                                boxName,
                                                                1
                                                            )
                                                        }
                                                        disabled={value >= max}
                                                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white hover:border-[#C0392B] hover:text-[#C0392B] disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <FiPlus size={10} />
                                                    </button>
                                                </div>

                                                <p className="mt-1 text-center text-[10px] text-gray-400">
                                                    Max {max}
                                                </p>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                    )}

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

            <div className="rounded-xl bg-[#1a1a1a] p-4 space-y-4">

                <div className="flex justify-between">
                    <span className="text-sm text-gray-400">
                        Total Volume
                    </span>

                    <span className="font-bold text-white">
                        {totalVolume.toFixed(2)} m³
                    </span>
                </div>

                <div className="flex justify-between items-center">

                    <span className="text-sm text-gray-400">
                        System Price
                    </span>

                    <div className="text-right">

                        {job.adminPrice != null && (
                            <div className="text-xs text-gray-500">
                                System Calculated Price
                            </div>
                        )}

                        <div
                            className={`font-bold ${job.adminPrice != null
                                ? "text-gray-500 line-through"
                                : "text-gray-300"
                                }`}
                        >
                            £{totalPrice}
                        </div>

                    </div>

                </div>

                <div>
                    <label className="mb-2 block text-sm text-gray-300">
                        Admin Price
                    </label>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={adminPrice}
                        onChange={e => {
                            const value =
                                e.target.value === ""
                                    ? ""
                                    : Number(e.target.value);

                            setAdminPrice(value);
                            setIsManualPrice(true);
                        }}
                        className="w-full rounded-lg border border-gray-600 bg-[#2A2A2A] px-3 py-2 text-lg font-bold text-[#F1C40F]"
                    />
                </div>

                <div className="flex justify-between border-t border-gray-700 pt-3">

                    <span className="text-sm text-gray-400">
                        Final Price
                    </span>

                    <span className="text-2xl font-black text-[#F1C40F]">
                        £{
                            adminPrice === ""
                                ? totalPrice
                                : adminPrice
                        }
                    </span>

                </div>

            </div>

            <div className="flex gap-3">

                <button
                    onClick={onCancel}
                    disabled={updating}
                    className="flex h-11 flex-1 items-center justify-center whitespace-nowrap rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold transition hover:bg-gray-50"
                >
                    Cancel Edit
                </button>

                <button
                    onClick={handleUpdate}
                    disabled={updating || calculatingRoute}
                    className="flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#C0392B] px-5 text-sm font-semibold text-white transition hover:bg-[#A93226] disabled:opacity-60"
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