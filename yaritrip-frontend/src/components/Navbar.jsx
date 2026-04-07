import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/* -------- AIRPORT LIST -------- */
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

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  /* ROUTE CHECK */
  const isHome = location.pathname === "/";
  const isLogin = location.pathname === "/login";
  const isSignup = location.pathname === "/signup";
  const isAuthPage = isLogin || isSignup;
  const isOtherPage = !isHome && !isAuthPage;

  /* STATES */
  const [isSticky, setIsSticky] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* Search States */
  const [fromCity, setFromCity] = useState(null);
  const [destination, setDestination] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  /* ---------- SCROLL LOGIC ---------- */
  useEffect(() => {
    if (isHome) {
      const handleScroll = () => {
        const heroHeight = window.innerHeight;
        setIsSticky(window.scrollY > 20);
        setShowSearch(window.scrollY > heroHeight - 100);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    if (isOtherPage) {
      setIsSticky(true);
      setShowSearch(true);
    }

    if (isAuthPage) {
      setIsSticky(false);
      setShowSearch(false);
    }
  }, [isHome, isOtherPage, isAuthPage]);

  /* ---------- LOGIN CHECK ---------- */
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [location]);

  const [profileImage, setProfileImage] = useState("");
  useEffect(() => {
    const loadImage = () => {
      const storedImage = localStorage.getItem("profileImage");

      if (storedImage) {
        setProfileImage(storedImage);
      } else {
        setProfileImage("/default-avatar.png");
      }
    };

    loadImage();

    window.addEventListener("profileUpdated", loadImage);

    return () => {
      window.removeEventListener("profileUpdated", loadImage);
    };
  }, []);

  /* ---------- SYNC SEARCH FROM URL (Hero ↔ Navbar) ---------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const fromParam = params.get("from");
    const toParam = params.get("to");

    /* ✅ If NO params → RESET (Home page case) */
    if (!fromParam && !toParam) {
      setFromCity(null);
      setDestination(null);
      setSearchFrom("");
      setSearchTo("");
      return;
    }

    /* ✅ Otherwise hydrate normally */
    if (fromParam) {
      const match = airportCities.find(
        (item) => item.code.toLowerCase() === fromParam.toLowerCase(),
      );
      setFromCity(match || null);
    } else {
      setFromCity(null);
    }

    if (toParam) {
      const match = airportCities.find(
        (item) => item.code.toLowerCase() === toParam.toLowerCase(),
      );
      setDestination(match || null);
    } else {
      setDestination(null);
    }
  }, [location.search]);
  /* ---------- OUTSIDE CLICK CLOSE ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- FILTER LOGIC ---------- */
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

  /* ---------- SMART MATCH ---------- */
  const smartMatch = (value, list) => {
    if (!value) return null;

    return airportCities.find(
      (item) =>
        item.city.toLowerCase() === value.toLowerCase() ||
        item.code.toLowerCase() === value.toLowerCase(),
    );
  };

  /* ---------- SEARCH SUBMIT ---------- */
  const handleSearch = () => {
    /* Destination is mandatory */
    if (!destination) {
      alert("Please select a destination.");
      return;
    }

    /* If user selected FROM */
    if (fromCity) {
      if (fromCity.code === destination.code) {
        alert("Departure and Destination cannot be the same airport.");
        return;
      }

      navigate(`/results?from=${fromCity.code}&to=${destination.code}`);
    } else {
      /* Destination-only flow */
      navigate(`/results?to=${destination.code}`);
    }

    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  /* ---------- ENTER KEY AUTO SELECT ---------- */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <header
      className={`w-full z-50 transition-all duration-300 ${
        isSticky ? "fixed top-0" : "absolute top-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 relative">
        <nav
          className={`h-16 flex items-center justify-between transition-all duration-300 ${
            isSticky
              ? "bg-white rounded-full px-6 shadow-md mt-3"
              : "bg-transparent px-0"
          }`}
        >
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo2.png"
              alt="Yaritrip Logo"
              className="h-36 object-contain"
            />
          </Link>

          {/* SEARCH (Desktop) */}
          {showSearch && (
            <div
              ref={wrapperRef}
              className="hidden md:flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full relative"
            >
              {/* FROM */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="From"
                  value={fromCity ? `${fromCity.city} (${fromCity.code})` : ""}
                  readOnly
                  onFocus={() => setOpenDropdown("from")}
                  className="bg-transparent outline-none text-sm w-28 cursor-pointer"
                />

                {openDropdown === "from" && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl w-64 max-h-60 overflow-y-auto z-50">
                    {filteredFrom.map((item) => (
                      <p
                        key={item.code}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setFromCity(item);
                          setOpenDropdown(null);
                          setSearchFrom("");
                        }}
                      >
                        {item.city} ({item.code}), {item.country}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-px h-5 bg-gray-300" />

              {/* TO */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="To Destination"
                  value={
                    destination
                      ? `${destination.city} (${destination.code})`
                      : ""
                  }
                  readOnly
                  onFocus={() => setOpenDropdown("to")}
                  className="bg-transparent outline-none text-sm w-32 cursor-pointer"
                />

                {openDropdown === "to" && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl w-64 max-h-60 overflow-y-auto z-50">
                    {filteredTo.map((item) => (
                      <p
                        key={item.code}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setDestination(item);
                          setOpenDropdown(null);
                          setSearchTo("");
                        }}
                      >
                        {item.city} ({item.code}), {item.country}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
          )}

          {/* RIGHT SECTION */}
          <div className="hidden md:flex items-center gap-6">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-1.5 rounded-full border transition ${
                    isSticky
                      ? "text-gray-100 bg-blue-600"
                      : "border-white text-white"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`px-4 py-1.5 rounded-full border transition ${
                    isSticky
                      ? "text-gray-100 bg-blue-600"
                      : "border-white text-white"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div
                onClick={() => navigate("/user-profile")}
                className="cursor-pointer hover:scale-105 transition"
              >
                <img
                  src={profileImage || "/default-avatar.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                />
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            className={`md:hidden text-2xl ${
              isSticky ? "text-gray-700" : "text-white"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* ================= MOBILE DROPDOWN ADDED ================= */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-2xl shadow-xl p-6 space-y-6 z-50">
            {/* Search (Mobile) */}
            {showSearch && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="From"
                  value={fromCity ? fromCity.city : searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="To"
                  value={destination ? destination.city : searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <button
                  onClick={handleSearch}
                  className="w-full bg-blue-600 text-white py-2 rounded"
                >
                  Search
                </button>
              </div>
            )}

            {/* Auth Links */}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 border rounded-full"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 bg-blue-600 text-white rounded-full"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/user-profile");
                }}
                className="block w-full text-center py-2 bg-blue-600 text-white rounded-full"
              >
                My Profile
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
