import Header from "@/components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
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
      setStep(2);
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");
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
          body: JSON.stringify({ mobileNumber: phone, otp: otp }),
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
    <div className="min-h-screen w-full bg-background pt-20 pb-16">
      <Header />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-xl font-semibold text-center mb-4">
            {step === 1 ? "Enter Phone Number" : "Enter OTP"}
          </h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {step === 1 ? (
            <>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
