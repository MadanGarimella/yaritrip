import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FiltersSidebar from "./FiltersSidebar";
import SortingBar from "./SortingBar";
import Pagination from "./Pagination";
import PackageCard from "../../components/PackageCard";

/* CODE → CITY MAPPING */
const codeToCity = {
  DXB: "Dubai",
  DEL: "India",
  SIN: "Singapore",
  BKK: "Bangkok",
};

const Results = () => {
  const [maxPrice, setMaxPrice] = useState(8000000);
  const [selectedNights, setSelectedNights] = useState("");
  const [sort, setSort] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* -------- QUERY PARAMS -------- */
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");
  const rooms = searchParams.get("rooms");
  const guests = searchParams.get("guests");

  /* -------- FETCH PACKAGES -------- */
  useEffect(() => {
    const fetchPackages = async () => {
      if (!to) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const totalRooms = rooms || 1;
        const totalGuests = guests || 1;

        let url = "";

        // ✅ KEEP DATE BUT IGNORE EFFECT
        if (from) {
          url = `http://localhost:8082/api/packages/search?fromCode=${from}&toCode=${to}&date=${date}&rooms=${totalRooms}&guests=${totalGuests}`;
        } else {
          url = `http://localhost:8082/api/packages/by-destination?toCode=${to}`;
        }

        // ✅ USE URL (IMPORTANT FIX)
        const res = await fetch(url);
        const data = await res.json();

        // ✅ SAFE FILTER (NO SHADOWING)
        setPackages(data); // trust backend
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [from, to, date, rooms, guests]); // ✅ removed date dependency
  /* -------- FILTER + SORT -------- */
  const filteredData = useMemo(() => {
    let data = [...packages];

    if (activeCategory !== "all") {
      data = data.filter((pkg) => pkg.category === activeCategory);
    }

    data = data.filter((pkg) => pkg.price <= maxPrice);

    if (selectedNights) {
      data = data.filter((pkg) => pkg.nights === Number(selectedNights));
    }

    if (sort === "priceLow") {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === "priceHigh") {
      data.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      data.sort((a, b) => b.rating - a.rating);
    }

    return data;
  }, [packages, maxPrice, selectedNights, sort]);

  const categoryCounts = useMemo(() => {
    const counts = {
      all: packages.length,
      longWeekend: 0,
      honeymoon: 0,
      beach: 0,
      northGoa: 0,
    };

    packages.forEach((pkg) => {
      if (pkg.category && counts[pkg.category] !== undefined) {
        counts[pkg.category]++;
      }
    });

    return counts;
  }, [packages]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      {/* 🔥 HERO SECTION */}
      <div className="w-full h-[420px] relative rounded-2xl overflow-hidden z-0">
        <img
          src="/beach-banner.jpg"
          alt="Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

        {to && (
          <div className="absolute bottom-48 left-8 text-white">
            <h1 className="text-4xl font-bold">
              {codeToCity[to] || to} Packages
            </h1>
            {/* <p className="text-md opacity-90">Experience beaches and sunset</p> */}
          </div>
        )}
      </div>

      {/* 🔥 OVERLAY CONTENT */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 -mt-40 relative z-20">
        {/* Sidebar */}
        <div className="bg-white rounded-2xl shadow-lg h-fit relative">
          <FiltersSidebar
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            selectedNights={selectedNights}
            setSelectedNights={setSelectedNights}
          />
        </div>

        {/* Results */}
        <div className="md:col-span-3 bg-white rounded-2xl shadow-lg px-6 pb-6 pt-1">
          <SortingBar
            sort={sort}
            setSort={setSort}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            categoryCounts={categoryCounts}
          />

          {loading && (
            <div className="text-center py-10 text-gray-500">
              Loading packages...
            </div>
          )}

          {!loading && (
            <div className="grid sm:grid-cols-3 gap-6 mt-6">
              {filteredData.length > 0 ? (
                filteredData.map((pkg, index) => (
                  <PackageCard key={pkg.id + "_" + index} pkg={pkg} />
                ))
              ) : (
                <div className="col-span-3 text-center py-16 text-gray-500">
                  No packages found for this destination.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;