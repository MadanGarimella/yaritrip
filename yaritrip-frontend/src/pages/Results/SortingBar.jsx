import React from "react";

const SortingBar = ({
  sort,
  setSort,
  activeCategory,
  setActiveCategory,
  categoryCounts,
}) => {
  const categories = [
    { label: "All Packages", value: "all" },
    { label: "Long Weekend", value: "longWeekend" },
    { label: "Honeymoon", value: "honeymoon" },
    { label: "Beach Side Stays", value: "beach" },
    { label: "North Goa Stays", value: "northGoa" },
  ];

  return (
    <div className="mb-6 mt-5">
      {/* Category Filter */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm border transition ${
              activeCategory === cat.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {cat.label}{" "}
            <span className="font-semibold">
              ({categoryCounts?.[cat.value] || 0})
            </span>
          </button>
        ))}
      </div>
      {/* Top Row */}
      <div className="flex justify-between items-center mt-5">
        <h2 className="text-xl font-semibold">
          Available Holiday Packages
        </h2>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg p-2 text-sm"
        >
          <option value="">Sort By</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>
  );
};

export default SortingBar;