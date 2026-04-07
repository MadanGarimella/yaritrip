export const calculateTravellerPrice = (basePrice, travellers) => {
  const adults = travellers.filter(t => t.type === "Adult");
  const children = travellers.filter(t => t.type === "Child");

  return (
    adults.length * basePrice +
    children.length * (basePrice * 0.75)
  );
};