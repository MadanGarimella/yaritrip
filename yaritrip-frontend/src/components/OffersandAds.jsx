import offer1 from "../assets/offers/offer1.png";
import offer2 from "../assets/offers/offer2.png";
import offer3 from "../assets/offers/offer3.png";
// import offer4 from "../assets/offers/offer4.jpg";
// import offer5 from "../assets/offers/offer5.jpg";

const offers = [
  { id: 1, image: offer1 },
  { id: 2, image: offer2 },
  { id: 3, image: offer3 },
  // { id: 4, image: offer4 },
  // { id: 5, image: offer5 },
];

const Offers = () => {
  return (
    <section className="w-full px-4 py-14">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-6 font-heading ml-7">
          Exclusive Privileges for New Members
        </h2>

        {/* Cards */}
        <div className="flex gap-6 overflow-x-auto md:grid md:grid-cols-5 md:overflow-visible scrollbar-hide px-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="
                min-w-[260px] md:min-w-0
                h-[160px]
                rounded-xl
                overflow-hidden
                shadow-md
                transition-transform duration-300
                hover:scale-105
                cursor-pointer
                bg-white
              "
            >
              <img
                src={offer.image}
                alt={`Offer ${offer.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Hide scrollbar */}
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </section>
  );
};

export default Offers;
