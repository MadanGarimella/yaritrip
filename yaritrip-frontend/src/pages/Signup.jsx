import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import loginBg from "../assets/signup-bg.jpeg";

/* -------- Social Icons (Same as Login) -------- */

const GoogleIcon = () => (
  <svg viewBox="0 0 128 128" className="w-5 h-5">
    <path
      fill="#fff"
      d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.3 74.3 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.2 36.2 0 0 1-13.93 5.5a41.3 41.3 0 0 1-15.1 0A37.2 37.2 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.3 38.3 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.3 34.3 0 0 1 13.64 8q5.83-5.8 11.64-11.63A61.2 61.2 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1877F2]">
    <path d="M22.675 0H1.325A1.32 1.32 0 0 0 0 1.325v21.351A1.32 1.32 0 0 0 1.325 24h11.495v-9.294H9.692V11.01h3.128V8.309c0-3.1 1.894-4.788 4.659-4.788c1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.696h-3.12V24h6.116A1.32 1.32 0 0 0 24 22.676V1.325A1.32 1.32 0 0 0 22.675 0" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black">
    <path d="M16.365 1.43c0 1.14-.417 2.273-1.25 3.19c-.865.96-2.287 1.704-3.497 1.608c-.159-1.2.417-2.38 1.177-3.21c.833-.92 2.35-1.63 3.57-1.588zM20.55 17.49c-.48 1.06-.71 1.53-1.33 2.46c-.87 1.31-2.1 2.95-3.64 2.96c-1.37.01-1.72-.9-3.57-.9c-1.86 0-2.25.88-3.58.92c-1.54.06-2.71-1.43-3.58-2.74c-2.38-3.48-2.63-7.56-1.17-9.81c1.03-1.6 2.66-2.54 4.18-2.54c1.56 0 2.54.91 3.83.91c1.26 0 2.03-.92 3.82-.92c1.35 0 2.79.73 3.82 1.99c-3.36 1.84-2.82 6.62.2 7.67z" />
  </svg>
);

