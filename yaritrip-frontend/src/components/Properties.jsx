import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { packagesData } from "../data/packages.data.js";

const Properties = () => {
  const navigate = useNavigate();

  const [packagesData, setPackagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  /* ================= FILTER INDIA PACKAGES ================= */
  const indiaPackages = packagesData;

  /* ================= SAFE INITIAL REGION ================= */
  const [activeRegion, setActiveRegion] = useState("NORTH");
  const regions = ["NORTH", "SOUTH", "EAST", "WEST"];

useEffect(() => {
  const fetchStays = async () => {
    try {
      const res = await fetch(
        `http://localhost:8082/api/stays/premium?region=${activeRegion.toUpperCase()}`
      );

      const data = await res.json();
      setPackagesData(data);
    } catch (error) {
      console.error("Error fetching stays:", error);
    }
  };

  if (activeRegion) fetchStays();
}, [activeRegion]);  

/* ================= FILTER BY REGION ================= */
const listings = packagesData;

  /* ================= HANDLE NAVIGATION ================= */
  const handleNavigate = (property) => {
    navigate(`/packages/${property.country.toLowerCase()}/${property.id}`);
  };

  return (
    <section className="w-full px-4 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-8">
          Handpicked Premium Stays in India
        </h2>

        {/* Region Tabs */}
        <div className="flex gap-4 mb-10 flex-wrap">
          {regions.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setActiveRegion(region)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${
                  activeRegion === region
                    ? "bg-blue-800 text-white scale-105"
                    : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Property Cards */}
        <div className="grid md:grid-cols-4 gap-6 animate-region">
          {listings.map((property, index) => (
            <div
              key={property.id}
              role="button"
              tabIndex={0}
              onClick={() => handleNavigate(property)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNavigate(property);
              }}
              className="bg-white cursor-pointer rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 animate-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="h-[180px] overflow-hidden">
                <img
                  src={property.imageUrl}
                  alt={property.name}
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm font-medium mb-3">
                  {property.name}
                </p>

                <div className="flex items-center gap-2 text-xs mb-2">
                  <span className="bg-blue-400 text-white px-2 py-0.5 rounded-md font-semibold">
                    ⭐{property.rating}/10
                  </span>

                  <span className="text-orange-500 font-semibold">
                    {property.duration}
                  </span>

                  {property.reviews && (
                    <span className="text-gray-500">
                      {property.reviews}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-gray-500 text-sm">
                    Starting from{" "}
                  </span>
                  <span className="font-bold text-lg">
                    ₹{property.startingPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeSlideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-region {
            animation: fadeSlideUp 0.4s ease-out;
          }

          .animate-card {
            opacity: 0;
            animation: fadeSlideUp 0.6s ease-out forwards;
          }
        `}
      </style>
    </section>
  );
};

export default Properties;