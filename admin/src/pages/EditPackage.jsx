import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const EditPackage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [form, setForm] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  // ✅ FIX 1: Declare BEFORE useEffect
  const normalizeItinerary = (itinerary = []) =>
    itinerary.map((day) => ({
      title: day.title || "",
      description: day.description || day.desc || "",
      activities: day.activities || [],
    }));
  const normalizePackage = (pkg) => ({
    ...pkg,

    name: typeof pkg.name === "object" ? pkg.name?.value || "" : pkg.name,
    location:
      typeof pkg.location === "object"
        ? pkg.location?.value || ""
        : pkg.location,

    price: typeof pkg.price === "object" ? pkg.price?.amount || 0 : pkg.price,
    images: Array.isArray(pkg.images) ? pkg.images : [],

    bookings:
      typeof pkg.bookings === "object"
        ? pkg.bookings?.count || 0
        : pkg.bookings,

    description:
      typeof pkg.description === "object"
        ? pkg.description?.text || ""
        : pkg.description,

    hotels: (pkg.hotels || []).map((h) =>
      typeof h === "object" ? h : { name: h },
    ),

    activities: (pkg.activities || []).map((a) =>
      typeof a === "object" ? a : { name: a },
    ),

    itinerary: (pkg.itinerary || []).map((day) => ({
      title: day.title || "",
      description: day.description || day.desc || "",
      activities: day.activities || [],
    })),
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("packages")) || [];

    if (location.state?.packageData) {
      const data = location.state.packageData;

      const normalized = normalizePackage(data);

      setForm({
        ...normalized,
        days: normalized.days || 1,
        nights: normalized.nights || 1,
        discount: normalized.discount || 0,
        category: normalized.category || "Luxury",
        status: normalized.status === "Active" || normalized.status === true,
        flightIncluded: normalized.flightIncluded || false,
        images: normalized.images || [],
        hotels: normalized.hotels || [],
        activities: normalized.activities || [],
        itinerary: normalized.itinerary || [],
      });

      setPreviewImages(normalized.images || []);
      return;
    }

    const found = stored.find((p) => p.id === id);

    if (found) {
      setForm({
        ...found,
        days: parseInt(found.duration?.split(" ")[0]) || 1,
        nights: parseInt(found.duration?.split(",")[1]) || 1,
        discount: found.discount || 0,
        category: found.category || "Luxury",
        status: found.status === "Active",
        flightIncluded: false,
        images: found.images || [],
        hotels: found.hotels || [],
        activities: found.activities || [],
        itinerary: normalizeItinerary(found.itinerary),
      });

      setPreviewImages(found.images || []);
    }
  }, [id, location]);

  if (!form) return <p className="p-6">Loading...</p>;

  // ✅ FIX 2: Correct handleSave (no nesting)
  const handleSave = () => {
    const stored = JSON.parse(localStorage.getItem("packages")) || [];

    const exists = stored.find((p) => p.id === form.id);

    let updated;

    if (exists) {
      const cleanForm = normalizePackage({
        ...form,

        // 🔥 CRITICAL FIX (ADD THIS)
        images:
          Array.isArray(form.images) && form.images.length > 0
            ? form.images
            : previewImages || [],

        duration: `${form.days} Days, ${form.nights} Nights`,
        price: Number(String(form.price).replace(/,/g, "")) || 0,
        status: form.status ? "Active" : "Draft",
      });

      // ✅ DEBUG HERE
      console.log("UPDATED PACKAGE:", cleanForm);

      updated = stored.map((p) => (p.id === form.id ? cleanForm : p));
    } else {
      const newPackage = normalizePackage({
        ...form,

        // 🔥 CRITICAL FIX
        images:
          Array.isArray(form.images) && form.images.length > 0
            ? form.images
            : previewImages || [],

        id: `PKG-${Math.floor(1000 + Math.random() * 900000)}`,
        duration: `${form.days} Days, ${form.nights} Nights`,
        price: Number(String(form.price).replace(/,/g, "")) || 0,
        bookings: 0,
        updated: new Date().toLocaleDateString(),
      });

      updated = [newPackage, ...stored];
    }

    localStorage.setItem("packages", JSON.stringify(updated));
    navigate("/packages");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const readers = files.map((file) => {
      return new Promise((res) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((images) => {
      const updated = [...previewImages, ...images].slice(0, 4);
      setPreviewImages(updated);
      setForm((prev) => ({
        ...prev,
        images: updated,
      }));
    });
  };

  const removeItem = (type, index) => {
    const updated = form[type].filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      [type]: updated,
    }));
  };

  // ✅ FIX 3: Proper itinerary object handling
  const addItem = (type) => {
    if (type === "itinerary") {
      const title = prompt("Enter Day Title");
      const description = prompt("Enter Description");

      if (!title) return;

      const newDay = {
        title,
        description: description || "",
        activities: [],
      };

      setForm({
        ...form,
        itinerary: [...(form.itinerary || []), newDay],
      });

      return;
    }

    const value = prompt(`Enter ${type}`);
    if (!value) return;

    setForm({
      ...form,
      [type]: [...(form[type] || []), value],
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Edit Package: {form.name}</h1>
          <p className="text-sm text-gray-500">
            Update the details of this travel package.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/packages")}
            className="border px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="col-span-2 space-y-6">
          {/* BASIC */}
          <div className="bg-white p-5 rounded-xl border">
            <h2 className="font-semibold mb-4">Basic Information.</h2>

            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 rounded mb-3"
              placeholder="Package Title"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="border p-2 rounded"
                placeholder="Destination"
              />

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border p-2 rounded"
              >
                <option>Luxury</option>
                <option>Budget</option>
                <option>Standard</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <input
                value={form.days}
                onChange={(e) => setForm({ ...form, days: e.target.value })}
                className="border p-2 rounded"
                placeholder="Duration (Days)"
              />
              <input
                value={form.nights}
                onChange={(e) => setForm({ ...form, nights: e.target.value })}
                className="border p-2 rounded"
                placeholder="Duration (Nights)"
              />
            </div>
          </div>

          {/* MEDIA */}
          <div className="bg-white p-5 rounded-xl border">
            <h2 className="font-semibold mb-3">Package Media</h2>

            <div className="flex gap-3 flex-wrap">
              {previewImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-28 h-20 rounded object-cover"
                />
              ))}

              <label className="w-28 h-20 border flex items-center justify-center cursor-pointer rounded">
                +
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          {/* ITINERARY */}
          <div className="bg-white p-5 rounded-xl border">
            <div className="flex justify-between mb-3">
              <h2 className="font-semibold">Itinerary Builder</h2>
              <button
                onClick={() => addItem("itinerary")}
                className="text-blue-600 text-sm"
              >
                + Add Day
              </button>
            </div>

            {form.itinerary?.map((day, i) => (
              <div key={i} className="border p-3 rounded mb-3">
                <p className="font-medium">{day.title}</p>
                <p className="text-sm text-gray-500">{day.description}</p>

                {day.activities?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {day.activities.map((act, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border">
            <h2 className="font-semibold mb-3">Pricing & Status</h2>

            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border p-2 rounded mb-3"
              placeholder="Base Price"
            />

            <input
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              className="w-full border p-2 rounded mb-3"
              placeholder="Discount %"
            />

            <div className="flex justify-between items-center">
              <span>Package Status</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-blue-600"
                checked={form.status}
                onChange={() => setForm({ ...form, status: !form.status })}
              />
            </div>
          </div>

          {/* HOTELS */}
          <div className="bg-white p-5 rounded-xl border">
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">Hotels</h2>
              <button onClick={() => addItem("hotels")}>+ Edit</button>
            </div>

            {form.hotels?.map((h, i) => (
              <div key={i} className="flex justify-between text-sm mb-1">
                <span>{typeof h === "object" ? h.name : h}</span>
                <button onClick={() => removeItem("hotels", i)}>✕</button>
              </div>
            ))}
          </div>

          {/* ACTIVITIES */}
          <div className="bg-white p-5 rounded-xl border">
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">Activities</h2>
              <button onClick={() => addItem("activities")}>+ Edit</button>
            </div>

            {form.activities?.map((a, i) => (
              <div key={i} className="flex justify-between text-sm mb-1">
                <span>{typeof a === "object" ? a.name : a}</span>
                <button onClick={() => removeItem("activities", i)}>✕</button>
              </div>
            ))}
          </div>

          {/* TRANSPORT */}
          <div className="bg-white p-5 rounded-xl border">
            <h2 className="font-semibold mb-3">Transport</h2>

            <div className="flex justify-between">
              <span>Flight Included</span>
              <input
                type="checkbox"
                checked={form.flightIncluded}
                onChange={() =>
                  setForm({
                    ...form,
                    flightIncluded: !form.flightIncluded,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPackage;
