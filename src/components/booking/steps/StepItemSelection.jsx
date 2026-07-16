import React, { useState, useEffect } from 'react';
import { FiPlus, FiMinus, FiX, FiSearch, FiPackage } from 'react-icons/fi';
import api from '../../../api/api';

function ItemLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-10 h-10 mb-3">
        <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1a1a1a] animate-spin" />
      </div>
      <p className="text-sm text-gray-400">Loading items...</p>
    </div>
  );
}

export default function StepItemSelection({ items, onChange, error, serviceType }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [apiItems, setApiItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await api.get('/inventory/services');
        const services = res.data?.data || [];
        const matched = services.find(s => s.slug === serviceType);
        if (matched) {
          setApiItems((matched.items || []).filter(it => !it.isPaused));
        }
      } catch (err) {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [serviceType]);

  const getCount = (name) => items.find(i => i.name === name)?.quantity || 0;

  const handleAdd = (itemData) => {
    const ex = items.find(i => i.name === itemData.name);
    if (ex) onChange(items.map(i => i.name === itemData.name ? { ...i, quantity: i.quantity + 1 } : i));
    else onChange([...items, { name: itemData.name, volume: itemData.volume, quantity: 1 }]);
  };

  const handleRemove = (name) => {
    const ex = items.find(i => i.name === name);
    if (ex && ex.quantity > 1) onChange(items.map(i => i.name === name ? { ...i, quantity: i.quantity - 1 } : i));
    else onChange(items.filter(i => i.name !== name));
  };

  const filteredItems = apiItems.filter(it =>
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

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:items-stretch">
        {/* ── LEFT: Items selection ── */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl p-4 md:p-5 h-full" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

            {/* Search */}
            <div className="relative mb-3">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input type="text" placeholder="Search items…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 transition" />
            </div>

            {/* Items list */}
            <div className="lg:max-h-80 lg:overflow-y-auto pr-1">
              {loading ? <ItemLoader /> : filteredItems.length > 0 ? filteredItems.map((item, idx) => {
                const count = getCount(item.name);
                return (
                  <div key={item._id || idx} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                    <div className="flex-1 pr-3">
                      <p className="text-sm font-medium text-[#1a1a1a]">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.volume} m³</p>
                    </div>
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
                <div className="text-center py-6 text-gray-400 text-sm">
                  {searchQuery ? `No items found for "${searchQuery}"` : 'No items available.'}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">Don't worry — you can edit your list any time before or after booking.</p>
          </div>
        </div>

        {/* ── RIGHT: Summary ── */}
        <div className="w-full lg:w-80 flex">
          <div className="sticky top-20 w-full flex">
            <div className="bg-white rounded-2xl p-4 md:p-5 flex flex-col w-full min-h-162.5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-bold text-[#1a1a1a]">Your move summary</h4>
                {totalCount > 0 && (
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{totalCount} item{totalCount !== 1 ? 's' : ''}</span>
                )}
              </div>

              {items.length > 0 ? (
                <div className="flex-1 space-y-1 overflow-y-auto pr-1">
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
                <p className="text-gray-400 text-sm leading-relaxed">Nothing added yet. Select items from the list.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
