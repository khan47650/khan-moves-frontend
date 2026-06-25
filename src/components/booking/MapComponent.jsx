import React, { useEffect, useRef } from 'react';
import { FiMapPin, FiNavigation } from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapComponent({ pickupLat, pickupLng, deliveryLat, deliveryLng, distance, time }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        if (!pickupLat || !pickupLng || !deliveryLat || !deliveryLng) return;

        // Initialize map only once
        if (!mapInstance.current) {
            const map = L.map(mapRef.current).setView(
                [(pickupLat + deliveryLat) / 2, (pickupLng + deliveryLng) / 2],
                11
            );

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
                maxZoom: 19,
            }).addTo(map);

            mapInstance.current = map;
        }

        const map = mapInstance.current;

        // Remove old markers
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add markers
        L.marker([pickupLat, pickupLng])
            .bindPopup('📍 Pickup Location')
            .addTo(map)
            .setIcon(
                L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                })
            );

        L.marker([deliveryLat, deliveryLng])
            .bindPopup('📍 Delivery Location')
            .addTo(map)
            .setIcon(
                L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                })
            );

        // Fit bounds
        const bounds = L.latLngBounds([[pickupLat, pickupLng], [deliveryLat, deliveryLng]]);
        map.fitBounds(bounds, { padding: [50, 50] });

        return () => {
            // Cleanup not needed - reuse map instance
        };
    }, [pickupLat, pickupLng, deliveryLat, deliveryLng]);

    return (
        <div className="rounded-lg overflow-hidden border border-gray-200 shadow-lg" style={{ isolation: 'isolate' }}>
            <div
                ref={mapRef}
                style={{ height: '300px', width: '100%', zIndex: 0, position: 'relative' }}
                className="bg-gray-100"
            />
            {distance && (
                <div className="bg-white p-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FiNavigation size={18} className="text-[#C0392B]" />
                        <span className="text-sm text-gray-600">Distance</span>
                    </div>
                    <span className="font-bold text-[#C0392B] text-lg">{distance} miles</span>
                </div>
            )}
            {time && (
                <div className="bg-gray-50 px-4 py-2 text-center border-t border-gray-200 text-xs text-gray-600">
                    ⏱️ Estimated travel time: {time}
                </div>
            )}
        </div>
    );
}
