import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { packagesData } from "./Results/mockData";

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const pkg = useMemo(() => {
    return packagesData.find((item) => item.id === Number(id));
  }, [id]);

  const [step, setStep] = useState(1);
  const [travellers, setTravellers] = useState([
    { type: "Adult", name: "", age: "" }
  ]);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const addonsList = [
    { id: 1, name: "Travel Insurance", price: 1200 },
    { id: 2, name: "Priority Support", price: 800 },
    { id: 3, name: "Airport Lounge Access", price: 1500 },
  ];

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => navigate("/results")}
          className="px-6 py-2 bg-blue-600 text-white rounded-full"
        >
          Back to Results
        </button>
      </div>
    );
  }

  const addonsTotal = selectedAddons.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const grandTotal = pkg.price + addonsTotal;

  /* ------------------ STEP CONTENT ------------------ */

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-semibold mb-6">
              Traveller Details
            </h2>

            {travellers.map((traveller, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={traveller.name}
                    onChange={(e) => {
                      const updated = [...travellers];
                      updated[index].name = e.target.value;
                      setTravellers(updated);
                    }}
                    className="border p-3 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={traveller.age}
                    onChange={(e) => {
                      const updated = [...travellers];
                      updated[index].age = e.target.value;
                      setTravellers(updated);
                    }}
                    className="border p-3 rounded"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() =>
                setTravellers([
                  ...travellers,
                  { type: "Adult", name: "", age: "" },
                ])
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-full"
            >
              + Add Traveller
            </button>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-xl font-semibold mb-6">
              Package Add-ons
            </h2>

            {addonsList.map((addon) => {
              const selected = selectedAddons.find(
                (item) => item.id === addon.id
              );

              return (
                <div
                  key={addon.id}
                  className="flex justify-between items-center border p-4 rounded-lg mb-3"
                >
                  <div>
                    <p className="font-medium">{addon.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{addon.price}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (selected) {
                        setSelectedAddons(
                          selectedAddons.filter(
                            (item) => item.id !== addon.id
                          )
                        );
                      } else {
                        setSelectedAddons([
                          ...selectedAddons,
                          addon,
                        ]);
                      }
                    }}
                    className={`px-4 py-1 rounded-full text-sm ${
                      selected
                        ? "bg-red-500 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {selected ? "Remove" : "Add"}
                  </button>
                </div>
              );
            })}
          </>
        );

      case 3:
        return (
          <>
            <h2 className="text-xl font-semibold mb-6">
              Review Booking
            </h2>

            <p className="mb-3 font-medium">
              Travellers: {travellers.length}
            </p>

            {selectedAddons.length > 0 && (
              <>
                <p className="font-medium mb-2">Add-ons:</p>
                {selectedAddons.map((addon) => (
                  <p key={addon.id}>
                    • {addon.name} – ₹{addon.price}
                  </p>
                ))}
              </>
            )}

            <div className="mt-6 text-lg font-bold">
              Total: ₹{grandTotal.toLocaleString()}
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h2 className="text-xl font-semibold mb-6">
              Payment
            </h2>
            <p>Payment Gateway Integration Here</p>
          </>
        );

      case 5:
        return (
          <>
            <h2 className="text-xl font-semibold mb-6 text-green-600">
              Booking Confirmed 🎉
            </h2>
            <p>Your trip to {pkg.location} is confirmed.</p>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/* Step Indicator */}
        <div className="flex justify-between mb-10">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                s <= step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border rounded-full"
            >
              Back
            </button>
          )}

          {step < 5 && (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-full"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