/* ---------------- SIGNUP PAGE ---------------- */

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // const response = await fetch("http://192.168.1.3:8082/api/auth/register", {
      const response = await fetch("http://localhost:8082/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
      });

      const data = await response.text();

      if (response.ok) {
        // Registration successful, navigate to login
        navigate("/login");
      } else {
        setError(data || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://192.168.1.3:8082/oauth2/authorization/google";
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* ✅ RESPONSIVE FIX APPLIED (NO UI CHANGE) */}
      <div
        className="
          relative z-10 min-h-screen 
          flex items-center justify-center
          px-4 sm:px-6 md:px-10
          py-20 sm:py-24 md:py-32
          ml-0 lg:ml-[550px]
        "
      >
        {/* Signup Card */}
        <div className="w-full max-w-md rounded-2xl p-6 md:p-8 font-body bg-black/30">
          {/* Heading */}
          <h2 className="text-2xl font-heading text-center text-white mb-5">
            Start Your Journey with <br />
            <span className="text-sky-300">Yaritrip</span>
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          {/* ---------------- FORM ---------------- */}
          <form className="space-y-4 items-center" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="flex items-center gap-2 border border-gray-400 rounded-lg px-3 py-2 focus-within:border-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                className="text-blue-500"
              >
                <path
                  fill="currentColor"
                  d="M16.563 15.9c-.159-.052-1.164-.505-.536-2.414h-.009c1.637-1.686 2.888-4.399 2.888-7.07c0-4.107-2.731-6.26-5.905-6.26c-3.176 0-5.892 2.152-5.892 6.26c0 2.682 1.244 5.406 2.891 7.088c.642 1.684-.506 2.309-.746 2.397c-3.324 1.202-7.224 3.393-7.224 5.556v.811c0 2.947 5.714 3.617 11.002 3.617c5.296 0 10.938-.67 10.938-3.617v-.811c0-2.228-3.919-4.402-7.407-5.557"
                />
              </svg>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full text-sm outline-none bg-transparent text-white placeholder-gray-300"
                required
              />
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 border border-gray-400 rounded-lg px-3 py-2 focus-within:border-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28"
              >
                <g fill="none">
                  <path
                    fill="#367af2"
                    d="M2.004 8.503V19.25A3.75 3.75 0 0 0 5.754 23H22.25A3.75 3.75 0 0 0 26 19.25V8.5l-11.658 5.972a.75.75 0 0 1-.684 0z"
                  />
                  <path
                    fill="url(#SVGtG408c5M)"
                    d="M2.004 8.503V19.25A3.75 3.75 0 0 0 5.754 23H22.25A3.75 3.75 0 0 0 26 19.25V8.5l-11.658 5.972a.75.75 0 0 1-.684 0z"
                  />
                  <path
                    fill="url(#SVGrLvNhcEu)"
                    d="M2.004 8.503V19.25A3.75 3.75 0 0 0 5.754 23H22.25A3.75 3.75 0 0 0 26 19.25V8.5l-11.658 5.972a.75.75 0 0 1-.684 0z"
                  />
                  <path
                    fill="url(#SVG49Qp7dwT)"
                    fillOpacity="0.75"
                    d="M2.004 8.503V19.25A3.75 3.75 0 0 0 5.754 23H22.25A3.75 3.75 0 0 0 26 19.25V8.5l-11.658 5.972a.75.75 0 0 1-.684 0z"
                  />
                  <path
                    fill="url(#SVGOEEeZe0L)"
                    fillOpacity="0.7"
                    d="M2.004 8.503V19.25A3.75 3.75 0 0 0 5.754 23H22.25A3.75 3.75 0 0 0 26 19.25V8.5l-11.658 5.972a.75.75 0 0 1-.684 0z"
                  />
                  <path
                    fill="url(#SVGU3EVhdjL)"
                    d="M2.004 7.75A3.75 3.75 0 0 1 5.754 4H22.25A3.75 3.75 0 0 1 26 7.75v1.2l-11.658 5.972a.75.75 0 0 1-.684 0L2.004 8.953z"
                  />
                  <defs>
                    <linearGradient
                      id="SVGtG408c5M"
                      x1="17.5"
                      x2="23.168"
                      y1="10.5"
                      y2="23.701"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop
                        offset=".199"
                        stopColor="#0094f0"
                        stopOpacity="0"
                      />
                      <stop offset=".431" stopColor="#0094f0" />
                    </linearGradient>
                    <linearGradient
                      id="SVGrLvNhcEu"
                      x1="10.574"
                      x2="4.55"
                      y1="10.026"
                      y2="24.154"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop
                        offset=".191"
                        stopColor="#0094f0"
                        stopOpacity="0"
                      />
                      <stop offset=".431" stopColor="#0094f0" />
                    </linearGradient>
                    <linearGradient
                      id="SVG49Qp7dwT"
                      x1="20.329"
                      x2="21.305"
                      y1="17.151"
                      y2="24.345"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#2764e7" stopOpacity="0" />
                      <stop offset="1" stopColor="#2764e7" />
                    </linearGradient>
                    <linearGradient
                      id="SVGOEEeZe0L"
                      x1="17.716"
                      x2="19.496"
                      y1="10.281"
                      y2="24.921"
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
                      id="SVGU3EVhdjL"
                      x1="9.133"
                      x2="16.477"
                      y1=".555"
                      y2="19.789"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#6ce0ff" />
                      <stop offset=".462" stopColor="#29c3ff" />
                      <stop offset="1" stopColor="#4894fe" />
                    </linearGradient>
                  </defs>
                </g>
              </svg>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full text-sm outline-none bg-transparent text-white placeholder-gray-300"
                required
              />
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 border border-gray-400 rounded-lg px-3 py-2 focus-within:border-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#005cf4"
                  d="m16.556 12.906l-.455.453s-1.083 1.076-4.038-1.862s-1.872-4.014-1.872-4.014l.286-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.09 1.587.808 5 4.812 8.982c4.247 4.222 8.232 4.39 9.861 4.238c.516-.048.964-.31 1.325-.67l1.42-1.412c.96-.953.69-2.588-.538-3.255l-1.91-1.039c-.806-.437-1.787-.309-2.417.317"
                />
              </svg>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full text-sm outline-none bg-transparent text-white placeholder-gray-300"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-2 border border-gray-400 rounded-lg px-3 py-2 focus-within:border-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#005cf3"
                  d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"
                />
              </svg>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create Password"
                className="w-full text-sm outline-none bg-transparent text-white placeholder-gray-300"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex items-center gap-2 border border-gray-400 rounded-lg px-3 py-2 focus-within:border-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#005cf3"
                  d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"
                />
              </svg>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full text-sm outline-none bg-transparent text-white placeholder-gray-300"
                required
              />
            </div>

            {/* Submit */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-center text-white mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-sky-400 font-semibold">
              Login
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-400"></div>
            <span className="text-sm text-gray-100">or</span>
            <div className="flex-1 h-px bg-gray-400"></div>
          </div>

          {/* Social Login */}
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleGoogleSignup}
              className="w-14 h-10 flex items-center justify-center bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <span className="text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 128 128"
                >
                  <path
                    fill="#fff"
                    d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.3 74.3 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.2 36.2 0 0 1-13.93 5.5a41.3 41.3 0 0 1-15.1 0A37.2 37.2 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.3 38.3 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.3 34.3 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.2 61.2 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38"
                  />
                  <path
                    fill="#e33629"
                    d="M44.59 4.21a64 64 0 0 1 42.61.37a61.2 61.2 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.3 34.3 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21"
                  />
                  <path
                    fill="#f8bd00"
                    d="M3.26 51.5a63 63 0 0 1 5.5-15.9l20.73 16.09a38.3 38.3 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9"
                  />
                  <path
                    fill="#587dbd"
                    d="M65.27 52.15h59.52a74.3 74.3 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68"
                  />
                  <path
                    fill="#319f43"
                    d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.2 37.2 0 0 0 14.08 6.08a41.3 41.3 0 0 0 15.1 0a36.2 36.2 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.7 63.7 0 0 1 8.75 92.4"
                  />
                </svg>
              </span>
            </button>
            <button className="w-14 h-10 flex items-center justify-center bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <span className="text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="#1877f2"
                    d="M256 128C256 57.308 198.692 0 128 0S0 57.308 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.348-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.959 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445"
                  />
                  <path
                    fill="#fff"
                    d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A129 129 0 0 0 128 256a129 129 0 0 0 20-1.555V165z"
                  />
                </svg>
              </span>
            </button>
            <button className="w-14 h-10 flex items-center justify-center bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <span className="text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 128 128"
                >
                  <path d="M97.905 67.885c.174 18.8 16.494 25.057 16.674 25.137c-.138.44-2.607 8.916-8.597 17.669c-5.178 7.568-10.553 15.108-19.018 15.266c-8.318.152-10.993-4.934-20.504-4.934c-9.508 0-12.479 4.776-20.354 5.086c-8.172.31-14.395-8.185-19.616-15.724C15.822 94.961 7.669 66.8 18.616 47.791c5.438-9.44 15.158-15.417 25.707-15.571c8.024-.153 15.598 5.398 20.503 5.398c4.902 0 14.106-6.676 23.782-5.696c4.051.169 15.421 1.636 22.722 12.324c-.587.365-13.566 7.921-13.425 23.639M82.272 21.719c4.338-5.251 7.258-12.563 6.462-19.836c-6.254.251-13.816 4.167-18.301 9.416c-4.02 4.647-7.54 12.087-6.591 19.216c6.971.54 14.091-3.542 18.43-8.796" />
                </svg>
              </span>
            </button>
            <button className="w-14 h-10 flex items-center justify-center bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <span className="text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 256 256"
                >
                  <g fill="none">
                    <rect
                      width="256"
                      height="256"
                      fill="url(#SVGWRUqebek)"
                      rx="60"
                    />
                    <rect
                      width="256"
                      height="256"
                      fill="url(#SVGfkNpldMH)"
                      rx="60"
                    />
                    <path
                      fill="#fff"
                      d="M128.009 28c-27.158 0-30.567.119-41.233.604c-10.646.488-17.913 2.173-24.271 4.646c-6.578 2.554-12.157 5.971-17.715 11.531c-5.563 5.559-8.98 11.138-11.542 17.713c-2.48 6.36-4.167 13.63-4.646 24.271c-.477 10.667-.602 14.077-.602 41.236s.12 30.557.604 41.223c.49 10.646 2.175 17.913 4.646 24.271c2.556 6.578 5.973 12.157 11.533 17.715c5.557 5.563 11.136 8.988 17.709 11.542c6.363 2.473 13.631 4.158 24.275 4.646c10.667.485 14.073.604 41.23.604c27.161 0 30.559-.119 41.225-.604c10.646-.488 17.921-2.173 24.284-4.646c6.575-2.554 12.146-5.979 17.702-11.542c5.563-5.558 8.979-11.137 11.542-17.712c2.458-6.361 4.146-13.63 4.646-24.272c.479-10.666.604-14.066.604-41.225s-.125-30.567-.604-41.234c-.5-10.646-2.188-17.912-4.646-24.27c-2.563-6.578-5.979-12.157-11.542-17.716c-5.562-5.562-11.125-8.979-17.708-11.53c-6.375-2.474-13.646-4.16-24.292-4.647c-10.667-.485-14.063-.604-41.23-.604zm-8.971 18.021c2.663-.004 5.634 0 8.971 0c26.701 0 29.865.096 40.409.575c9.75.446 15.042 2.075 18.567 3.444c4.667 1.812 7.994 3.979 11.492 7.48c3.5 3.5 5.666 6.833 7.483 11.5c1.369 3.52 3 8.812 3.444 18.562c.479 10.542.583 13.708.583 40.396s-.104 29.855-.583 40.396c-.446 9.75-2.075 15.042-3.444 18.563c-1.812 4.667-3.983 7.99-7.483 11.488c-3.5 3.5-6.823 5.666-11.492 7.479c-3.521 1.375-8.817 3-18.567 3.446c-10.542.479-13.708.583-40.409.583c-26.702 0-29.867-.104-40.408-.583c-9.75-.45-15.042-2.079-18.57-3.448c-4.666-1.813-8-3.979-11.5-7.479s-5.666-6.825-7.483-11.494c-1.369-3.521-3-8.813-3.444-18.563c-.479-10.542-.575-13.708-.575-40.413s.096-29.854.575-40.396c.446-9.75 2.075-15.042 3.444-18.567c1.813-4.667 3.983-8 7.484-11.5s6.833-5.667 11.5-7.483c3.525-1.375 8.819-3 18.569-3.448c9.225-.417 12.8-.542 31.437-.563zm62.351 16.604c-6.625 0-12 5.37-12 11.996c0 6.625 5.375 12 12 12s12-5.375 12-12s-5.375-12-12-12zm-53.38 14.021c-28.36 0-51.354 22.994-51.354 51.355s22.994 51.344 51.354 51.344c28.361 0 51.347-22.983 51.347-51.344c0-28.36-22.988-51.355-51.349-51.355zm0 18.021c18.409 0 33.334 14.923 33.334 33.334c0 18.409-14.925 33.334-33.334 33.334s-33.333-14.925-33.333-33.334c0-18.411 14.923-33.334 33.333-33.334"
                    />
                    <defs>
                      <radialGradient
                        id="SVGWRUqebek"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientTransform="matrix(0 -253.715 235.975 0 68 275.717)"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#fd5" />
                        <stop offset=".1" stopColor="#fd5" />
                        <stop offset=".5" stopColor="#ff543e" />
                        <stop offset="1" stopColor="#c837ab" />
                      </radialGradient>
                      <radialGradient
                        id="SVGfkNpldMH"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientTransform="matrix(22.25952 111.2061 -458.39518 91.75449 -42.881 18.441)"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#3771c8" />
                        <stop offset=".128" stopColor="#3771c8" />
                        <stop offset="1" stopColor="#60f" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </g>
                </svg>
              </span>
            </button>
            <button className="w-14 h-10 flex items-center justify-center bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <span className="text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  viewBox="0 0 128 128"
                >
                  <path d="M75.916 54.2L122.542 0h-11.05L71.008 47.06L38.672 0H1.376l48.898 71.164L1.376 128h11.05L55.18 78.303L89.328 128h37.296L75.913 54.2ZM60.782 71.79l-4.955-7.086l-39.42-56.386h16.972L65.19 53.824l4.954 7.086l41.353 59.15h-16.97L60.782 71.793Z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;