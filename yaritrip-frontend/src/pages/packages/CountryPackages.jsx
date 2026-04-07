import { useParams, useNavigate } from "react-router-dom";
import { attractionsPackages } from "../../data/attractionsPackages";

const CountryPackages = () => {
  const { country } = useParams();
  const navigate = useNavigate();

  const packages = attractionsPackages[country?.toLowerCase()] || [];

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 capitalize">
          {country} Packages
        </h1>

        {packages.length === 0 ? (
          <div className="text-center text-gray-500">No packages available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id + "_" + index}
                onClick={() => navigate(`/packages/${country}/${pkg.id}`)}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
              >
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="h-52 w-full object-cover"
                />

                <div className="p-5">
                  <h3 className="font-semibold mb-2">{pkg.title}</h3>

                  <p className="text-sm text-gray-500 mb-2">{pkg.duration}</p>

                  <p className="text-blue-600 font-bold text-lg">
                    ₹{pkg.price?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryPackages;