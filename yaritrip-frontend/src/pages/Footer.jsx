import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

import footerBg from "../assets/footer-bg.jpeg";
import suitcaseImg from "../assets/footer-img.png";

const Footer = () => {
  return (
    <footer className="w-full">
      {/* Outer wrapper */}
      <div className="relative max-w-7xl overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${footerBg})` }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Content */}
        <div className="relative z-10 px-8 py-10 text-white">
          {/* TOP SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-10 items-start">
            {/* Brand */}
            <div className="lg:col-span-2">
              <img
                src="/logo2.png"
                alt="yaritrip"
                className="h-36 object-contain"
              />

              <div className="flex gap-4 text-lg mb-8 ml-7">
                <FaFacebookF className="cursor-pointer hover:text-blue-400" />
                <FaTwitter className="cursor-pointer hover:text-sky-400" />
                <FaInstagram className="cursor-pointer hover:text-red-700" />
                <FaLinkedinIn className="cursor-pointer hover:text-blue-500" />
                <FaYoutube className="cursor-pointer hover:text-red-500" />
              </div>
            </div>

            {/* PRODUCT */}
            <div>
              <h4 className="text-lime-400 font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li className="hover:text-white cursor-pointer">Features</li>
                <li className="hover:text-white cursor-pointer">Pricing</li>
                <li className="hover:text-white cursor-pointer">Reviews</li>
                <li className="hover:text-white cursor-pointer">
                  Travel Guidance
                </li>
                <li className="hover:text-white cursor-pointer">Updates</li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="text-lime-400 font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li className="hover:text-white cursor-pointer">About</li>
                <li className="hover:text-white cursor-pointer">Contact us</li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <h4 className="text-lime-400 font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li className="hover:text-white cursor-pointer">Help center</li>
                <li className="hover:text-white cursor-pointer">
                  Server status
                </li>
                <li className="hover:text-white cursor-pointer">
                  Report a bug
                </li>
              </ul>
            </div>

            {/* CONTACT */}
            <div className="">
              <h4 className="text-lime-400 font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li className="flex items-center gap-2">
                  {/* <FaEnvelope className="text-lime-400" /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                  >
                    <g fill="none">
                      <path
                        fill="#367af2"
                        d="M2.757 6.071A.5.5 0 0 0 2 6.5v8A2.5 2.5 0 0 0 4.5 17h11a2.5 2.5 0 0 0 2.5-2.5v-8a.5.5 0 0 0-.757-.429L10 10.417z"
                      />
                      <path
                        fill="url(#SVGj5XpYbUo)"
                        d="M2.757 6.071A.5.5 0 0 0 2 6.5v8A2.5 2.5 0 0 0 4.5 17h11a2.5 2.5 0 0 0 2.5-2.5v-8a.5.5 0 0 0-.757-.429L10 10.417z"
                      />
                      <path
                        fill="url(#SVGygvXycNq)"
                        d="M2.757 6.071A.5.5 0 0 0 2 6.5v8A2.5 2.5 0 0 0 4.5 17h11a2.5 2.5 0 0 0 2.5-2.5v-8a.5.5 0 0 0-.757-.429L10 10.417z"
                      />
                      <path
                        fill="url(#SVGt4VFbc3v)"
                        fillOpacity="0.75"
                        d="M2.757 6.071A.5.5 0 0 0 2 6.5v8A2.5 2.5 0 0 0 4.5 17h11a2.5 2.5 0 0 0 2.5-2.5v-8a.5.5 0 0 0-.757-.429L10 10.417z"
                      />
                      <path
                        fill="url(#SVGdPNFZbrR)"
                        fillOpacity="0.7"
                        d="M2.757 6.071A.5.5 0 0 0 2 6.5v8A2.5 2.5 0 0 0 4.5 17h11a2.5 2.5 0 0 0 2.5-2.5v-8a.5.5 0 0 0-.757-.429L10 10.417z"
                      />
                      <path
                        fill="url(#SVGqtSPpd1q)"
                        d="M4.5 4A2.5 2.5 0 0 0 2 6.5v.6a.5.5 0 0 0 .247.431l7.5 4.4a.5.5 0 0 0 .506 0l7.5-4.4A.5.5 0 0 0 18 7.1v-.6A2.5 2.5 0 0 0 15.5 4z"
                      />
                      <defs>
                        <linearGradient
                          id="SVGj5XpYbUo"
                          x1="12.031"
                          x2="16.923"
                          y1="8.156"
                          y2="16.616"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop
                            offset=".228"
                            stopColor="#0094f0"
                            stopOpacity="0"
                          />
                          <stop offset=".431" stopColor="#0094f0" />
                        </linearGradient>
                        <linearGradient
                          id="SVGygvXycNq"
                          x1="7.714"
                          x2="2.272"
                          y1="7.158"
                          y2="17.134"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop
                            offset=".228"
                            stopColor="#0094f0"
                            stopOpacity="0"
                          />
                          <stop offset=".431" stopColor="#0094f0" />
                        </linearGradient>
                        <linearGradient
                          id="SVGt4VFbc3v"
                          x1="14.219"
                          x2="15.057"
                          y1="12.563"
                          y2="17.991"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#2764e7" stopOpacity="0" />
                          <stop offset="1" stopColor="#2764e7" />
                        </linearGradient>
                        <linearGradient
                          id="SVGdPNFZbrR"
                          x1="12.476"
                          x2="14.006"
                          y1="7.351"
                          y2="18.41"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop
                            offset=".533"
                            stopColor="#ff6ce8"
                            stopOpacity="0"
                          />
                          <stop offset="1" stopColor="#ff6ce8" />
                        </linearGradient>
                        <linearGradient
                          id="SVGqtSPpd1q"
                          x1="6.753"
                          x2="12.394"
                          y1="1.507"
                          y2="15.118"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#6ce0ff" />
                          <stop offset=".462" stopColor="#29c3ff" />
                          <stop offset="1" stopColor="#4894fe" />
                        </linearGradient>
                      </defs>
                    </g>
                  </svg>
                  contact@yaritrip.com
                </li>
                <li className="flex items-center gap-2">
                  {/* <FaPhoneAlt className="text-lime-400" /> */}
                  (+91) 98765-43210
                </li>
                <li>Support Hours: 24/7</li>
              </ul>
            </div>

            {/* SUITCASE IMAGE */}
            <div className="hidden lg:flex justify-end items-end">
              <img
                src={suitcaseImg}
                alt="Travel suitcase"
                className="h-48 object-contain"
              />
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300 gap-4">
            <span>© 2026 yaritrip. All rights reserved.</span>

            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer">
                Terms & Conditions
              </span>
              <span className="hover:text-white cursor-pointer">
                Privacy Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
