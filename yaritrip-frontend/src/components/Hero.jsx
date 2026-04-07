import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpeg";

/* -------- GLOBAL AIRPORT CITIES -------- */
const airportCities = [
  { city: "Hyderabad", country: "India", code: "HYD" },
  { city: "Delhi", country: "India", code: "DEL" },
  { city: "Kerala", country: "India", code: "KD" },
  { city: "Kashmir", country: "India", code: "SXR" },
  { city: "Andaman", country: "India", code: "IXZ" },
  { city: "Mumbai", country: "India", code: "BOM" },
  { city: "Dubai", country: "UAE", code: "DXB" },
  { city: "Kuala Lumpur", country: "Malaysia", code: "KUL" },
  { city: "Vietnam", country: "Vietnam", code: "VN" },
  { city: "Singapore", country: "Singapore", code: "SIN" },
  { city: "Bali", country: "Indonesia", code: "DPS" },
  { city: "Bangkok", country: "Thailand", code: "PG" },
  { city: "Male", country: "Maldives", code: "MLE" },
];

const Hero = () => {
  const [open, setOpen] = useState(null);
  const [fromCity, setFromCity] = useState(null);
  const [destination, setDestination] = useState(null);
  const [date, setDate] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [swapAnim, setSwapAnim] = useState(false);

  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  /* ---------- Close dropdown on outside click ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (key) => {
    setOpen((prev) => (prev === key ? null : key));
  };

  /* -------- Smart Swap -------- */
  const handleSwap = () => {
    if (!fromCity || !destination) return;

    if (fromCity.code === destination.code) {
      alert("Departure and Destination cannot be the same airport.");
      return;
    }

    setSwapAnim(true);
    setTimeout(() => {
      const temp = fromCity;
      setFromCity(destination);
      setDestination(temp);
      setSwapAnim(false);
    }, 250);
  };

  /* -------- Filter Logic -------- */
  const filteredFrom = airportCities.filter(
    (item) =>
      item.city.toLowerCase().includes(searchFrom.toLowerCase()) ||
      item.code.toLowerCase().includes(searchFrom.toLowerCase()),
  );

  const filteredTo = airportCities.filter(
    (item) =>
      item.city.toLowerCase().includes(searchTo.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTo.toLowerCase()),
  );

  const handleSearch = () => {
    if (!fromCity || !destination || !date || !rooms) {
      alert("Please select all fields.");
      return;
    }

    if (fromCity.code === destination.code) {
      alert("Departure and Destination cannot be the same.");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];
    const [roomCount, guestCount] = rooms.match(/\d+/g).map(Number);

    navigate(
      `/results?from=${fromCity.code}&to=${destination.code}&date=${formattedDate}&rooms=${roomCount}&guests=${guestCount}`,
    );
  };

  return (
    <section className="relative w-full h-[80vh] sm:h-[90vh] md:min-h-[95svh] overflow-visible">
      {/* ✅ Background Image FIXED */}
      <img
        className="
    absolute inset-0 
    w-full h-full 
    object-cover 
    object-[25%_center]   /* focus shift */
    sm:object-center      /* reset for larger screens */
  "
        src={heroBg}
        alt="Hero Background"
      />

      {/* Optional overlay for better readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[100svh] px-4">
        <h1 className="text-white text-xl sm:text-3xl md:text-4xl text-center max-w-4xl leading-tight font-serif mt-3">
          Travel the world smoothly with <br /> deals that actually hit
        </h1>

        {/* Search Card */}
        <div
          ref={wrapperRef}
          className="mt-12 w-full max-w-5xl bg-white/10 backdrop-blur-xl 
          rounded-2xl shadow-2xl p-5 relative z-30"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* FROM + DESTINATION */}
            <div className="relative md:col-span-2 flex gap-4">
              {/* FROM */}
              <div className="relative border border-white/30 rounded-xl p-3 flex-1">
                <p className="text-xs text-white">From city</p>
                <p
                  className="font-semibold text-white cursor-pointer"
                  onClick={() => toggle("from")}
                >
                  {fromCity
                    ? `${fromCity.city} (${fromCity.code}), ${fromCity.country}`
                    : "Select City"}
                </p>

                {open === "from" && (
                  <div className="absolute top-full left-0 mt-3 bg-white rounded-xl shadow-xl p-3 w-full max-h-[250px] overflow-y-auto z-50">
                    <input
                      type="text"
                      placeholder="Search city..."
                      className="w-full border p-2 rounded mb-2 text-sm"
                      value={searchFrom}
                      onChange={(e) => setSearchFrom(e.target.value)}
                    />
                    {filteredFrom.map((item) => (
                      <p
                        key={item.code}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setFromCity(item);
                          setOpen(null);
                          setSearchFrom("");
                        }}
                      >
                        {item.city} ({item.code}), {item.country}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* DESTINATION */}
              <div className="relative border border-white/30 rounded-xl p-3 flex-1">
                <p className="text-xs text-white">Destination</p>
                <p
                  className="font-semibold text-white cursor-pointer"
                  onClick={() => toggle("destination")}
                >
                  {destination
                    ? `${destination.city} (${destination.code}), ${destination.country}`
                    : "Select Destination"}
                </p>

                {open === "destination" && (
                  <div className="absolute top-full left-0 mt-3 bg-white rounded-xl shadow-xl p-3 w-full max-h-[250px] overflow-y-auto z-50">
                    <input
                      type="text"
                      placeholder="Search city..."
                      className="w-full border p-2 rounded mb-2 text-sm"
                      value={searchTo}
                      onChange={(e) => setSearchTo(e.target.value)}
                    />
                    {filteredTo.map((item) => (
                      <p
                        key={item.code}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setDestination(item);
                          setOpen(null);
                          setSearchTo("");
                        }}
                      >
                        {item.city} ({item.code}), {item.country}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap */}
              <button
                onClick={handleSwap}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                bg-white text-black w-9 h-9 rounded-full shadow-lg"
              >
                ⇄
              </button>
            </div>

            {/* DATE */}
            <div className="relative border border-white/30 rounded-xl p-3">
              <p className="text-xs text-white">Departure Date</p>
              <p
                className="font-semibold text-white cursor-pointer"
                onClick={() => toggle("date")}
              >
                {date ? date.toLocaleDateString("en-GB") : "Select Date"}
              </p>

              {open === "date" && (
                <div className="absolute top-full mt-3 z-50 bg-white p-4 rounded-xl shadow-xl">
                  <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setOpen(null);
                    }}
                    disabled={{ before: new Date() }}
                  />
                </div>
              )}
            </div>

            {/* ROOMS */}
            <div className="relative border border-white/30 rounded-xl p-3">
              <p className="text-xs text-white">Rooms & Guests</p>
              <p
                className="font-semibold text-white cursor-pointer"
                onClick={() => toggle("rooms")}
              >
                {rooms || "Select Rooms"}
              </p>

              {open === "rooms" && (
                <div className="absolute top-full mt-3 bg-white rounded-xl shadow-xl p-3 w-full z-50">
                  {[
                    "1 Room • 2 Guests",
                    "2 Rooms • 4 Guests",
                    "3 Rooms • 6 Guests",
                  ].map((opt) => (
                    <p
                      key={opt}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setRooms(opt);
                        setOpen(null);
                      }}
                    >
                      {opt}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg"
            >
              Go Search 🔍
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;