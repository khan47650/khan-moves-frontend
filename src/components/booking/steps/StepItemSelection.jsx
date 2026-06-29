import React, { useState } from 'react';
import { FiPlus, FiMinus, FiX, FiSearch, FiHome, FiTv, FiCoffee, FiDroplet, FiPackage, FiTool, FiBriefcase } from 'react-icons/fi';
import { itemInventory } from '../../../data/itemInventory';

const categoryIcons = {
  bedroom: FiHome, bedrooms: FiHome, living: FiTv, 'living-room': FiTv,
  kitchen: FiCoffee, bathroom: FiDroplet, 'boxes-bags': FiPackage, boxes: FiPackage,
  garden: FiTool, outdoor: FiTool, office: FiBriefcase,
};

export default function StepItemSelection({ items, onChange, error }) {
  const [selectedCategory, setSelectedCategory] = useState('bedroom');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = Object.keys(itemInventory);

  const getCount = (name) => items.find(i => i.name === name)?.quantity || 0;

  const categoryCount = (cat) =>
    items.filter(it => itemInventory[cat]?.some(inv => inv.name === it.name))
      .reduce((s, it) => s + it.quantity, 0);

  const handleAdd = (itemData) => {
    const ex = items.find(i => i.name === itemData.name);
    if (ex) onChange(items.map(i => i.name === itemData.name ? { ...i, quantity: i.quantity + 1 } : i));
    else onChange([...items, { ...itemData, quantity: 1 }]);
  };

  const handleRemove = (name) => {
    const ex = items.find(i => i.name === name);
    if (ex && ex.quantity > 1) onChange(items.map(i => i.name === name ? { ...i, quantity: i.quantity - 1 } : i));
    else onChange(items.filter(i => i.name !== name));
  };

  const prettyCat = c => c.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const filteredItems = (itemInventory[selectedCategory] || []).filter(it =>
    it.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCount = items.reduce((s, it) => s + it.quantity, 0);

  return (
    <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
      <div className="max-w-7xl mx-auto mb-3">
        <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">What are you moving?</h3>
        <p className="text-gray-500 text-xs mt-0.5">Pick from each category — we'll handle the rest.</p>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">{error}</div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── LEFT: Items selection ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-4 md:p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {/* Category tabs */}
            <div className="overflow-x-auto -mx-1 px-1 mb-4 border-b border-gray-100">
              <div className="flex gap-1 min-w-min pb-0">
                {categories.map(cat => {
                  const Icon = categoryIcons[cat] || FiPackage;
                  const count = categoryCount(cat);
                  const active = selectedCategory === cat;
                  return (
                    <button key={cat} onClick={() => { setSelectedCategory(cat); setSearchQuery(''); }}
                      className={`shrink-0 flex flex-col items-center justify-center w-20 md:w-24 px-2 py-3 text-xs font-medium transition relative ${active ? 'text-[#1a1a1a]' : 'text-gray-400 hover:text-[#1a1a1a]'}`}>
                      <Icon size={22} className="mb-1.5" />
                      <span className="whitespace-nowrap">{prettyCat(cat)}</span>
                      {count > 0 && (
                        <span className="absolute top-1 right-2 text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center bg-[#1a1a1a] text-white">{count}</span>
                      )}
                      {active && <div className="absolute -bottom-px left-2 right-2 h-0.5 bg-[#1a1a1a] rounded-full" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input type="text" placeholder="Search items…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 transition" />
            </div>

            {/* Items list */}
            <div className="lg:max-h-80 lg:overflow-y-auto pr-1">
              {filteredItems.length > 0 ? filteredItems.map((item, idx) => {
                const count = getCount(item.name);
                return (
                  <div key={idx} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                    <p className="text-sm font-medium text-[#1a1a1a] flex-1 pr-3">{item.name}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      {count === 0 ? (
                        <button onClick={() => handleAdd(item)} className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-500 transition flex items-center justify-center">
                          <FiPlus size={16} />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleRemove(item.name)} className="w-7 h-7 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"><FiMinus size={14} /></button>
                          <span className="w-6 text-center text-sm font-bold text-[#1a1a1a]">{count}</span>
                          <button onClick={() => handleAdd(item)} className="w-7 h-7 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"><FiPlus size={14} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-6 text-gray-400 text-sm">No items found for "{searchQuery}"</div>
              )}
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">Don't worry — you can edit your list any time before or after booking.</p>
          </div>
        </div>

        {/* ── RIGHT: Summary (no map) ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-white rounded-2xl p-4 md:p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-bold text-[#1a1a1a]">Your move summary</h4>
              {totalCount > 0 && (
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{totalCount} item{totalCount !== 1 ? 's' : ''}</span>
              )}
            </div>

            {items.length > 0 ? (
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.name} className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700 flex-1 truncate">{item.name}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleRemove(item.name)} className="w-5 h-5 rounded-full border border-gray-300 hover:bg-[#1a1a1a] hover:text-white text-gray-500 transition flex items-center justify-center"><FiMinus size={10} /></button>
                      <span className="text-xs font-bold text-[#1a1a1a] w-4 text-center">{item.quantity}</span>
                      <button onClick={() => handleAdd(item)} className="w-5 h-5 rounded-full border border-gray-300 hover:bg-[#1a1a1a] hover:text-white text-gray-500 transition flex items-center justify-center"><FiPlus size={10} /></button>
                      <button onClick={() => onChange(items.filter(i => i.name !== item.name))} className="text-gray-300 hover:text-red-400 transition ml-0.5"><FiX size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm leading-relaxed">Nothing added yet. Select items from the categories.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
