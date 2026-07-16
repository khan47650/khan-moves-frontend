import React from "react";

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const formatServiceName = (service = "") => {
    return service
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const InfoRow = ({ label, value, highlight = false }) => (
    <div style={{ marginBottom: "11px" }}>
        <span
            style={{
                color: highlight ? "#C0392B" : "#555",
                fontWeight: "700",
                fontSize: "11px",
            }}
        >
            {label}:
        </span>

        <span
            style={{
                color: "#333",
                fontSize: "11px",
                marginLeft: "5px",
                lineHeight: "1.5",
            }}
        >
            {value || "—"}
        </span>
    </div>
);

const InvoicePreview = React.forwardRef(
    ({ booking, invoiceData = {} }, ref) => {
        const basePrice = Number(booking?.totalPrice || 0);
        const discount = Number(invoiceData?.discount || 0);
        const tax = Number(invoiceData?.tax || 0);
        const finalTotal = Math.max(0, basePrice - discount + tax);

        const issueDate = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        const dueDate = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        const items = booking?.items || [];

        const totalItems = items.reduce(
            (sum, item) => sum + Number(item.quantity || 1),
            0
        );

        const crewCount = Number(booking?.helperCount || 0) + 1;
        const customerAddress = [
            booking?.delivery?.address,
            booking?.delivery?.town,
            booking?.delivery?.postcode,
        ]
            .filter(Boolean)
            .join(", ");

        const pickupAddress = [
            booking?.pickup?.address,
            booking?.pickup?.town,
            booking?.pickup?.postcode,
        ]
            .filter(Boolean)
            .join(", ");

        const addServices = [
            {
                label: "Dismantling",
                value:
                    booking?.dismantleCount > 0
                        ? `${booking.dismantleCount} item${booking.dismantleCount > 1 ? "s" : ""
                        }`
                        : "N/A",
            },
            {
                label: "Assembly",
                value:
                    booking?.assemblyCount > 0
                        ? `${booking.assemblyCount} item${booking.assemblyCount > 1 ? "s" : ""
                        }`
                        : "N/A",
            },
            {
                label: "Packing",
                value: booking?.packingService ? "Included" : "N/A",
            },
            {
                label: "Helpers",
                value:
                    booking?.helperCount > 0
                        ? `${booking.helperCount}`
                        : "N/A",
            },
        ];

        const otherDetails = [
            {
                label: "Pickup Floor",
                value: booking?.pickupFloor?.floorLevel || "Ground",
            },
            {
                label: "Delivery Floor",
                value: booking?.deliveryFloor?.floorLevel || "Ground",
            },
            {
                label: "Pickup Parking",
                value:
                    booking?.pickupFloor?.hasParking === false
                        ? "No"
                        : "Yes",
            },
            {
                label: "Delivery Parking",
                value:
                    booking?.deliveryFloor?.hasParking === false
                        ? "No"
                        : "Yes",
            },
            {
                label: "Time Slot",
                value: booking?.timeSlot
                    ? formatServiceName(booking.timeSlot)
                    : "To be confirmed",
            },
        ];

        return (
            <div
                ref={ref}
                style={{
                    width: "750px",
                    minHeight: "980px",
                    background: "#ffffff",
                    color: "#1a1a1a",
                    fontFamily: "Arial, sans-serif",
                    boxSizing: "border-box",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        background: "#C0392B",
                        padding: "24px 38px 22px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                            }}
                        >
                            <div
                                style={{
                                    width: "52px",
                                    height: "52px",
                                    background: "#ffffff",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    src="/Khan_Logo_transparent.png"
                                    alt="Khan Moves Limited"
                                    crossOrigin="anonymous"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        objectFit: "contain",
                                    }}
                                />
                            </div>

                            <div>
                                <div
                                    style={{
                                        color: "#ffffff",
                                        fontSize: "18px",
                                        fontWeight: "800",
                                    }}
                                >
                                    Khan Moves Limited
                                </div>

                                <div
                                    style={{
                                        color: "rgba(255,255,255,0.8)",
                                        fontSize: "11px",
                                        marginTop: "4px",
                                    }}
                                >
                                    UK Moving Service
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                color: "#ffffff",
                                textAlign: "right",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "52px",
                                    lineHeight: "1",
                                    fontWeight: "300",
                                    letterSpacing: "2px",
                                }}
                            >
                                INVOICE
                            </div>
                        </div>
                    </div>
                </div>

                {/* Invoice Number and Date */}
                <div
                    style={{
                        padding: "14px 38px",
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #e5e5e5",
                    }}
                >
                    <div style={{ fontSize: "11px" }}>
                        <strong>Invoice No.:</strong>{" "}
                        <span style={{ color: "#C0392B" }}>
                            {booking?.bookingRef || "—"}
                        </span>
                    </div>

                    <div style={{ fontSize: "11px" }}>
                        <strong>Invoice Date:</strong> {issueDate}
                    </div>
                </div>

                <div style={{ padding: "34px 38px 30px" }}>
                    {/* Three columns */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: "30px",
                            marginBottom: "34px",
                        }}
                    >
                        <div>
                            <h3
                                style={{
                                    fontSize: "14px",
                                    margin: "0 0 16px",
                                    color: "#1a1a1a",
                                }}
                            >
                                Details
                            </h3>

                            <InfoRow
                                label="Job ID"
                                value={booking?.bookingRef}
                                highlight
                            />

                            <InfoRow
                                label="Job Date"
                                value={
                                    booking?.dateType === "flexible"
                                        ? "Flexible date"
                                        : formatDate(booking?.date)
                                }
                            />

                            <InfoRow
                                label="Address"
                                value={pickupAddress}
                            />

                            <InfoRow
                                label="Payment Due Date"
                                value={dueDate}
                                highlight
                            />
                        </div>

                        <div>
                            <h3
                                style={{
                                    fontSize: "14px",
                                    margin: "0 0 16px",
                                    color: "#1a1a1a",
                                }}
                            >
                                Customer
                            </h3>

                            <InfoRow
                                label="Name"
                                value={booking?.customer?.name}
                            />

                            <InfoRow
                                label="Contact Number"
                                value={booking?.customer?.phone}
                            />

                            <InfoRow
                                label="Email"
                                value={booking?.customer?.email}
                            />

                            <InfoRow
                                label="Address"
                                value={customerAddress}
                            />
                        </div>

                        <div>
                            <h3
                                style={{
                                    fontSize: "14px",
                                    margin: "0 0 16px",
                                    color: "#C0392B"
                                }}
                            >
                                Payment Method
                            </h3>

                            <InfoRow label="Bank Name" value="Khan Moves Limited" />
                            <InfoRow label="Account Name" value="Khan Moves Limited" />
                            <InfoRow label="Sort Code" value="20-08-64" />
                            <InfoRow label="Account Number" value="13519252" />
                        </div>
                    </div>

                    {/* Job details table */}
                    <div style={{ marginBottom: "38px" }}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "2fr 0.7fr 0.9fr 0.8fr 0.7fr",
                                borderBottom: "1px solid #bbb",
                                paddingBottom: "8px",
                                fontSize: "12px",
                                fontWeight: "700",
                            }}
                        >
                            <div>Job Details</div>
                            <div style={{ textAlign: "center" }}>Items</div>
                            <div style={{ textAlign: "center" }}>Volume</div>
                            <div style={{ textAlign: "center" }}>Crew</div>
                            <div style={{ textAlign: "center" }}>Miles</div>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "2fr 0.7fr 0.9fr 0.8fr 0.7fr",
                                paddingTop: "14px",
                                fontSize: "11px",
                                color: "#444",
                            }}
                        >
                            <div>
                                {formatServiceName(
                                    booking?.serviceType || "Moving Service"
                                )}
                            </div>

                            <div style={{ textAlign: "center" }}>
                                {totalItems}
                            </div>

                            <div style={{ textAlign: "center" }}>
                                {Number(
                                    booking?.totalVolume || 0
                                ).toFixed(2)}{" "}
                                m³
                            </div>

                            <div style={{ textAlign: "center" }}>
                                {crewCount}
                            </div>

                            <div style={{ textAlign: "center" }}>
                                {Number(booking?.distance || 0).toFixed(1)}
                            </div>
                        </div>
                    </div>

                    {/* Add Services and Others */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "90px",
                            marginBottom: "34px",
                        }}
                    >
                        <div>
                            <h3
                                style={{
                                    fontSize: "13px",
                                    margin: "0 0 8px",
                                    paddingBottom: "7px",
                                    borderBottom: "1px solid #bbb",
                                }}
                            >
                                Add Services
                            </h3>

                            {addServices.map((item) => (
                                <div
                                    key={item.label}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "10px",
                                        padding: "5px 0",
                                        fontSize: "11px",
                                    }}
                                >
                                    <span>{item.label}</span>
                                    <span>{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h3
                                style={{
                                    fontSize: "13px",
                                    margin: "0 0 8px",
                                    paddingBottom: "7px",
                                    borderBottom: "1px solid #bbb",
                                }}
                            >
                                Others
                            </h3>

                            {otherDetails.map((item) => (
                                <div
                                    key={item.label}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "10px",
                                        padding: "5px 0",
                                        fontSize: "11px",
                                    }}
                                >
                                    <span>{item.label}</span>
                                    <span>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price breakdown */}
                    {(discount > 0 || tax > 0) && (
                        <div
                            style={{
                                width: "250px",
                                marginBottom: "20px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "5px 0",
                                    fontSize: "11px",
                                }}
                            >
                                <span>Base Price</span>
                                <strong>£{basePrice.toFixed(2)}</strong>
                            </div>

                            {discount > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "5px 0",
                                        fontSize: "11px",
                                    }}
                                >
                                    <span>Discount</span>
                                    <strong>
                                        -£{discount.toFixed(2)}
                                    </strong>
                                </div>
                            )}

                            {tax > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "5px 0",
                                        fontSize: "11px",
                                    }}
                                >
                                    <span>Tax / VAT</span>
                                    <strong>+£{tax.toFixed(2)}</strong>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Payable amount */}
                    <div style={{ marginTop: "20px", marginBottom: "28px" }}>
                        <div
                            style={{
                                color: "#C0392B",
                                fontWeight: "800",
                                fontSize: "19px",
                                marginBottom: "3px",
                            }}
                        >
                            Payable Amount
                        </div>

                        <div
                            style={{
                                color: "#C0392B",
                                fontWeight: "900",
                                fontSize: "28px",
                            }}
                        >
                            £{finalTotal.toFixed(2)}
                        </div>
                    </div>

                    {/* Notes */}
                    {invoiceData?.notes && (
                        <div
                            style={{
                                borderTop: "1px solid #ddd",
                                paddingTop: "15px",
                                marginTop: "20px",
                            }}
                        >
                            <div
                                style={{
                                    color: "#C0392B",
                                    fontWeight: "700",
                                    fontSize: "11px",
                                    marginBottom: "6px",
                                }}
                            >
                                Notes
                            </div>

                            <div
                                style={{
                                    color: "#555",
                                    fontSize: "11px",
                                    whiteSpace: "pre-wrap",
                                    lineHeight: "1.6",
                                }}
                            >
                                {invoiceData.notes}
                            </div>
                        </div>
                    )}

                    {booking?.specialInstructions && (
                        <div
                            style={{
                                borderTop: "1px solid #ddd",
                                paddingTop: "15px",
                                marginTop: "20px",
                            }}
                        >
                            <div
                                style={{
                                    color: "#C0392B",
                                    fontWeight: "700",
                                    fontSize: "11px",
                                    marginBottom: "6px",
                                }}
                            >
                                Special Instructions
                            </div>

                            <div
                                style={{
                                    color: "#555",
                                    fontSize: "11px",
                                    lineHeight: "1.6",
                                }}
                            >
                                {booking.specialInstructions}
                            </div>
                        </div>
                    )}

                    {/* Company details - not footer bar */}
                    <div
                        style={{
                            borderTop: "1px solid #ccc",
                            marginTop: "38px",
                            paddingTop: "15px",
                            textAlign: "center",
                            color: "#555",
                            fontSize: "10px",
                            lineHeight: "1.6",
                        }}
                    >
                        <div>
                            265 Golden Hillock Road, Sparkbrook,
                            Birmingham, England, B11 2PH
                        </div>

                        <div>
                            07424 153126 · khanmovesuk@gmail.com
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);
InvoicePreview.displayName = "InvoicePreview";
export default InvoicePreview;