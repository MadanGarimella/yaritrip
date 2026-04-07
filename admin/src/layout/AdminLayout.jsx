import {
  FaHome,
  FaUsers,
  FaSuitcase,
  FaBox,
  FaHotel,
  FaMapMarkedAlt,
  FaBus,
  FaMoneyBill,
  FaCog,
} from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import Logo from "../assets/images/logo2.png";

// 🔷 MENU CONFIG
const menuItems = [
  { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
  { name: "Users", icon: <FaUsers />, path: "/users" },
  { name: "Bookings", icon: <FaSuitcase />, path: "/bookings" },
  { name: "Packages", icon: <FaBox />, path: "/packages" },
];

const bottomMenu = [
  { name: "Payments", icon: <FaMoneyBill />, path: "/payments" },
  // { name: "Settings", icon: <FaCog />, path: "/settings" },
];

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <img
            src={Logo}
            alt="logo"
            className="w-[140px] object-contain"
          />
        </div>

        {/* MENU */}
        <div className="flex-1 px-3 py-4 space-y-2 text-sm overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarItem key={item.name} {...item} />
          ))}

          <p className="text-gray-400 text-xs mt-6 mb-2 px-2">
            FINANCE & TOOLS
          </p>

          {bottomMenu.map((item) => (
            <SidebarItem key={item.name} {...item} />
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
          <input
            className="w-1/2 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Yaritrp Admin.</p>
            </div>

            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              YA
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// 🔷 Sidebar Item
const SidebarItem = ({ icon, name, path }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      <span className="text-base">{icon}</span>
      <span>{name}</span>
    </NavLink>
  );
};

export default AdminLayout;