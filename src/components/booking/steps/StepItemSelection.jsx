import React, { useEffect, useMemo, useState } from "react";
import { FiMinus, FiPackage, FiPlus, FiSearch, FiX } from "react-icons/fi";
import api from "../../../api/api";

function ItemLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-3 h-10 w-10">
        <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#1a1a1a]" />
      </div>
      <p className="text-sm text-gray-400">Loading categories and items...</p>
    </div>
  );
}

export default function StepItemSelection({ items, onChange, error, serviceType }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setCategories([]);
      setSelectedCategoryId("");
      setSearchQuery("");

      try {
        const res = await api.get("/inventory/services");
        const services = res.data?.data || [];
        const matched = services.find(service => service.slug === serviceType);
        const serviceCategories = matched?.categories || [];

        setCategories(serviceCategories);
        setSelectedCategoryId(serviceCategories[0]?._id || "");
      } catch (err) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [serviceType]);

  const selectedCategory = useMemo(
    () => categories.find(category => category._id === selectedCategoryId) || null,
    [categories, selectedCategoryId]
  );

  const activeItems = useMemo(
    () => (selectedCategory?.items || []).filter(item => !item.isPaused),
    [selectedCategory]
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return activeItems;

    return activeItems.filter(item =>
      item.name.toLowerCase().includes(query)
    );
  }, [activeItems, searchQuery]);

  const matchesItem = (selectedItem, sourceItem) => {
    const sourceId = sourceItem._id || sourceItem.itemId;

    if (selectedItem.itemId && sourceId) {
      return selectedItem.itemId === sourceId;
    }

    return selectedItem.name === sourceItem.name;
  };

  const getCount = item => {
    return items.find(selected => matchesItem(selected, item))?.quantity || 0;
  };

  const handleAdd = itemData => {
    const existing = items.find(item => matchesItem(item, itemData));
    const itemId = itemData._id || itemData.itemId;

    if (existing) {
      onChange(items.map(item =>
        matchesItem(item, itemData)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      return;
    }

    onChange([
      ...items,
      {
        itemId,
        name: itemData.name,
        volume: itemData.volume,
        quantity: 1,
        categoryId: itemData.categoryId || selectedCategory?._id,
        categoryName: itemData.categoryName || selectedCategory?.name
      }
    ]);
  };

  const handleRemove = itemData => {
    const existing = items.find(item => matchesItem(item, itemData));
    if (!existing) return;

    if (existing.quantity > 1) {
      onChange(items.map(item =>
        matchesItem(item, itemData)
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
      return;
    }

    onChange(items.filter(item => !matchesItem(item, itemData)));
  };

  const removeItem = itemData => {
    onChange(items.filter(item => !matchesItem(item, itemData)));
  };

  const handleCategoryChange = categoryId => {
    setSelectedCategoryId(categoryId);
    setSearchQuery("");
  };

  const totalCount = items.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  return (
    <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
      <div className="max-w-7xl mx-auto mb-3">
        <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">
          What are you moving?
        </h3>
        <p className="text-gray-500 text-xs mt-0.5">
          Select a category, then add the items you are moving.
        </p>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:items-stretch">
        <div className="flex-1 min-w-0">
          <div
            className="bg-white rounded-2xl overflow-hidden h-full"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            {loading ? (
              <ItemLoader />
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
                <FiPackage size={38} className="text-gray-300 mb-3" />
                <p className="text-sm font-semibold text-gray-500">
                  No categories available.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Categories have not been added for this service yet.
                </p>
              </div>
            ) : (
              <>
                {/* Categories tabs */}
                <div className="overflow-x-auto border-b border-gray-200 scrollbar-thin">
                  <div className="flex min-w-max">
                    {categories.map(category => {
                      const isSelected = selectedCategoryId === category._id;
                      const activeCount = (category.items || []).filter(
                        item => !item.isPaused
                      ).length;

                      return (
                        <button
                          key={category._id}
                          type="button"
                          onClick={() => handleCategoryChange(category._id)}
                          className={`relative min-w-36.25 md:min-w-41.25 px-4 py-4 border-r border-gray-200 transition ${isSelected
                              ? "bg-red-50 text-[#C0392B]"
                              : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                            }`}
                        >
                          <FiPackage
                            size={19}
                            className={`mx-auto mb-2 ${isSelected ? "text-[#C0392B]" : "text-gray-300"
                              }`}
                          />

                          <p className="text-sm font-semibold whitespace-nowrap">
                            {category.name}
                          </p>

                          <p className={`text-[10px] mt-1 ${isSelected ? "text-[#C0392B]/70" : "text-gray-400"
                            }`}>
                            {activeCount} item{activeCount !== 1 ? "s" : ""}
                          </p>

                          {isSelected && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C0392B]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 md:p-5">
                  {/* Search */}
                  <div className="relative mb-3">
                    <FiSearch
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder={`Search ${selectedCategory?.name || ""} items...`}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 transition"
                    />

                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      >
                        <FiX size={14} />
                      </button>
                    )}
                  </div>

                  {/* Selected category heading */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-bold text-[#1a1a1a]">
                        {selectedCategory?.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {activeItems.length} available item{activeItems.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="lg:max-h-80 lg:overflow-y-auto pr-1">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item, index) => {
                        const count = getCount(item);

                        return (
                          <div
                            key={item._id || index}
                            className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#1a1a1a] truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {item.volume} m³
                              </p>
                            </div>

                            {count === 0 ? (
                              <button
                                type="button"
                                onClick={() => handleAdd(item)}
                                className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-500 transition flex items-center justify-center shrink-0"
                              >
                                <FiPlus size={16} />
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleRemove(item)}
                                  className="w-7 h-7 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"
                                >
                                  <FiMinus size={14} />
                                </button>

                                <span className="w-7 text-center text-sm font-bold text-[#1a1a1a]">
                                  {count}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleAdd(item)}
                                  className="w-7 h-7 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"
                                >
                                  <FiPlus size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        {searchQuery
                          ? `No items found for "${searchQuery}"`
                          : `No items available in ${selectedCategory?.name || "this category"}.`
                        }
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    Select another category above to view its items.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80 flex">
          <div className="sticky top-20 w-full flex">
            <div
              className="bg-white rounded-2xl p-4 md:p-5 flex flex-col w-full lg:min-h-130"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <h4 className="text-base font-bold text-[#1a1a1a]">
                  Your move summary
                </h4>

                {totalCount > 0 && (
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                    {totalCount} item{totalCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {items.length > 0 ? (
                <div className="flex-1 space-y-1 overflow-y-auto pr-1">
                  {items.map((item, index) => (
                    <div
                      key={item.itemId || `${item.name}-${index}`}
                      className="py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 truncate">
                            {item.name}
                          </p>

                          {item.categoryName && (
                            <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                              {item.categoryName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="w-5 h-5 rounded-full border border-gray-300 hover:bg-[#1a1a1a] hover:text-white text-gray-500 transition flex items-center justify-center"
                          >
                            <FiMinus size={10} />
                          </button>

                          <span className="text-xs font-bold text-[#1a1a1a] w-5 text-center">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleAdd(item)}
                            className="w-5 h-5 rounded-full border border-gray-300 hover:bg-[#1a1a1a] hover:text-white text-gray-500 transition flex items-center justify-center"
                          >
                            <FiPlus size={10} />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeItem(item)}
                            className="text-gray-300 hover:text-red-500 transition ml-0.5"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm leading-relaxed">
                  Nothing added yet. Select a category and add items from the list.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}