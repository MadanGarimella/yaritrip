import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import UserProfile from "../pages/UserProfile";
import ResultsPage from "../pages/Results";
import AttractionsDetails from "../pages/AttractionsDetails";

/* OLD Results-Based Package Page */
import PackageDetails from "../pages/PackageDetails";

/* NEW Country Flow */
import CountryPackages from "../pages/packages/CountryPackages";


/* Checkout Pages */
import CheckoutLayout from "../pages/checkout/CheckoutLayout";
import TravellersStep from "../pages/checkout/TravellersStep";
import ReviewStep from "../pages/checkout/ReviewStep";
import PaymentStep from "../pages/checkout/PaymentStep";
import SuccessStep from "../pages/checkout/SuccessStep";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= MAIN PAGES ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/results" element={<ResultsPage />} />

      {/* ================= OLD PACKAGE FLOW (Results Page) ================= */}
      <Route path="/package/:id" element={<PackageDetails />} />

      {/* ================= NEW COUNTRY PACKAGE FLOW ================= */}

      {/* Important: Country route FIRST */}
      <Route path="/packages/:country" element={<CountryPackages />} />

      {/* Then detailed package route */}
      <Route
        path="/packages/:country/:packageId"
        element={<PackageDetails />}
      />
      <Route path="/attractions/:id" element={<AttractionsDetails />} />

      {/* ================= CHECKOUT FLOW ================= */}
      <Route path="/checkout/:id" element={<CheckoutLayout />}>
        <Route path="travellers" element={<TravellersStep />} />
        <Route path="review" element={<ReviewStep />} />
        <Route path="payment" element={<PaymentStep />} />
        <Route path="success" element={<SuccessStep />} />
      </Route>

      {/* ================= 404 ================= */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
            Page Not Found
          </div>
        }
      />

    </Routes>
  );
};

export default AppRoutes;