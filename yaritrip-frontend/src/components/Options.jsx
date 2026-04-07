import { useState } from "react";
import { Icon } from "@iconify/react";

const options = [
  { label: "Holiday Packages", icon: "mdi:bag-suitcase", active: true },
  { label: "Flights", icon: "mdi:airplane" },
  { label: "Hotels", icon: "mdi:hotel" },
  { label: "Homestays", icon: "mdi:home-city" },
  { label: "Trains", icon: "mdi:train" },
  { label: "Cabs", icon: "mdi:taxi" },
  { label: "Buses", icon: "mdi:bus" },
  { label: "Tours & Attractions", icon: "mdi:ferris-wheel" },
  { label: "Cruise", icon: "mdi:ferry" },
  { label: "Forex card & Currency", icon: "mdi:currency-usd" },
  { label: "Travel Insurance", icon: "mdi:shield-check" },
];

const VISIBLE_COUNT = 6;
const CARD_WIDTH = 150;
const GAP = 16;

const Options = () => {
  const [start, setStart] = useState(0);

  /* ✅ Track clicked item */
  const [clicked, setClicked] = useState(null);

  const canSlideLeft = start > 0;
  const canSlideRight = start + VISIBLE_COUNT < options.length;

  const handleClick = (item) => {
    if (item.active) return;
    setClicked(item.label);

    /* auto hide after 2s */
    setTimeout(() => setClicked(null), 2000);
  };

  return (
    <section className="w-full bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="border rounded-3xl p-6 relative overflow-hidden">

          {/* LEFT ARROW */}
          {canSlideLeft && (
            <button
              onClick={() => setStart((s) => Math.max(0, s - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/70 backdrop-blur-md border shadow-lg flex items-center justify-center hover:scale-110 transition"
            >
              <Icon icon="mdi:chevron-left" className="text-2xl text-gray-800" />
            </button>
          )}

          {/* RIGHT ARROW */}
          {canSlideRight && (
            <button
              onClick={() => setStart((s) => s + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/70 backdrop-blur-md border shadow-lg flex items-center justify-center hover:scale-110 transition"
            >
              <Icon icon="mdi:chevron-right" className="text-2xl text-gray-800" />
            </button>
          )}

          {/* VIEWPORT */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${start * (CARD_WIDTH + GAP)}px)`,
              }}
            >
              {options.map((item) => {
                const isActive = item.active;
                const showComingSoon = clicked === item.label;

                return (
                  <div
                    key={item.label}
                    onClick={() => handleClick(item)}
                    className={`
                      flex-shrink-0 w-[130px] h-[110px]
                      cursor-pointer
                      transition-all duration-300
                      flex flex-col items-center justify-center gap-2 px-3 py-3
                      ${isActive 
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:shadow-md"}
                    `}
                  >
                    {/* ICON */}
                    <Icon
                      icon={item.icon}
                      className={`text-3xl ${
                        isActive ? "text-blue-600" : "text-gray-700"
                      }`}
                    />

                    {/* LABEL */}
                    <span
                      className={`text-sm font-medium text-center leading-tight
                        ${isActive ? "text-blue-600" : "text-gray-800"}
                      `}
                    >
                      {item.label}
                    </span>

                    {/* ✅ COMING SOON MESSAGE */}
                    <div className="h-[18px] flex items-center justify-center">
                      {showComingSoon && !isActive && (
                        <span className="text-[11px] text-red-500 font-medium animate-fadeIn">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease forwards;
          }
        `}
      </style>
    </section>
  );
};

export default Options;