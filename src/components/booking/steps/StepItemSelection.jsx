import React, { useState } from 'react';
import { FiPlus, FiMinus, FiX } from 'react-icons/fi';
import { itemInventory } from '../../../data/itemInventory';

export default function StepItemSelection({ items, onChange, error }) {
  const [selectedCategory, setSelectedCategory] = useState('bedroom');
  const categories = Object.keys(itemInventory);

  const getItemCount = (itemName) => {
    const item = items.find((i) => i.name === itemName);
    return item ? item.quantity : 0;
  };

  // kitne items is category se select hue (badge ke liye)
  const categoryCount = (cat) =>
    items
      .filter((it) => itemInventory[cat]?.some((inv) => inv.name === it.name))
      .reduce((sum, it) => sum + it.quantity, 0);

  const handleAddItem = (itemData) => {
    const existingItem = items.find((i) => i.name === itemData.name);
    if (existingItem) {
      onChange(
        items.map((i) =>
          i.name === itemData.name ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      onChange([...items, { ...itemData, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (itemName) => {
    const existingItem = items.find((i) => i.name === itemName);
    if (existingItem && existingItem.quantity > 1) {
      onChange(
        items.map((i) =>
          i.name === itemName ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    } else {
      onChange(items.filter((i) => i.name !== itemName));
    }
  };

  const totalVolume = items.reduce(
    (sum, item) => sum + (item.volume || 0) * item.quantity,
    0
  );
  const totalCubicMeters = (totalVolume / 1000).toFixed(2);

  const prettyCat = (c) =>
    c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ');

  return (
    <div>
      <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">
        What items are you moving?
      </h3>
      <p className="text-gray-600 mb-6">
        Select items from the list below. We'll calculate volume automatically.
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Categories — DESKTOP sidebar only */}
        <div className="hidden lg:block">
          <h4 className="font-semibold text-[#1a1a1a] mb-3">Categories</h4>
          <div className="space-y-2 sticky top-4">
            {categories.map((category) => {
              const count = categoryCount(category);
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full p-3 rounded-lg text-left font-semibold transition capitalize flex items-center justify-between ${selectedCategory === category
                      ? 'bg-[#C0392B] text-white'
                      : 'bg-gray-100 text-[#1a1a1a] hover:bg-gray-200'
                    }`}
                >
                  <span>{category.replace('-', ' ')}</span>
                  {count > 0 && (
                    <span
                      className={`text-xs font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center ${selectedCategory === category
                          ? 'bg-white text-[#C0392B]'
                          : 'bg-[#C0392B] text-white'
                        }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Items (+ MOBILE category pill-bar on top) */}
        <div className="lg:col-span-2">
          {/* MOBILE category pills — horizontal scroll, sticky */}
          <div className="lg:hidden sticky top-0 z-10 bg-white -mx-1 px-1 pt-1 pb-3 mb-2 border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => {
                const count = categoryCount(category);
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition capitalize flex items-center gap-2 ${active
                        ? 'bg-[#C0392B] text-white'
                        : 'bg-gray-100 text-[#1a1a1a] hover:bg-gray-200'
                      }`}
                  >
                    {category.replace('-', ' ')}
                    {count > 0 && (
                      <span
                        className={`text-xs font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center ${active ? 'bg-white text-[#C0392B]' : 'bg-[#C0392B] text-white'
                          }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <h4 className="font-semibold text-[#1a1a1a] mb-4">
            {prettyCat(selectedCategory)}
          </h4>

          {/* items: mobile par page ke saath scroll, desktop par andar scroll */}
          <div className="space-y-3 lg:max-h-96 lg:overflow-y-auto">
            {itemInventory[selectedCategory]?.map((item, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition flex items-start justify-between"
              >
                <div className="flex-1 pr-3">
                  <h5 className="font-semibold text-[#1a1a1a] text-sm">{item.name}</h5>
                  <p className="text-xs text-gray-600 mt-1">~{item.volume}L per item</p>
                </div>

                {getItemCount(item.name) === 0 ? (
                  <button
                    onClick={() => handleAddItem(item)}
                    className="bg-[#C0392B] text-white p-2 rounded-lg hover:bg-red-800 transition shrink-0"
                  >
                    <FiPlus size={18} />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-[#C0392B] rounded-lg p-1 shrink-0">
                    <button
                      onClick={() => handleRemoveItem(item.name)}
                      className="text-white p-1 hover:bg-red-800 rounded transition"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="text-white font-bold text-sm w-6 text-center">
                      {getItemCount(item.name)}
                    </span>
                    <button
                      onClick={() => handleAddItem(item)}
                      className="text-white p-1 hover:bg-red-800 rounded transition"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Items Summary */}
      {items.length > 0 && (
        <div className="mt-8 p-6 bg-[#F1C40F] bg-opacity-10 border border-[#F1C40F] rounded-lg">
          <h4 className="font-bold text-[#1a1a1a] mb-4">Your Selection</h4>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.name} className="flex justify-between items-center">
                <span className="text-[#1a1a1a] font-semibold">{item.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 text-sm">
                    x{item.quantity} ({(item.volume * item.quantity) / 1000}L)
                  </span>
                  <button
                    onClick={() => handleRemoveItem(item.name)}
                    className="text-red-600 hover:text-red-800 transition p-1"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t-2 border-[#F1C40F]">
            <p className="text-sm text-gray-700">
              <strong>Total Volume:</strong> {totalCubicMeters} m³
            </p>
            <p className="text-xs text-gray-600 mt-2">
              This helps us price your move accurately.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}