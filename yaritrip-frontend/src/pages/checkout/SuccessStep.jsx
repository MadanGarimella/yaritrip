import { useNavigate } from "react-router-dom";
import { useCheckoutStore } from "../../store/checkout.store";
import { jsPDF } from "jspdf";

const SuccessStep = () => {
  const navigate = useNavigate();

  const {
    packageData,
    travellers,
    transactionId,
    bookingId,
    getPriceBreakdown,
    resetCheckout,
  } = useCheckoutStore();

  if (!packageData || !transactionId) {
    navigate("/");
    return null;
  }

  const { adultCount, childCount, adultTotal, childTotal, addonsTotal, total } =
    getPriceBreakdown();
  const { addons } = useCheckoutStore();

  /* ================= DOWNLOAD INVOICE ================= */
  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Travel Booking Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Booking ID: ${bookingId}`, 20, 35);
    doc.text(`Transaction ID: ${transactionId}`, 20, 42);

    doc.text(`Package: ${packageData.title}`, 20, 55);
    doc.text(`Location: ${packageData.location}`, 20, 62);
    doc.text(`Nights: ${packageData.nights}`, 20, 69);

    doc.text("Travellers:", 20, 85);

    travellers.forEach((t, index) => {
      doc.text(
        `${index + 1}. ${t.name} (${t.type}) - Age ${t.age}`,
        25,
        95 + index * 7,
      );
    });

    let yOffset = 95 + travellers.length * 7 + 10;

    doc.text("Price Breakdown:", 20, yOffset);
    doc.text(`Adults (${adultCount}): ₹${adultTotal}`, 25, yOffset + 10);
    doc.text(`Children (${childCount}): ₹${childTotal}`, 25, yOffset + 17);
    doc.text(`Total Paid: ₹${total}`, 25, yOffset + 27);

    doc.save(`Invoice_${bookingId}.pdf`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
        {/* SUCCESS HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-green-600">
            Booking Confirmed 🎉
          </h2>
          <p className="text-gray-500 mt-2">
            Your trip has been successfully booked.
          </p>
        </div>

        {/* BOOKING DETAILS */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-500">Booking ID</p>
            <p className="font-semibold text-lg">{bookingId}</p>
          </div>

          <div className="border rounded-xl p-5">
            <p className="text-sm text-gray-500">Transaction ID</p>
            <p className="font-semibold text-lg">{transactionId}</p>
          </div>
        </div>

        {/* PACKAGE SUMMARY */}
        <div className="border rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Package Details</h3>

          <p className="mb-2">
            <strong>{packageData.title}</strong>
          </p>
          <p className="text-sm text-gray-600">
            {packageData.location} • {packageData.nights} Nights
          </p>
        </div>

        {/* TRAVELLER SUMMARY */}
        <div className="border rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Traveller Summary</h3>

          {travellers.map((t, i) => (
            <div key={i} className="flex justify-between border-b py-2 text-sm">
              <span>
                {t.name} ({t.type})
              </span>
              <span>Age: {t.age}</span>
            </div>
          ))}
        </div>

        {/* PRICE SUMMARY */}
        <div className="border rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Payment Summary</h3>

          <div className="flex justify-between mb-2">
            <span>Adults ({adultCount})</span>
            <span>₹{adultTotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Children ({childCount})</span>
            <span>₹{childTotal.toLocaleString()}</span>
          </div>

          <div className="border-t my-4"></div>
          {addons.length > 0 && (
            <>
              <div className="border-t my-4"></div>
              <p className="font-medium mb-2">Extra Activities</p>

              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="flex justify-between text-sm mb-1"
                >
                  <span>{addon.name}</span>
                  <span>₹{addon.price.toLocaleString()}</span>
                </div>
              ))}

              <div className="flex justify-between mt-2">
                <span>Add-ons Total</span>
                <span>₹{addonsTotal.toLocaleString()}</span>
              </div>
            </>
          )}

          <div className="flex justify-between font-bold text-lg">
            <span>Total Paid</span>
            <span className="text-blue-600">₹{total.toLocaleString()}</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handleDownloadInvoice}
            className="flex-1 bg-black text-white py-3 rounded-xl"
          >
            Download Invoice (PDF)
          </button>

          <button
            onClick={() => {
              resetCheckout();
              navigate("/");
            }}
            className="flex-1 border py-3 rounded-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessStep;
