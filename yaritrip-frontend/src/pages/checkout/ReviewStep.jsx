import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCheckoutStore } from "../../store/checkout.store";

const ReviewStep = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { travellers, addons, getTotal, packageData, setPackage } =
    useCheckoutStore();

  const [pkg, setPkg] = useState(null);
  const [booking, setBooking] = useState(null);

  /* ---------- FETCH FROM BACKEND (FIXED) ---------- */
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Session expired. Please login again.");
          navigate("/login");
          return;
        }

        const res = await fetch(`http://localhost:8082/api/bookings/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ FIX
          },
        });

        if (!res.ok) throw new Error("Booking not found");

        const data = await res.json();

        setBooking(data.booking);

        if (data.travelPackage) {
          setPkg(data.travelPackage);
          setPackage(data.travelPackage);
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
      }
    };

    fetchBooking(); // ✅ ALWAYS FETCH
  }, [id, setPackage]);

  const finalPkg = pkg || packageData; // ✅ SAFE FALLBACK

  /* ---------- Guards ---------- */
  useEffect(() => {
    if (!finalPkg) return;
  }, [finalPkg]);

  useEffect(() => {
    if (travellers.length === 0) {
      navigate(`/checkout/${id}/travellers`);
    }
  }, [travellers, id, navigate]);

  if (!finalPkg) return null;

  const adults = travellers.filter((t) => t.type === "Adult");
  const children = travellers.filter((t) => t.type === "Child");

  const basePrice = booking?.totalAmount
    ? booking.totalAmount / Math.max(adults.length + children.length * 0.75, 1)
    : 0;

  const adultTotal = adults.length * basePrice;
  const childTotal = children.length * (basePrice * 0.75);

  const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);

  const totalAmount = booking?.totalAmount || 0;

  /* ---------- Dynamic Itinerary ---------- */
  const itineraryDays = Array.from({ length: finalPkg.nights }, (_, index) => ({
    title: `Day ${index + 1}`,
    description: `Enjoy exploring ${finalPkg.location} with guided experiences and leisure activities.`,
  }));

  return (
    <div className="relative">
      {/* ================= STEP PROGRESS ================= */}
      <div className="flex items-center justify-between mb-8">
        {["Travellers", "Review", "Payment"].map((step, index) => (
          <div key={step} className="flex-1 text-center">
            <div
              className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                index <= 1 ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <p className="text-xs mt-2">{step}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ================= LEFT CONTENT ================= */}
        <div className="flex-1">
          <div className="mb-6">
            <img
              src={finalPkg.image}
              alt={finalPkg.title}
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>

          <div className="border rounded-xl p-6 mb-6 bg-white shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">{finalPkg.title}</h2>
            <p className="text-gray-600 mb-2">
              {finalPkg.location} ({finalPkg.code})
            </p>
            <p className="text-sm text-gray-500 mb-2">
              {finalPkg.nights} Nights Stay
            </p>
            <p className="text-yellow-500 text-sm">
              ⭐ {finalPkg.rating} Rating
            </p>
          </div>

          <div className="border rounded-xl p-6 mb-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Itinerary</h3>

            {itineraryDays.map((day, index) => (
              <div key={index} className="mb-4">
                <p className="font-medium">{day.title}</p>
                <p className="text-sm text-gray-600">{day.description}</p>
              </div>
            ))}
          </div>

          <div className="border rounded-xl p-6 mb-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Traveller Summary</h3>

            {travellers.map((t, i) => (
              <div
                key={i}
                className="flex justify-between border-b py-2 text-sm"
              >
                <span>
                  {t.name} ({t.type})
                </span>
                <span>Age: {t.age}</span>
                <span>Gender: {t.gender}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate(`/checkout/${id}/travellers`)}
              className="px-6 py-2 border rounded-full"
            >
              Back
            </button>

            <button
              onClick={() => navigate(`/checkout/${id}/payment`)}
              className="px-6 py-2 bg-black text-white rounded-full"
            >
              Proceed to Payment
            </button>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="hidden lg:block lg:w-96">
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <h3 className="text-xl font-semibold mb-6">Price Summary</h3>

            <div className="flex justify-between mb-3">
              <span>Adults ({adults.length})</span>
              <span>₹{adultTotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>
                Children ({children.length})
                <span className="text-xs text-green-600 ml-1">(25% Off)</span>
              </span>
              <span>₹{childTotal.toLocaleString()}</span>
            </div>

            {addons.length > 0 && (
              <>
                <div className="border-t my-4"></div>
                <p className="text-sm font-medium mb-3">Selected Activities</p>

                {addons.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex justify-between text-sm mb-2"
                  >
                    <span>
                      Day {addon.day + 1} - {addon.name}
                    </span>
                    <span>₹{addon.price.toLocaleString()}</span>
                  </div>
                ))}

                <div className="flex justify-between font-medium mt-3">
                  <span>Add-ons Total</span>
                  <span>₹{addonsTotal.toLocaleString()}</span>
                </div>
              </>
            )}

            <div className="border-t my-4"></div>

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-blue-600">
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden mt-8">
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Price Summary</h3>

            <div className="flex justify-between mb-2">
              <span>Adults ({adults.length})</span>
              <span>₹{adultTotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Children ({children.length})</span>
              <span>₹{childTotal.toLocaleString()}</span>
            </div>

            {addons.length > 0 && (
              <>
                <div className="border-t my-3"></div>
                {addons.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex justify-between text-sm mb-1"
                  >
                    <span>
                      Day {addon.day + 1} - {addon.name}
                    </span>
                    <span>₹{addon.price.toLocaleString()}</span>
                  </div>
                ))}

                <div className="flex justify-between font-medium mt-2">
                  <span>Add-ons Total</span>
                  <span>₹{addonsTotal.toLocaleString()}</span>
                </div>
              </>
            )}

            <div className="border-t my-3"></div>

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-blue-600">
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
