import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useCheckoutStore } from "../store/checkout.store";
import ImageWithPlaceholder from "../components/ImageWithPlaceholder";

const AttractionsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ================= PACKAGE RESOLUTION ================= */

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPackage = async () => {
      try {
        const response = await fetch(
          `http://localhost:8082/api/attractions/${id}/package`,
        );

        if (!response.ok) {
          console.error("API Error:", response.status);

          setPkg(null);
          setLoading(false);
          return;
        }

        const data = await response.json();

        setPkg({
          ...data,
          location: data.location,
          images:
            data.images && data.images.length > 0
              ? data.images
              : data.image
                ? [data.image]
                : [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  /* ================= NORMALIZATION LAYER ================= */
  const normalizedPkg = useMemo(() => {
    if (!pkg) return null;

    return {
      ...pkg,
      nights: pkg.nights || 3,
      location: pkg.location || pkg.toCity,
      images:
        pkg.images && pkg.images.length > 0
          ? pkg.images
          : pkg.image
            ? [pkg.image]
            : [],
    };
  }, [pkg]);

  /* ================= STATE ================= */

  const [activeTab, setActiveTab] = useState("Overview");
  const [direction, setDirection] = useState("right");
  const [selectedActivities, setSelectedActivities] = useState([]);

  const { toggleAddon, clearAddons, setPackage } = useCheckoutStore();

  useEffect(() => {
    clearAddons();
    setSelectedActivities([]);
    setPackage(pkg);
    if (!pkg) return;
  }, [pkg, clearAddons, setPackage]);

const handleProceedToBooking = async () => {
    try {
      const res = await fetch("http://localhost:8082/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: normalizedPkg.travelPackageId,
          totalAmount: normalizedPkg.price,
          travellers: [],
        }),
      });

      if (!res.ok) {
        throw new Error("Booking creation failed");
      }

      const booking = await res.json();

      console.log("BOOKING CREATED:", booking);

      navigate(`/checkout/${booking.id}/travellers`);
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading package...
      </div>
    );
  }

  /* ================= SAFE FALLBACK ================= */

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-full"
        >
          Go Back
        </button>
      </div>
    );
  }

  const tabs = [
    "Overview",
    "Itinerary",
    "Transfers",
    "Rooms & Hotels",
    "Activities",
  ];

  const handleTabChange = (tab) => {
    const currentIndex = tabs.indexOf(activeTab);
    const newIndex = tabs.indexOf(tab);
    setDirection(newIndex > currentIndex ? "right" : "left");
    setActiveTab(tab);
  };

  /* ================= ACTIVITIES ================= */

  const activitiesList = [
    { id: 1, name: "Desert Safari Experience", price: 3500 },
    { id: 2, name: "Luxury Yacht Cruise", price: 5200 },
    { id: 3, name: "Helicopter City Tour", price: 8900 },
    { id: 4, name: "Adventure Water Sports", price: 4200 },
  ];

  const handleActivityToggle = (activity, day) => {
    const exists = selectedActivities.find(
      (item) => item.id === activity.id && item.day === day,
    );

    const activityForStore = {
      ...activity,
      id: `${activity.id}-${day}`,
      day,
    };

    if (exists) {
      setSelectedActivities((prev) =>
        prev.filter((item) => !(item.id === activity.id && item.day === day)),
      );
      toggleAddon(activityForStore);
    } else {
      setSelectedActivities((prev) => [...prev, { ...activity, day }]);
      toggleAddon(activityForStore);
    }
  };

  const activitiesTotal = selectedActivities.reduce(
    (sum, item) => sum + item.price,
    0,
  );

  const totalPrice = normalizedPkg.price + activitiesTotal;

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 pb-16 mt-20">
      {/* HEADER */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold">{normalizedPkg.title}</h1>
          <p className="text-gray-600 text-sm mt-1">
            {normalizedPkg.location} • {normalizedPkg.nights} Nights
          </p>
        </div>
      </div>

      {/* GALLERY */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {normalizedPkg.images.map((img, index) => {
            const validImage =
              img && typeof img === "string"
                ? img.startsWith("http")
                  ? img
                  : `http://localhost:8082${img}`
                : "";

            return (
              <ImageWithPlaceholder
                key={index}
                src={validImage}
                alt="package image"
                className={`w-full object-cover rounded-xl ${
                  index === 0 ? "col-span-2 row-span-2 h-64 md:h-80" : "h-40"
                }`}
              />
            );
          })}
        </div>

        {/* TABS */}
        <div className="sticky top-16 bg-gray-100 pt-6 z-10">
          <div className="flex gap-6 border-b border-gray-300 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`relative pb-3 text-sm font-medium transition ${
                  activeTab === tab
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-600"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 mt-10 grid md:grid-cols-3 gap-8">
        {/* LEFT CONTENT */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow p-6">
            {activeTab === "Overview" && (
              <>
                <h2 className="text-lg font-semibold mb-4">Package Overview</h2>
                <p className="text-gray-600">
                  Enjoy a premium {normalizedPkg.nights}-night getaway in{" "}
                  <strong>{normalizedPkg.location}</strong>.
                </p>
              </>
            )}

            {activeTab === "Itinerary" &&
              Array.from({ length: normalizedPkg.nights }, (_, i) => (
                <div key={i} className="border rounded-xl mb-4 p-4">
                  <h3 className="font-semibold">Day {i + 1}</h3>
                  <p className="text-sm text-gray-600">
                    Arrival, sightseeing and curated experiences.
                  </p>
                </div>
              ))}

            {activeTab === "Transfers" && (
              <p className="text-gray-600">
                Airport pickup and private transfers included.
              </p>
            )}

            {activeTab === "Rooms & Hotels" && (
              <p className="text-gray-600">
                4-star luxury stay with breakfast included.
              </p>
            )}

            {activeTab === "Activities" && (
              <div className="grid md:grid-cols-2 gap-6">
                {activitiesList.map((activity) => (
                  <div key={activity.id} className="border rounded-xl p-4">
                    <h4 className="font-semibold">{activity.name}</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      ₹{activity.price.toLocaleString()}
                    </p>

                    {Array.from({ length: normalizedPkg.nights }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handleActivityToggle(activity, i)}
                        className="mr-2 mt-2 px-3 py-1 text-xs bg-blue-100 rounded"
                      >
                        Day {i + 1}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PRICE CARD */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit sticky top-28">
          <h3 className="text-lg font-semibold">Starting From</h3>

          <div className="mt-3 text-3xl font-bold">
            ₹{totalPrice.toLocaleString()}
            <span className="text-sm text-gray-500"> /person</span>
          </div>

          {selectedActivities.length > 0 && (
            <div className="mt-6 border-t pt-4 space-y-4">
              <p className="text-sm font-semibold text-gray-700">
                Selected Activities
              </p>

              {selectedActivities.map((activity) => (
                <div
                  key={`${activity.id}-${activity.day}`}
                  className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {activity.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Day {activity.day + 1}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-green-600">
                      ₹{activity.price.toLocaleString()}
                    </span>

                    <button
                      onClick={() => {
                        const activityForStore = {
                          ...activity,
                          id: `${activity.id}-${activity.day}`,
                          day: activity.day,
                        };

                        setSelectedActivities((prev) =>
                          prev.filter(
                            (item) =>
                              !(
                                item.id === activity.id &&
                                item.day === activity.day
                              ),
                          ),
                        );

                        toggleAddon(activityForStore);
                      }}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between text-sm font-semibold text-green-700 border-t pt-3">
                <span>Total Add-ons</span>
                <span>₹{activitiesTotal.toLocaleString()}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleProceedToBooking}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
          >
            Proceed to Booking
          </button>

          <p className="mt-6 text-xs text-red-500">
            <b>*Prices may vary depending on availability.</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttractionsDetails;