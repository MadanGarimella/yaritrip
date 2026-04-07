import Heritage from "../assets/Properties/heritage.png";
import oberoi from "../assets/Properties/oberoi.png";
import keralaResort from "../assets/Properties/kerala-resort.png";
import goaResort from "../assets/Properties/goa-resort.png";
import kolkataHotel from "../assets/Properties/kolkata.png";
import mumbaiHotel from "../assets/Properties/mumbai.png";
import udaipurHotel from "../assets/Properties/udaipur.png";

export const packagesData = [
  // ---------------- DUBAI ----------------
  {
    id: "dubai-global-village",
    country: "dubai",
    title: "Dubai : Global Village Entry",
    duration: "3N/4D",
    price: 24999,
    rating: 4.5,
    image: "/images/dubai/global.jpg",
  },
  {
    id: "dubai-burj-lake-ride",
    country: "dubai",
    title: "Dubai : Burj Khalifa Lake Ride",
    duration: "3N/4D",
    price: 28999,
    rating: 4.7,
    image: "/images/dubai/burj.jpg",
  },
  {
    id: "dubai-mega-yacht",
    country: "dubai",
    title: "Dubai : Mega Yacht Dinner Cruise",
    duration: "4N/5D",
    price: 32999,
    rating: 4.8,
    image: "/images/dubai/yacht.jpg",
  },

  // ---------------- INDIA ----------------
  {
    id: "india-taj-mahal-tour",
    country: "india",
    title: "Taj Mahal Guided Tour",
    duration: "2N/3D",
    price: 14999,
    rating: 4.6,
    image: "/images/india/taj.jpg",
  },
  {
    id: "india-jaipur-heritage",
    country: "india",
    title: "Jaipur Heritage Walk",
    duration: "3N/4D",
    price: 18999,
    rating: 4.5,
    image: "/images/india/jaipur.jpg",
  },

  // ---------------- SINGAPORE ----------------
  {
    id: "singapore-skypack-deck",
    country: "singapore",
    title: "SkyPark Observation Deck",
    duration: "3N/4D",
    price: 29999,
    rating: 4.7,
    image: "/images/singapore/sky.jpg",
  },

  // ---------------- BANGKOK ----------------
  {
    id: "bangkok-grand-palace",
    country: "bangkok",
    title: "Grand Palace & Temple Tour",
    duration: "3N/4D",
    price: 19999,
    rating: 4.4,
    image: "/images/bangkok/temple.jpg",
  },

  // ---------------- INDIA ----------------
  {
    id: "india-oberoi-agra",
    country: "india",
    region: "North India",
    title: "The Oberoi Amarvilas, Agra",
    duration: "2N/3D",
    price: 22500,
    rating: 9.2,
    reviews: "2,140 reviews",
    image: oberoi,
  },
  {
    id: "india-jaipur-heritage",
    country: "india",
    region: "North India",
    title: "Jaipur Heritage Palace",
    duration: "3N/4D",
    price: 18200,
    rating: 8.9,
    reviews: "1,820 reviews",
    image: Heritage,
  },
  {
    id: "india-kerala-backwater",
    country: "india",
    region: "South India",
    title: "Kerala Backwater Resort",
    duration: "2N/3D",
    price: 14800,
    rating: 9.0,
    reviews: "3,010 reviews",
    image: keralaResort,
  },
  {
    id: "india-goa-villa",
    country: "india",
    region: "South India",
    title: "Goa Beachfront Villa",
    duration: "3N/4D",
    price: 19900,
    rating: 8.7,
    reviews: "2,540 reviews",
    image: goaResort,
  },
  {
    id: "india-kolkata-luxury",
    country: "india",
    region: "East India",
    title: "Kolkata Luxury Stay",
    duration: "2N/3D",
    price: 12400,
    rating: 8.5,
    reviews: "1,120 reviews",
    image: kolkataHotel,
  },
  {
    id: "india-mumbai-suites",
    country: "india",
    region: "West India",
    title: "Mumbai Skyline Suites",
    duration: "2N/3D",
    price: 20100,
    rating: 8.8,
    reviews: "2,300 reviews",
    image: mumbaiHotel,
  },
  {
    id: "india-udaipur-palace",
    country: "india",
    region: "West India",
    title: "Udaipur Palace",
    duration: "2N/3D",
    price: 20100,
    rating: 8.8,
    reviews: "2,300 reviews",
    image: udaipurHotel,
  },
];