import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { pkg, selectedActivities = [], basePrice = 0, activitiesTotal = 0, totalPrice = 0 } =
    location.state || {};

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-full"
        >
          Back to Home
        </button>
      </div>
    );
  }

  /* ---------------- STEP STATE ---------------- */
  const [step, setStep] = useState(1);

  /* ---------------- FORM STATE ---------------- */
  const [traveler, setTraveler] = useState({
    fullName: "",
    age: "",
    passport: "",
  });

  const [contact, setContact] = useState({
    email: "",
    phone: "",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        {/* LEFT CONTENT */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-8">

          {/* Step Indicator */}
          <div className="flex justify-between mb-8">
            {["Traveler", "Contact", "Review", "Payment"].map((label, index) => (
              <div
                key={index}
                className={`flex-1 text-center text-sm font-medium ${
                  step === index + 1 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* STEP 1 - TRAVELER */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold mb-6">Traveler Details</h2>

              <input
                type="text"
                placeholder="Full Name"
                value={traveler.fullName}
                onChange={(e) =>
                  setTraveler({ ...traveler, fullName: e.target.value })
                }
                className="w-full border p-3 rounded-lg mb-4"
              />

              <input
                type="number"
                placeholder="Age"
                value={traveler.age}
                onChange={(e) =>
                  setTraveler({ ...traveler, age: e.target.value })
                }
                className="w-full border p-3 rounded-lg mb-4"
              />

              <input
                type="text"
                placeholder="Passport Number"
                value={traveler.passport}
                onChange={(e) =>
                  setTraveler({ ...traveler, passport: e.target.value })
                }
                className="w-full border p-3 rounded-lg"
              />
            </>
          )}

          {/* STEP 2 - CONTACT */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>

              <input
                type="email"
                placeholder="Email Address"
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
                className="w-full border p-3 rounded-lg mb-4"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={contact.phone}
                onChange={(e) =>
                  setContact({ ...contact, phone: e.target.value })
                }
                className="w-full border p-3 rounded-lg"
              />
            </>
          )}

          {/* STEP 3 - REVIEW */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold mb-6">Review Booking</h2>

              <div className="space-y-3 text-sm">
                <p><strong>Package:</strong> {pkg.title}</p>
                <p><strong>Destination:</strong> {pkg.location}</p>
                <p><strong>Nights:</strong> {pkg.nights}</p>

                <div>
                  <strong>Traveler:</strong>
                  <p>{traveler.fullName} (Age: {traveler.age})</p>
                </div>

                <div>
                  <strong>Contact:</strong>
                  <p>{contact.email} | {contact.phone}</p>
                </div>
              </div>
            </>
          )}

          {/* STEP 4 - PAYMENT */}
          {step === 4 && (
            <>
              <h2 className="text-xl font-semibold mb-6">Payment</h2>

              <p className="text-gray-600 mb-4">
                Integrate your payment gateway here (Razorpay / PhonePe / Stripe).
              </p>

              <button className="w-full bg-green-600 text-white py-3 rounded-xl">
                Pay ₹{totalPrice.toLocaleString()}
              </button>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-2 border rounded-lg"
              >
                Back
              </button>
            )}

            {step < 4 && (
              <button
                onClick={nextStep}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                Continue
              </button>
            )}
          </div>
        </div>

        {/* RIGHT PRICE SUMMARY */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit sticky top-28">
          <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>

          <p className="text-sm mb-2">
            <strong>Base Price:</strong> ₹{basePrice.toLocaleString()}
          </p>

          {selectedActivities.length > 0 && (
            <div className="mb-3">
              <p className="font-medium text-sm mb-2">Add-on Activities:</p>
              {selectedActivities.map((act, index) => (
                <p key={index} className="text-xs text-gray-600">
                  • Day {act.day + 1} – {act.name} (₹{act.price.toLocaleString()})
                </p>
              ))}
              <p className="text-sm text-green-600 mt-2">
                + ₹{activitiesTotal.toLocaleString()}
              </p>
            </div>
          )}

          <div className="border-t pt-4 mt-4 text-lg font-bold">
            Total: ₹{totalPrice.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;