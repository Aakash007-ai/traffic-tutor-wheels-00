import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { isLoggedIn } from "@/utils/auth";

export default function UserAuth() {
  const [phone, setPhone] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Check if user is already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/quiz");
    }
  }, [navigate]);

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update the OTP value at the specified index
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(0, 1); // Only take the first character
    setOtpValues(newOtpValues);

    // Auto-focus next input if current input is filled
    if (value && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  // Handle backspace key in OTP inputs
  const handleKeyDown = (index, e) => {
    // If backspace is pressed and current field is empty, focus previous field
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  // Handle paste event for OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Check if pasted data is a number and has a reasonable length
    if (!/^\d+$/.test(pastedData)) return;

    // Fill in the OTP fields with the pasted data
    const newOtpValues = [...otpValues];
    for (let i = 0; i < Math.min(pastedData.length, 4); i++) {
      newOtpValues[i] = pastedData[i];
    }
    setOtpValues(newOtpValues);

    // Focus the appropriate field
    if (pastedData.length < 4) {
      otpRefs[pastedData.length].current.focus();
    }
  };

  const sendOtp = async (isResend = false) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://cosmonaut.qac24svc.dev/api/v1/otp/send",
        {
          method: "POST",
          headers: {
            "x-channel-name": "driving-school-web",
            client_id: "driving-school-web",
            client_secret: "AM0Bt2qY7Zqx69RQkxQrAdLXLdrdbjq6",
            "x-active-profile": "DSM",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobileNumber: phone }),
        }
      );
      if (!response.ok) throw new Error("Failed to send OTP");

      if (!isResend) {
        setStep(2);
      } else {
        // Reset OTP values when resending
        setOtpValues(["", "", "", ""]);
        // Focus on the first OTP input
        setTimeout(() => {
          if (otpRefs[0].current) {
            otpRefs[0].current.focus();
          }
        }, 100);
      }

      // Start cooldown timer for resend button (30 seconds)
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");

    // Combine the OTP values into a single string
    const otpString = otpValues.join("");

    // Validate OTP
    if (otpString.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://cosmonaut.qac24svc.dev/api/v1/otp/verify",
        {
          method: "POST",
          headers: {
            "x-channel-name": "driving-school-web",
            client_id: "driving-school-web",
            client_secret: "AM0Bt2qY7Zqx69RQkxQrAdLXLdrdbjq6",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobileNumber: phone, otp: otpString }),
        }
      );
      if (!response.ok) throw new Error("Invalid OTP");
      const data = await response.json();
      console.log("data", data);
      document.cookie = `accessToken=${
        data?.data?.accessToken
      }; path=/; max-age=${7 * 24 * 60 * 60}`;

      navigate("/quiz");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-full font-nunito relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-[#0f172a] z-0">
        {/* SVG background from hero section */}
        <svg
          className="w-full h-full opacity-20"
          viewBox="0 0 500 300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="500" height="300" fill="#fff" rx="10" ry="10" />

          {/* Background */}
          <rect width="500" height="220" fill="#e0f2fe" />
          <rect y="220" width="500" height="80" fill="#84cc16" />

          {/* Road */}
          <rect y="190" width="500" height="60" fill="#4b5563" />
          <rect x="20" y="218" width="40" height="5" fill="#fff" />
          <rect x="90" y="218" width="40" height="5" fill="#fff" />
          <rect x="160" y="218" width="40" height="5" fill="#fff" />
          <rect x="230" y="218" width="40" height="5" fill="#fff" />
          <rect x="300" y="218" width="40" height="5" fill="#fff" />
          <rect x="370" y="218" width="40" height="5" fill="#fff" />
          <rect x="440" y="218" width="40" height="5" fill="#fff" />

          {/* Traffic lights */}
          <rect
            x="120"
            y="130"
            width="30"
            height="60"
            fill="#1e293b"
            rx="5"
            ry="5"
          />
          <circle cx="135" cy="145" r="8" fill="#ef4444" />
          <circle cx="135" cy="165" r="8" fill="#22c55e" />

          {/* Car */}
          <rect
            x="180"
            y="200"
            width="70"
            height="25"
            fill="#3b82f6"
            rx="5"
            ry="5"
          />
          <rect
            x="190"
            y="185"
            width="50"
            height="20"
            fill="#60a5fa"
            rx="3"
            ry="3"
          />
          <circle cx="195" cy="225" r="8" fill="#1e293b" />
          <circle cx="235" cy="225" r="8" fill="#1e293b" />

          {/* People */}
          <circle cx="290" cy="170" r="18" fill="#f8fafc" />
          <rect
            x="280"
            y="188"
            width="20"
            height="35"
            fill="#3b82f6"
            rx="2"
            ry="2"
          />
          <line
            x1="280"
            y1="195"
            x2="265"
            y2="215"
            stroke="#f8fafc"
            strokeWidth="3"
          />
          <line
            x1="300"
            y1="195"
            x2="315"
            y2="215"
            stroke="#f8fafc"
            strokeWidth="3"
          />

          {/* Road signs */}
          <polygon points="400,160 415,185 385,185" fill="#eab308" />
          <circle cx="450" cy="160" r="15" fill="#ef4444" />
          <text
            x="450"
            y="165"
            fontSize="15"
            textAnchor="middle"
            fill="#fff"
            fontWeight="bold"
          >
            STOP
          </text>
        </svg>
      </div>

      {/* Home button */}
      <div className="px-6 pt-1 z-40 absolute w-full">
        <div className="flex justify-end pt-4">
          <Link
            to="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full font-bold text-sm transition-all transform hover:scale-105 inline-flex items-center justify-center shadow-lg"
          >
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-full px-4 relative z-10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-fredoka mb-4 text-white">
            Welcome to <span className="text-[#22c55e]">Safeway</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-md mx-auto">
            Sign in to track your progress and continue your road safety journey
          </p>
        </motion.div>

        <motion.div
          className="glass-card p-6 md:p-10 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Step indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700">
            <div className="h-full bg-[#22c55e] transition-all duration-500"></div>
          </div>

          <h2 className="text-2xl font-fredoka text-center mb-2 text-white">
            {step === 1 ? "Login with Phone" : "Verify OTP"}
          </h2>
          <p className="text-gray-300 text-center mb-6 text-sm">
            {step === 1
              ? "Enter your phone number to receive a verification code"
              : "Enter the verification code sent to your phone"}
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-6">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <>
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="glass-input w-full py-3 md:py-4 pl-12 rounded-lg text-white bg-white/5 border-white/10 focus:border-blue-500/50 placeholder-white/50"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    sendOtp(false);
                  }}
                  disabled={loading}
                  className="w-full mt-4 bg-[#22c55e] hover:bg-green-600 text-white py-3 md:py-4 rounded-full font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Verification Code{" "}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-4">
                  <div
                    className="flex justify-center gap-3"
                    onPaste={handlePaste}
                  >
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        maxLength={1}
                        value={otpValues[index]}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        aria-label={`OTP digit ${index + 1}`}
                        placeholder="•"
                        className="glass-input w-12 h-14 text-center text-xl font-bold rounded-lg text-white bg-white/5 border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30"
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={verifyOtp}
                  disabled={loading || otpValues.join("").length !== 4}
                  className="w-full mt-4 bg-[#22c55e] hover:bg-green-600 text-white py-3 md:py-4 rounded-full font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
                >
                  {loading ? (
                    "Verifying..."
                  ) : (
                    <>
                      Verify & Continue <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      sendOtp(true);
                    }}
                    disabled={loading || resendCooldown > 0}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    {resendCooldown > 0
                      ? `Resend OTP in ${resendCooldown}s`
                      : "Resend OTP"}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
