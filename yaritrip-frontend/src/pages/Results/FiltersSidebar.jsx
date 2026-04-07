const FiltersSidebar = ({
  maxPrice,
  setMaxPrice,
  selectedNights,
  setSelectedNights,
}) => {
  return (
    <div className="bg-white w-full max-w-xs rounded-2xl shadow-md overflow-y-auto h-screen p-4 space-y-6 mt-5">
      <div className="text-xl font-medium">
        FILTERS
      </div>
      {/* Duration */}
      <div>
        <p className="text-sm font-medium mb-2">Duration (In Nights)</p>
        <input
          type="range"
          min="1"
          max="10"
          value={selectedNights || 5}
          onChange={(e) => setSelectedNights(e.target.value)}
          className="w-full accent-orange-500"
        />
      </div>

      {/* Flights */}
      {/* <div>
        <p className="text-sm font-medium mb-3">Flights</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-full border border-orange-400 text-orange-500 text-sm">
            With Flights
          </button>
          <button className="px-4 py-2 rounded-full border border-orange-400 text-orange-500 text-sm">
            Without Flights
          </button>
        </div>
      </div> */}

      {/* Budget */}
      <div>
        <p className="text-sm font-medium mb-2">Budget (Per Person)</p>
        <input
          type="range"
          min="10000"
          max="80000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-orange-500"
        />

        <div className="mt-3 space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            ₹10,000
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            ₹10,000 - ₹15,000
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            ₹15,000 - ₹20,000
          </label>
        </div>
      </div>

      {/* Hotel Category */}
      <div>
        <p className="text-sm font-medium mb-2">Hotel Category</p>
        <div className="space-y-2 text-sm">
          {["2★", "3★", "4★", "5★"].map((star) => (
            <label key={star} className="flex items-center gap-2">
              <input type="checkbox" />
              {star}
            </label>
          ))}
        </div>
      </div>

      {/* Cities */}
      <div>
        <p className="text-sm font-medium mb-2">Cities</p>

        <input
          type="text"
          placeholder="Search City"
          className="w-full border rounded-lg p-2 text-sm mb-3"
        />

        <div className="space-y-2 text-sm">
          {["Agatti", "Goa", "Hampi"].map((city) => (
            <label key={city} className="flex items-center gap-2">
              <input type="checkbox" />
              {city}
            </label>
          ))}
        </div>
      </div>

      {/* Themes */}
      <div>
        <p className="text-sm font-medium mb-2">Themes</p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Culture
        </label>
      </div>

      {/* Package Type */}
      <div>
        <p className="text-sm font-medium mb-3">Package Type</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-full border border-orange-400 text-orange-500 text-sm">
            Customization
          </button>
          <button className="px-4 py-2 rounded-full border border-orange-400 text-orange-500 text-sm">
            Group Package
          </button>
        </div>
      </div>

      {/* Premium */}
      <div>
        <p className="text-sm font-medium mb-2">Premium Packages</p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Premium Packages
        </label>
      </div>

      {/* Buy Now Pay Later */}
      {/* <div>
        <p className="text-sm font-medium mb-2">Buy Now Pay Later</p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Book @ ₹2,000
        </label>
      </div> */}
    </div>
  );
};

export default FiltersSidebar;