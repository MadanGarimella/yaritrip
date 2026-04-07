import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    bookings: 0,
    revenue: 0,
    packages: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [destinationData, setDestinationData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const appData = JSON.parse(localStorage.getItem("appData")) || {};

      const bookings = appData.bookings || [];
      const users = appData.users || [];
      const packages = appData.packages || [];

      const totalRevenue = bookings
        .filter((b) => b.status === "Confirmed")
        .reduce((sum, b) => sum + Number(b.amount || 0), 0);

      setStats({
        users: users.length,
        bookings: bookings.length,
        revenue: totalRevenue,
        packages: packages.length,
      });

      // 📊 Revenue chart
      const monthly = {};

      bookings.forEach((b) => {
        if (b.status !== "Confirmed") return;

        const date = new Date(b.date || Date.now());
        const month = date.toLocaleString("default", {
          month: "short",
        });

        if (!monthly[month]) monthly[month] = 0;
        monthly[month] += Number(b.amount) || 0;
      });

      setRevenueData(
        Object.keys(monthly).map((m) => ({
          month: m,
          value: monthly[m],
        })),
      );

      // 🌍 Destination
      const destMap = {};

      bookings.forEach((b) => {
        const loc = b.destination || "Unknown";
        if (!destMap[loc]) destMap[loc] = 0;
        destMap[loc]++;
      });

      const total = Object.values(destMap).reduce((a, b) => a + b, 0);

      setDestinationData(
        Object.keys(destMap).map((loc) => ({
          label: loc,
          value: total ? Math.round((destMap[loc] / total) * 100) : 0,
        })),
      );

      setRecentBookings(bookings.slice(-5).reverse());
    };

    // 🔥 INITIAL LOAD
    loadData();

    // 🔥 REAL-TIME LISTENER
    window.addEventListener("appDataUpdated", loadData);

    return () => window.removeEventListener("appDataUpdated", loadData);
  }, []);

  return (
    <>
      {/* HEADER */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-semibold mb-1">Dashboard Overview</h1>
        <p className="text-gray-500 mb-6">
          Welcome back! Here's what's happening today
        </p>
      </motion.div>

      {/* STAT CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Users" value={stats.users} />
        <StatCard title="Bookings" value={stats.bookings} />
        <StatCard
          title="Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
        />
        <StatCard title="Packages" value={stats.packages} />
      </div>

      {/* CHART + DESTINATIONS */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* REVENUE CHART */}
        <motion.div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Monthly Revenue</h2>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <XAxis dataKey="month" />
              <Tooltip />
              <Line type="monotone" dataKey="value" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* DESTINATIONS */}
        <motion.div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Bookings by Destination</h2>

          {destinationData.map((d, i) => (
            <Destination key={i} label={d.label} value={d.value} />
          ))}
        </motion.div>
      </div>

      {/* RECENT BOOKINGS */}
      <motion.div className="bg-white p-5 rounded-xl shadow">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Recent Bookings</h2>
        </div>

        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2">Booking ID</th>
              <th>User</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentBookings.map((b, i) => (
              <Row key={i} booking={b} />
            ))}
          </tbody>
        </table>
      </motion.div>
    </>
  );
};

// COMPONENTS
const StatCard = ({ title, value }) => (
  <motion.div className="bg-white p-5 rounded-xl shadow">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-xl font-semibold mt-1">{value}</h2>
  </motion.div>
);

const Destination = ({ label, value }) => (
  <div className="mb-3">
    <div className="flex justify-between text-sm mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 bg-gray-200 rounded">
      <motion.div
        className="h-2 bg-blue-500 rounded"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const Row = ({ booking }) => {
  const statusColor = {
    Confirmed: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
    Cancelled: "bg-red-100 text-red-600",
  };

  return (
    <tr className="border-b">
      <td className="py-3 text-blue-500">{booking.id}</td>
      <td>{booking.user || "User"}</td>
      <td>{booking.destination || "-"}</td>
      <td>{booking.date || "-"}</td>
      <td>₹{booking.amount || 0}</td>
      <td>
        <span
          className={`text-xs px-2 py-1 rounded ${
            statusColor[booking.status] || "bg-gray-100"
          }`}
        >
          {booking.status || "Pending"}
        </span>
      </td>
    </tr>
  );
};

export default Dashboard;
