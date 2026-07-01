import React, { useState } from 'react';
import { FiTruck, FiDownload, FiPlus, FiAlertCircle } from 'react-icons/fi';
import { dummyVehicles } from '../../../data/adminDummyData';

export default function Vehicles() {
    const [vehicles] = useState(dummyVehicles);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const handleDownloadMot = (vehicle) => {
        const link = document.createElement('a');
        link.href = vehicle.motImageUrl;
        link.download = `${vehicle.regNumber}-MOT.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Vehicle Management</h1>
            <p className="text-gray-500 mb-8">Manage van specifications, MOT, and assignments.</p>

            <button className="flex items-center gap-2 px-4 py-2 bg-[#C0392B] text-white rounded-lg hover:bg-red-800 transition font-semibold mb-8">
                <FiPlus size={18} /> Add Vehicle
            </button>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-1 max-h-96 overflow-y-auto">
                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Vehicles</h3>
                    <div className="space-y-2">
                        {vehicles.map(vehicle => (
                            <button
                                key={vehicle.id}
                                onClick={() => setSelectedVehicle(vehicle)}
                                className={`w-full text-left p-3 rounded-lg border-2 transition ${selectedVehicle?.id === vehicle.id
                                    ? 'border-[#C0392B] bg-red-50'
                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                                    }`}
                            >
                                <p className="font-semibold text-[#1a1a1a] flex items-center gap-2">
                                    <FiTruck size={16} /> {vehicle.regNumber}
                                </p>
                                <p className="text-xs text-gray-500">{vehicle.makeModel}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {selectedVehicle ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#1a1a1a]">{selectedVehicle.regNumber}</h2>
                                    <p className="text-gray-500">{selectedVehicle.makeModel}</p>
                                </div>
                                <button
                                    onClick={() => handleDownloadMot(selectedVehicle)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                                >
                                    <FiDownload size={16} /> Copy of MOT
                                </button>
                            </div>

                            <div className="mb-8 pb-8 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Vehicle Details</h3>
                                <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                                    <p className="text-gray-500">Type</p><p className="font-semibold text-gray-700">{selectedVehicle.type}</p>
                                    <p className="text-gray-500">Category</p><p className="font-semibold text-gray-700">{selectedVehicle.category}</p>
                                    <p className="text-gray-500">Make / Model</p><p className="font-semibold text-gray-700">{selectedVehicle.makeModel}</p>
                                </div>
                            </div>

                            <div className="mb-8 pb-8 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Van Specifications</h3>
                                <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                                    <p className="text-gray-500">Loading Capacity</p><p className="font-semibold text-gray-700">{selectedVehicle.loadingCapacity}</p>
                                    <p className="text-gray-500">Payload</p><p className="font-semibold text-gray-700">{selectedVehicle.payload}</p>
                                    <p className="text-gray-500">Max Length</p><p className="font-semibold text-gray-700">{selectedVehicle.maxLength}</p>
                                    <p className="text-gray-500">Motorbikes Capacity</p><p className="font-semibold text-gray-700">{selectedVehicle.motorbikesCapacity}</p>
                                    <p className="text-gray-500">Tail Lift</p><p className="font-semibold text-gray-700">{selectedVehicle.tailLift}</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Other Information</h3>
                                <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                                    <p className="text-gray-500">Fuel Type</p><p className="font-semibold text-gray-700">{selectedVehicle.fuelType}</p>
                                    <p className="text-gray-500">Seats</p><p className="font-semibold text-gray-700">{selectedVehicle.seats}</p>
                                    <p className="text-gray-500">Use of Trailer</p><p className="font-semibold text-gray-700">{selectedVehicle.useOfTrailer}</p>
                                    <p className="text-gray-500">Location</p><p className="font-semibold text-gray-700">{selectedVehicle.location}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-3">
                                <FiAlertCircle className="text-gray-400" size={18} />
                                <p className="text-sm text-gray-600">Assigned to driver: <span className="font-semibold text-[#C0392B]">{selectedVehicle.assignedDriver}</span></p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <p className="text-gray-500">Select a vehicle to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}