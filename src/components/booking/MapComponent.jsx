import React, { useEffect, useRef } from 'react';
import { FiNavigation } from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const pickupIcon = L.divIcon({
    html: `
        <div style="
            width:32px;
            height:32px;
            background:#C0392B;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            display:flex;
            align-items:center;
            justify-content:center;
            border:2px solid #fff;
            box-shadow:0 2px 8px rgba(0,0,0,.3);
        ">
            <span style="transform:rotate(45deg);font-size:15px;">🚛</span>
        </div>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const deliveryIcon = L.divIcon({
    html: `
        <div style="
            width:32px;
            height:32px;
            background:#27AE60;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            display:flex;
            align-items:center;
            justify-content:center;
            border:2px solid #fff;
            box-shadow:0 2px 8px rgba(0,0,0,.3);
        ">
            <span style="transform:rotate(45deg);font-size:15px;">🏠</span>
        </div>
    `,
    className: '',
    iconSize: [32, 32],
});

export default function MapComponent({
    pickupLat,
    pickupLng,
    deliveryLat,
    deliveryLng,
    distance,
    time,
}) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        if (!pickupLat || !pickupLng || !deliveryLat || !deliveryLng) return;

        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, {
                zoomControl: true,
            });

            L.tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    attribution: '&copy; OpenStreetMap contributors',
                    maxZoom: 19,
                }
            ).addTo(mapInstance.current);
        }

        const map = mapInstance.current;

        // Remove old markers & route
        map.eachLayer((layer) => {
            if (
                layer instanceof L.Marker ||
                layer instanceof L.Polyline
            ) {
                map.removeLayer(layer);
            }
        });

        // Pickup marker
        L.marker([pickupLat, pickupLng], {
            icon: pickupIcon,
        })
            .addTo(map)
            .bindPopup('<strong>Pickup Location</strong>');

        // Delivery marker
        L.marker([deliveryLat, deliveryLng], {
            icon: deliveryIcon,
        })
            .addTo(map)
            .bindPopup('<strong>Delivery Location</strong>');

        // Load driving route
        const loadRoute = async () => {
            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${deliveryLng},${deliveryLat}?overview=full&geometries=geojson`
                );

                const data = await response.json();

                if (data.routes && data.routes.length) {
                    const coords =
                        data.routes[0].geometry.coordinates.map(
                            ([lng, lat]) => [lat, lng]
                        );

                    const route = L.polyline(coords, {
                        color: '#2563EB',
                        weight: 5,
                        opacity: 0.85,
                    }).addTo(map);

                    map.fitBounds(route.getBounds(), {
                        padding: [40, 40],
                    });
                } else {
                    const bounds = L.latLngBounds([
                        [pickupLat, pickupLng],
                        [deliveryLat, deliveryLng],
                    ]);

                    map.fitBounds(bounds, {
                        padding: [40, 40],
                    });
                }
            } catch (err) {
                console.error(err);

                const bounds = L.latLngBounds([
                    [pickupLat, pickupLng],
                    [deliveryLat, deliveryLng],
                ]);

                map.fitBounds(bounds, {
                    padding: [40, 40],
                });
            }
        };

        loadRoute();
    }, [pickupLat, pickupLng, deliveryLat, deliveryLng]);

    return (
        <div
            className="rounded-2xl overflow-hidden border border-gray-100 bg-white"
            style={{
                isolation: "isolate",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
        >
            <div
                ref={mapRef}
                style={{
                    height: "220px",
                    width: '100%',
                    zIndex: 0,
                }}
            />

            {distance && (
                <div className="bg-white px-3 py-2.5 flex items-center justify-between border-t border-gray-100 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <FiNavigation
                            size={13}
                            className="text-[#C0392B]"
                        />
                        <span className="text-xs text-gray-500">
                            Driving distance
                        </span>
                    </div>

                    <div>
                        <span className="font-black text-[#C0392B]">
                            {distance} mi
                        </span>

                        {time && (
                            <span className="text-xs text-gray-400 ml-2">
                                · {time}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {time && (
                <div className="bg-gray-50 border-t border-gray-200 py-2 text-center text-xs text-gray-600">
                    ⏱️ Estimated travel time: {time}
                </div>
            )}
        </div>
    );
}