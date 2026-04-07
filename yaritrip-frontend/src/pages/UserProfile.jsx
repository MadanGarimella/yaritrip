import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import User from "../assets/UserProfile/user.png";
import DefaultAvatar from "../assets/UserProfile/user.png";
import Banner from "../assets/UserProfile/image.jpg";

const getProfileImage = () => {
  return localStorage.getItem("profileImage") || "/default-avatar.png";
};
const UserProfile = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Personal Information");
  const [profileImage, setProfileImage] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const tabs = [
    "Personal Information",
    "Wallet",
    // "Preferred Language",
    "Wishlist",
    "My Bookings",
    "Notifications",
    "Privacy and Policy",
    "Terms and Conditions",
  ];

  /* -------- Load Profile + Image -------- */
  const loadProfileImage = () => {
    setProfileImage(getProfileImage());
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    loadProfileImage(); // ✅ now works correctly

    if (!token) {
      navigate("/");
      return;
    }

    fetch("http://localhost:8082/api/users/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        setProfile({
          name: data.name,
          email: data.email,
          mobile: data.mobile,
        });
      })
      .catch(() => navigate("/"));
  }, [navigate]);
  useEffect(() => {
    const handleUpdate = () => {
      const savedImage = localStorage.getItem("profileImage");
      if (savedImage) setProfileImage(savedImage);
    };

    window.addEventListener("profileUpdated", handleUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleUpdate);
    };
  }, []);

  // Wishlist State (ADD THIS)
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  });

  // Toggle Function (ADD THIS)
  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
      } else {
        updated = [...prev, id];
      }
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  /* -------- Image Upload -------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result;

      // Save in state
      setProfileImage(base64Image);

      // Persist across reloads
      localStorage.setItem("profileImage", base64Image);

      // Optional: trigger global update (navbar sync)
      window.dispatchEvent(new Event("profileUpdated"));
    };

    reader.readAsDataURL(file);
  };

  /* -------- Logout -------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    // localStorage.removeItem("");
    navigate("/");
  };

  /* -------- Update Profile -------- */
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedImage = localStorage.getItem("profileImage");

      const res = await fetch("http://localhost:8082/api/users/me", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          mobile: profile.mobile,
          profileImage: storedImage, // ✅ include image
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updatedUser = await res.json();

      // ✅ Update UI instantly
      alert("Profile updated successfully!");

      // ✅ Sync across app (Navbar etc.)
      window.dispatchEvent(new Event("profileUpdated"));
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // wallet
  const [wallet, setWallet] = useState({
    credits: 0,
  });
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("User not logged in");
          return;
        }

        const response = await fetch("http://localhost:8082/api/wallet", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch wallet");

        const data = await response.json();

        setWallet({
          credits: data, // ✅ backend returns int directly
        });
      } catch (error) {
        console.error("Wallet fetch error:", error);
      }
    };

    fetchWallet();
  }, []);
  /* -------- Dummy Bookings -------- */
  const bookings = [
    {
      id: 4,
      destination: "Goa",
      image: "/goa.png",
      rating: 4.7,
      duration: "3 Days 4 Nights",
      flights: 2,
      hotels: 1,
      transfers: 2,
      activities: 4,
      features: [
        "Tour combo with return airport transfer",
        "City Tour",
        "Curious Corner",
      ],
      emi: "2,385",
      price: "7,154",
      total: "42,924",
    },
    {
      id: 1,
      image: "/goa.png",
      destination: "Dubai Luxury Package",
      date: "12 Mar 2026",
      status: "Confirmed",
      amount: "₹48,000",
    },
    {
      id: 2,
      image: "/goa.png",
      destination: "Kerala Backwater Resort",
      date: "05 Jan 2026",
      status: "Completed",
      amount: "₹22,500",
    },
    {
      id: 3,
      image: "/goa.png",
      destination: "Singapore Skyline Tour",
      date: "22 Dec 2025",
      status: "Cancelled",
      amount: "₹36,700",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      {/* Banner */}
      <div className="h-80 relative">
        <img src={Banner} alt="banner" className="h-full w-full object-cover" />

        {/* Profile Image */}
        <div className="absolute -bottom-16 left-6 md:left-20">
          <div className="relative w-36 h-36">
            <div className="w-full h-full rounded-full border-4 border-white overflow-hidden shadow-xl bg-white">
              <img
                src={profileImage || DefaultAvatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition">
              ✏️ Edit
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="bg-white rounded-2xl shadow-md p-5 h-fit">
            <ul className="space-y-3">
              {tabs.map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition
                      ${
                        activeTab === tab
                          ? "bg-blue-100 text-blue-600"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={handleLogout}
              className="mt-6 w-full py-2 border border-red-400 text-red-500 rounded-xl font-medium hover:bg-red-50 transition"
            >
              Log Out ➜]
            </button>
          </div>

          {/* Content */}
          <div className="md:col-span-3 bg-white rounded-2xl shadow-md p-6 md:p-8">
            {/* Personal Information */}
            {activeTab === "Personal Information" && (
              <>
                <h2 className="text-xl font-semibold mb-6">
                  Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      readOnly
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      readOnly
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={profile.mobile}
                      readOnly
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}

            {/* Preferred Language */}
            {activeTab === "Wallet" && (
              <>
                <div className="font-semibold text-[24px]">Wallet</div>

                <div className="w-[350px] border border-black rounded-xl p-6 flex justify-between items-center bg-gray-100 max-w-md mt-5">
                  {/* Left Content */}
                  <div>
                    <p className="text-xs tracking-widest text-gray-600 mb-2">
                      CURRENT BALANCE
                    </p>

                    <h1 className="text-4xl font-bold text-blue-600">
                      {wallet.credits}{" "}
                      <span className="text-black text-lg font-medium">
                        Credits
                      </span>
                    </h1>

                    <p className="mt-3 text-sm text-gray-700">
                      1 Yari Coin 🪙 = 1 Rupee
                    </p>
                  </div>

                  {/* Right Icon */}
                  <div className="text-5xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={48}
                      height={48}
                      viewBox="0 0 48 48"
                    >
                      <g fill="none" strokeWidth={3}>
                        <path
                          fill="#8fbffa"
                          d="M3.419 39.945c.208 2.551 2.189 4.47 4.742 4.647C11.1 44.796 15.637 45 22 45s10.9-.204 13.839-.408c2.553-.176 4.534-2.096 4.742-4.647C40.796 37.31 41 33.387 41 28s-.204-9.31-.419-11.945c-.208-2.551-2.189-4.47-4.742-4.647C32.899 11.204 28.363 11 22 11s-10.9.204-13.84.408c-2.552.176-4.533 2.096-4.741 4.647C3.204 18.689 3 22.613 3 28s.204 9.31.419 11.945"
                        ></path>
                        <path
                          fill="#fff"
                          d="M7.16 11.572c5.985-3.122 13.63-6.005 20.758-7.76c2.073-.51 4.215.258 5.293 2.1c.773 1.32 1.717 3.132 2.714 5.502l-.086-.006c-2.94-.204-7.476-.408-13.84-.408c-6.362 0-10.899.204-13.838.408a5.4 5.4 0 0 0-1 .164Zm21.904 19.551c.095 2.13 1.737 3.717 3.866 3.802c1.085.044 2.434.075 4.07.075s2.985-.031 4.07-.075c2.13-.085 3.771-1.672 3.866-3.802c.038-.867.064-1.904.064-3.123s-.026-2.256-.064-3.123c-.095-2.13-1.737-3.717-3.866-3.802A102 102 0 0 0 37 21c-1.636 0-2.985.031-4.07.075c-2.13.085-3.771 1.672-3.866 3.802A71 71 0 0 0 29 28c0 1.22.026 2.256.064 3.123"
                        ></path>
                        <path
                          stroke="#2859c5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.269 11.515c5.969-3.1 13.564-5.96 20.65-7.703c2.073-.51 4.215.257 5.293 2.099c.77 1.316 1.71 3.12 2.704 5.478m-6.852 19.734c.095 2.13 1.737 3.717 3.866 3.802c1.085.044 2.434.075 4.07.075s2.985-.031 4.07-.075c2.13-.085 3.771-1.672 3.866-3.802c.038-.867.064-1.904.064-3.123s-.026-2.256-.064-3.123c-.095-2.13-1.737-3.717-3.866-3.802A102 102 0 0 0 37 21c-1.636 0-2.985.031-4.07.075c-2.13.085-3.771 1.672-3.866 3.802A71 71 0 0 0 29 28c0 1.22.026 2.256.064 3.123"
                        ></path>
                        <path
                          stroke="#2859c5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M40.874 21.067a119 119 0 0 0-.293-5.012c-.208-2.551-2.189-4.47-4.742-4.647C32.899 11.204 28.363 11 22 11s-10.9.204-13.84.408c-2.552.176-4.533 2.096-4.741 4.647C3.204 18.689 3 22.613 3 28s.204 9.31.419 11.945c.208 2.551 2.189 4.47 4.742 4.647C11.1 44.796 15.637 45 22 45s10.9-.204 13.839-.408c2.553-.176 4.534-2.096 4.742-4.647c.109-1.333.215-2.996.293-5.012M36 27v2"
                        ></path>
                      </g>
                    </svg>
                  </div>
                </div>

                <div className="mt-10 text-gray-500">
                  <div>How to get and use Yari coin’s</div>
                  <div>
                    1. While booking a trip, you will receive some Yari coins.{" "}
                    <br />
                    2. You can use these coins to buy discount coupons. <br />
                    3. You can also use Yari coins while booking a trip. <br />
                  </div>
                </div>
              </>
            )}

            {/* Wishlist */}
            {activeTab === "Wishlist" && (
              <>
                <h2 className="text-xl font-semibold mb-6">Wishlist</h2>
                {(() => {
                  const wishlistData = bookings.filter((b) =>
                    wishlist.includes(b.id),
                  );

                  return wishlistData.length === 0 ? (
                    <p className="text-gray-500">
                      You haven’t added any destinations yet.
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {wishlistData.map((item) => (
                        <div
                          key={item.id}
                          className="border rounded-xl p-4 shadow-sm"
                        >
                          <img
                            src={item.image}
                            alt={item.destination}
                            className="w-full h-[160px] object-cover rounded-lg"
                          />

                          <div className="flex justify-between items-center mt-3">
                            <h3 className="font-semibold">
                              {item.destination}
                            </h3>

                            <button
                              onClick={() => toggleWishlist(item.id)}
                              className="text-xl"
                            >
                              ❤️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </>
            )}

            {/* My Bookings */}
            {activeTab === "My Bookings" && (
              <>
                <h2 className="text-xl font-semibold mb-6">My Booking's</h2>

                <div className="flex flex-col gap-6">
                  {bookings &&
                    bookings.length > 0 &&
                    bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex gap-6 min-w-[700px] bg-gray-100 p-5 rounded-2xl"
                      >
                        {/* LEFT CARD */}
                        <div className="bg-white rounded-2xl shadow-md p-4 w-[350px]">
                          {/* Image */}
                          <div className="relative">
                            <img
                              src={booking.image}
                              alt={booking.destination}
                              className="w-full h-[180px] object-cover rounded-xl"
                            />
                            <button
                              onClick={() => toggleWishlist(booking.id)}
                              className="absolute top-3 right-3 text-xl"
                            >
                              {wishlist.includes(booking.id) ? "❤️" : "🤍"}
                            </button>
                          </div>

                          {/* Title */}
                          <div className="mt-3 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                              {booking.destination}
                            </h3>
                            <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                              ⭐ {booking.rating}
                            </div>
                          </div>

                          {/* Duration */}
                          <p className="text-sm text-gray-500">
                            {booking.duration}
                          </p>

                          {/* Icons Row */}
                          <div className="flex gap-4 text-xs text-gray-600 mt-3">
                            <span>✈ {booking.flights} Flights</span>
                            <span>🏨 {booking.hotels} Hotel</span>
                            <span>🚗 {booking.transfers} Transfers</span>
                            <span>🎯 {booking.activities} Activities</span>
                          </div>

                          {/* Features */}
                          <ul className="text-sm text-gray-600 mt-3 list-disc pl-4 space-y-1">
                            {booking.features?.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>

                          {/* Pricing */}
                          <div className="bg-blue-50 rounded-xl p-3 mt-4 flex justify-between text-sm">
                            <div>
                              <p>No Cost EMI</p>
                              <p className="text-gray-500">
                                at ₹{booking.emi}/month
                              </p>
                            </div>
                            <div className="text-right">
                              <p>₹{booking.price}/Person</p>
                              <p className="text-gray-500">
                                Total ₹{booking.total}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT REVIEW PANEL */}
                        <div className="flex-1 bg-white rounded-2xl shadow-md p-5">
                          <h3 className="font-semibold mb-4">
                            Review Your Trip
                          </h3>

                          {/* Rating */}
                          <p className="text-sm text-gray-600 mb-2">
                            Rate the trip
                          </p>
                          <div className="border rounded-lg p-3 flex gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className="text-gray-400 text-xl cursor-pointer"
                              >
                                ☆
                              </span>
                            ))}
                          </div>

                          {/* Review */}
                          <p className="text-sm text-gray-600 mb-2">
                            Share your experience
                          </p>
                          <textarea
                            className="w-full border rounded-lg p-3 h-[120px] resize-none"
                            placeholder="Write your experience..."
                          ></textarea>

                          {/* Button */}
                          <div className="flex justify-end mt-4">
                            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md">
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {/* Notifications */}
            {activeTab === "Notifications" && (
              <>
                <h2 className="text-xl font-semibold mb-6">Notifications</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Email Notifications</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex justify-between">
                    <span>SMS Alerts</span>
                    <input type="checkbox" />
                  </div>
                </div>
              </>
            )}

            {/* Privacy */}
            {activeTab === "Privacy and Policy" && (
              <>
                <h2 className="text-xl font-semibold mb-6">
                  Privacy and Policy
                </h2>
                <p className="text-gray-600">
                  Your privacy is important to us. We ensure secure handling of
                  all personal and booking information.
                </p>
              </>
            )}

            {/* Terms */}
            {activeTab === "Terms and Conditions" && (
              <>
                <h2 className="text-xl font-semibold mb-6">
                  Terms and Conditions
                </h2>
                <p className="text-gray-600">
                  By using Yaritrip, you agree to our booking, cancellation, and
                  refund policies.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
