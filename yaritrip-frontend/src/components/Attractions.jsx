import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* -------- IMAGE IMPORTS -------- */
import dubaiGlobal from "../assets/Attractions/global-village.png";
import dubaiBurj from "../assets/Attractions/burj-khalifa.jpg";
import dubaiYacht from "../assets/Attractions/yacht-cruise.jpg";

import indiaTaj from "../assets/Attractions/indiaTaj.png";
import indiaJaipur from "../assets/Attractions/indiaJaipur.png";
import indiaKerala from "../assets/Attractions/indiaKerala.png";

import singaporeSky from "../assets/Attractions/singaporeSky.png";
import singaporeGarden from "../assets/Attractions/singaporeGarden.png";

import bangkokTemple from "../assets/Attractions/bangkokTemple.png";

import exploreDubai from "../assets/Attractions/explore.jpg";
import exploreIndia from "../assets/Attractions/indiaKerala.png";
import exploreSingapore from "../assets/Attractions/singaporeSky.png";
import exploreBangkok from "../assets/Attractions/bangkokTemple.png";

import attractionsBg from "../assets/Attractions/attractions-bg.jpeg";

/* -------- STATIC FALLBACK DATA -------- */
const fallbackData = {
  Dubai: {
    items: [
      {
        id: "dubai-global-village",
        title: "Dubai : Global Village Entry",
        image: dubaiGlobal,
        rating: "8.5",
        reviews: 2010,
      },
      {
        id: "dubai-burj-lake-ride",
        title: "Dubai : Burj Khalifa Lake Ride",
        image: dubaiBurj,
        rating: "8.5",
        reviews: 2010,
      },
      {
        id: "dubai-mega-yacht",
        title: "Dubai : Mega Yacht Dinner Cruise",
        image: dubaiYacht,
        rating: "8.5",
        reviews: 2010,
      },
    ],
  },
  India: {
    items: [
      {
        id: "india-taj-mahal-tour",
        title: "Taj Mahal Guided Tour",
        image: indiaTaj,
        rating: "9.1",
        reviews: 5410,
      },
      {
        id: "india-jaipur-heritage",
        title: "Jaipur Heritage Walk",
        image: indiaJaipur,
        rating: "8.7",
        reviews: 2230,
      },
      {
        id: "india-kerala-backwater",
        title: "Kerala Backwater Cruise",
        image: indiaKerala,
        rating: "8.9",
        reviews: 3010,
      },
    ],
  },
  Singapore: {
    items: [
      {
        id: "singapore-skypark",
        title: "SkyPark Observation Deck",
        image: singaporeSky,
        rating: "8.8",
        reviews: 1980,
      },
      {
        id: "singapore-gardens-bay",
        title: "Gardens by the Bay",
        image: singaporeGarden,
        rating: "9.0",
        reviews: 4120,
      },
    ],
  },
  Bangkok: {
    items: [
      {
        id: "bangkok-grand-palace",
        title: "Grand Palace & Temple Tour",
        image: bangkokTemple,
        rating: "8.6",
        reviews: 2640,
      },
    ],
  },
};

const exploreImages = {
  Dubai: exploreDubai,
  India: exploreIndia,
  Singapore: exploreSingapore,
  Bangkok: exploreBangkok,
};

const countries = ["Dubai", "India", "Singapore", "Bangkok"];
// const API_BASE = "http://localhost:8082";
const API_BASE = "http://localhost:8082";
const cityToCode = {
  Dubai: "DXB",
  India: "DEL",
  Singapore: "SIN",
  Bangkok: "BKK",
};

const Attractions = () => {
  const navigate = useNavigate();

  const [activeCountry, setActiveCountry] = useState("Dubai");
  const [items, setItems] = useState(fallbackData["Dubai"].items);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttractions = async () => {
      setLoading(true);

      try {
        console.log("Fetching attractions for:", activeCountry);

        const res = await fetch(
          `${API_BASE}/api/attractions/popular?city=${activeCountry}`,
        );

        // Better error logging
        if (!res.ok) {
          const text = await res.text();
          console.error("Backend error:", text);
          throw new Error(`API failed with status ${res.status}`);
        }

        const data = await res.json();
        console.log("API Response:", data);

        // Defensive mapping (fixes many crashes)
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item, index) => ({
            id: item.id || index,
            title: item.title || "Untitled Attraction",
            image:
              item.imageUrl || fallbackData[activeCountry]?.items?.[0]?.image,
            rating:
              item.rating !== undefined
                ? Number(item.rating).toFixed(1)
                : "8.0",
            reviews: item.reviews || 0,
          }));

          setItems(formatted);
        } else {
          console.warn("Empty API response → using fallback");
          setItems(fallbackData[activeCountry]?.items ?? []);
        }
      } catch (err) {
        console.error("Attractions API error:", err.message);

        // fallback always works
        setItems(fallbackData[activeCountry]?.items ?? []);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, [activeCountry]);

  const exploreImage = exploreImages[activeCountry];

  return (
    <section className="w-full px-4 py-10 md:py-16">
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${attractionsBg})` }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 p-5 md:p-10 text-white">
          <h2 className="text-xl md:text-2xl font-semibold mb-6">
            Popular Packages with Great Attractions.
          </h2>

          {/* Country Tabs */}
          <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-hide">
            {countries.map((country) => (
              <button
                key={country}
                onClick={() => setActiveCountry(country)}
                className={`px-5 py-2 whitespace-nowrap rounded-full text-sm font-medium transition ${
                  activeCountry === country
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {country}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="flex gap-5 md:gap-6 overflow-x-auto md:overflow-visible scrollbar-hide">
            {loading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="min-w-[230px] md:w-[260px] bg-white/20 rounded-2xl p-3 shadow-lg animate-pulse"
                  >
                    <div className="rounded-xl bg-white/30 h-[150px] md:h-[160px] w-full mb-3" />
                    <div className="h-4 bg-white/30 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-white/30 rounded w-1/2" />
                  </div>
                ))
              : items.map((item) => (
                  <div
                    key={item.id}
                    // onClick={() => navigate(`/attractions/${item.id}`)}
                    className="min-w-[230px] md:min-w-0 md:w-[260px] bg-white rounded-2xl p-3 shadow-lg cursor-pointer hover:shadow-xl transition"
                  >
                    <div className="rounded-xl overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-[150px] md:h-[160px] w-full object-cover"
                      />
                    </div>

                    <div className="pt-3">
                      <p className="text-sm font-medium text-black mb-2 leading-snug">
                        {item.title}
                      </p>

                      <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                          ⭐{item.rating}/5
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.reviews.toLocaleString()} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

            {/* Explore More */}
            <div className="min-w-[230px] md:w-[260px] relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={exploreImage}
                alt="Explore more"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50" />

              <div className="relative z-10 p-4 h-full flex flex-col justify-end text-white">
                <p className="text-sm mb-3">
                  Explore more packages of <br />
                  <span className="font-bold text-lg capitalize">
                    {activeCountry || "this destination"}
                  </span>
                </p>
                <button
                  onClick={() =>
                    navigate(
                      `/results?from=HYD&to=${cityToCode[activeCountry]}&rooms=1&guests=2`,
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg w-fit"
                >
                  Go Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Attractions;
