import { useState } from "react";
import visaBg from "../assets/visa/visafree-bg.jpeg";

/* ---------------- COUNTRY CODE MAP ---------------- */

const countryCodes = {
  Bhutan: "bt",
  Nepal: "np",
  Thailand: "th",
  Malaysia: "my",
  Maldives: "mv",
  Kazakhstan: "kz",
  Macao: "mo",
  "Sri Lanka": "lk",
  Indonesia: "id",
  Qatar: "qa",
  Iran: "ir",

  Mauritius: "mu",
  Seychelles: "sc",
  Kenya: "ke",
  Senegal: "sn",
  Rwanda: "rw",
  Angola: "ao",
  Tunisia: "tn",
  Madagascar: "mg",

  Serbia: "rs",
  Belarus: "by",

  Barbados: "bb",
  Dominica: "dm",
  Grenada: "gd",
  Haiti: "ht",
  Jamaica: "jm",
  Montserrat: "ms",
  "St. Kitts and Nevis": "kn",
  "St. Vincent & Grenadines": "vc",
  "British Virgin Islands": "vg",

  Bolivia: "bo",
  "El Salvador": "sv",
  Ecuador: "ec",

  Fiji: "fj",
  "Cook Islands": "ck",
  Micronesia: "fm",
  Vanuatu: "vu",
  Kiribati: "ki",
  Niue: "nu",
  Samoa: "ws",
  Tuvalu: "tv",
};

/* ---------------- DATA ---------------- */

const visaData = {
  Asia: [
    { name: "Bhutan", type: "Visa-Free" },
    { name: "Nepal", type: "Visa-Free" },
    { name: "Thailand", type: "Visa-Free" },
    { name: "Malaysia", type: "Visa-Free" },
    { name: "Maldives", type: "VoA" },
    { name: "Kazakhstan", type: "Visa-Free" },
    { name: "Macao", type: "Visa-Free" },
    { name: "Sri Lanka", type: "VoA" },
    { name: "Indonesia", type: "VoA" },
    { name: "Qatar", type: "Visa-Free" },
    { name: "Iran", type: "VoA" },
  ],
  Africa: [
    // { name: "Mauritius", type: "Visa-Free" },
    // { name: "Seychelles", type: "Visa-Free" },
    { name: "Kenya", type: "ETA" },
    { name: "Senegal", type: "Visa-Free" },
    { name: "Rwanda", type: "Visa-Free" },
    // { name: "Angola", type: "Visa-Free" },
    // { name: "Tunisia", type: "Visa-Free" },
    { name: "Madagascar", type: "VoA" },
  ],
  Europe: [
    { name: "Serbia", type: "Visa-Free" },
    { name: "Belarus", type: "Restricted" },
    { name: "Kazakhstan", type: "Visa-Free" },
  ],
  "North America / Caribbean": [
    { name: "Barbados", type: "Visa-Free" },
    { name: "Dominica", type: "Visa-Free" },
    // { name: "Grenada", type: "Visa-Free" },
    // { name: "Haiti", type: "Visa-Free" },
    { name: "Jamaica", type: "Visa-Free" },
    { name: "Montserrat", type: "Visa-Free" },
    // { name: "St. Kitts and Nevis", type: "Visa-Free" },
    // { name: "St. Vincent & Grenadines", type: "Visa-Free" },
    { name: "British Virgin Islands", type: "Visa-Free" },
  ],
  "South America": [
    { name: "Bolivia", type: "VoA" },
    { name: "El Salvador", type: "Visa-Free" },
    { name: "Ecuador", type: "Visa-Free" },
  ],
  Oceania: [
    { name: "Fiji", type: "Visa-Free" },
    { name: "Cook Islands", type: "Visa-Free" },
    { name: "Micronesia", type: "Visa-Free" },
    { name: "Vanuatu", type: "Visa-Free" },
    { name: "Kiribati", type: "Visa-Free" },
    // { name: "Niue", type: "Visa-Free" },
    { name: "Samoa", type: "VoA" },
    // { name: "Tuvalu", type: "VoA" },
  ],
};

const continents = Object.keys(visaData);

const VisaFree = () => {
  const [activeContinent, setActiveContinent] = useState("Asia");

  const countries = visaData[activeContinent];

  const getBadgeColor = (type) => {
    if (type === "Visa-Free") return "bg-green-500";
    if (type === "VoA") return "bg-blue-500";
    if (type === "ETA") return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <section className="w-full px-4 py-16">
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${visaBg})` }}
        />
        {/* <div className="absolute inset-0 bg-black/30" /> */}

        <div className="relative z-10 p-10 text-white">
          <h2 className="text-3xl font-semibold mb-8">
            Visa-Free Destinations for Indians 20<span className="text-red-600 font-bold text-4xl">26</span>
          </h2>

          {/* Tabs */}
          <div className="flex gap-4 flex-wrap mb-10">
            {continents.map((continent) => (
              <button
                key={continent}
                onClick={() => setActiveContinent(continent)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition
                  ${
                    activeContinent === continent
                      ? "bg-black text-white"
                      : "bg-blue-700 text-white hover:bg-gray"
                  }`}
              >
                {continent}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div
            key={activeContinent}
            className="grid md:grid-cols-4 gap-6 animate-slide-in"
          >
            {countries.map((country, index) => (
              <div
                key={index}
                className="relative h-[140px] rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition duration-400"
                style={{
                  backgroundImage: `url(https://flagcdn.com/w640/${countryCodes[country.name]}.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
                  <h4 className="text-lg font-semibold">{country.name}</h4>

                  <span
                    className={`mt-2 w-fit text-xs px-3 py-1 rounded-full font-medium ${getBadgeColor(
                      country.type,
                    )}`}
                  >
                    {country.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slide-in {
            animation: slideIn 0.5s ease-out;
          }
        `}
      </style>
    </section>
  );
};

export default VisaFree;
