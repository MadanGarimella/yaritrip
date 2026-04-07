const API_BASE = "http://192.168.1.3:8082";

export const fetchPackagesByCountry = async (country) => {
  const res = await fetch(
    `${API_BASE}/api/packages?country=${country}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch packages");
  }

  return res.json();
};

export const fetchPackageById = async (id) => {
  const res = await fetch(
    `${API_BASE}/api/packages/${id}`
  );

  if (!res.ok) {
    throw new Error("Package not found");
  }

  return res.json();
};