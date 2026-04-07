import { Outlet } from "react-router-dom";

const CheckoutLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10"> 
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-20">
        <Outlet />
      </div>
    </div>
  );
};

export default CheckoutLayout;