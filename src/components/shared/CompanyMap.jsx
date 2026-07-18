import React, { useEffect, useRef } from "react";
import { FiNavigation } from "react-icons/fi";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const COMPANY_LOCATION = {
    lat: 52.460306,
    lng: -1.860811,
    address:
        "265 Golden Hillock Road, Sparkbrook, Birmingham, England, B11 2PH"
};

export default function CompanyMap() {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) {
            return;
        }

        const map = L.map(mapContainerRef.current, {
            scrollWheelZoom: false
        }).setView(
            [COMPANY_LOCATION.lat, COMPANY_LOCATION.lng],
            16
        );

        mapInstanceRef.current = map;

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
        ).addTo(map);

        const companyIcon = L.divIcon({
            className: "",
            html: `
        <div style="
          width:42px;
          height:42px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:50% 50% 50% 0;
          background:#DC2626;
          border:4px solid white;
          box-shadow:0 4px 12px rgba(0,0,0,.3);
          transform:rotate(-45deg);
        ">
          <div style="
            width:10px;
            height:10px;
            border-radius:50%;
            background:white;
          "></div>
        </div>
      `,
            iconSize: [42, 42],
            iconAnchor: [21, 42],
            popupAnchor: [0, -44]
        });

        L.marker(
            [COMPANY_LOCATION.lat, COMPANY_LOCATION.lng],
            { icon: companyIcon }
        )
            .addTo(map)
            .bindPopup(`
        <div style="min-width:210px;font-family:Arial,sans-serif">
          <strong style="color:#DC2626;font-size:14px">
            Khan Moves Limited
          </strong>

          <p style="
            margin:6px 0 0;
            color:#444;
            font-size:12px;
            line-height:1.5;
          ">
            ${COMPANY_LOCATION.address}
          </p>
        </div>
      `)
            .openPopup();

        const resizeTimer = setTimeout(() => {
            map.invalidateSize();
        }, 200);

        return () => {
            clearTimeout(resizeTimer);
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    const destination = encodeURIComponent(
        `${COMPANY_LOCATION.lat},${COMPANY_LOCATION.lng}`
    );

    const directionsUrl =
        `https://www.google.com/maps/dir/?api=1` +
        `&destination=${destination}` +
        `&travelmode=driving` +
        `&dir_action=navigate`;

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-md">
            <div
                ref={mapContainerRef}
                className="h-80 w-full md:h-105"
            />

            <div className="flex flex-col gap-4 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="font-bold text-gray-900">
                        Khan Moves Limited
                    </h3>

                    <p className="mt-1 max-w-2xl text-sm text-gray-600">
                        {COMPANY_LOCATION.address}
                    </p>
                </div>

                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#DC2626] px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                >
                    <FiNavigation size={17} />
                    Get Directions
                </a>
            </div>
        </div>
    );
}