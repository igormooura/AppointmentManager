import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "../Inputs/Input";

const LoginBox = () => {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/sendcode", { email });
      setStep("code");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const { response } = err as AxiosError<{ message?: string }>;

        if (response?.data?.message) setError(response.data.message);
        else if (response?.status === 404) setError("E‑mail not found.");
        else if (response?.status === 500) setError("Server error. Please try again later.");
        else setError("Failed to request the code.");
      } else {
        setError("Unexpected error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError(null);

    if (!code) {
      setError("2FA code is needed");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post("http://localhost:3000/login", {
        email,
        code,
      });

      if (data.authenticated && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        navigate("/user");
      } else {
        setError("Invalid Code");
      }
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step === "email" ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Enter your email
            </h2>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && (
              <div className="text-red-600 text-center mt-5 font-semibold">
                {error}
              </div>
            )}
            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-full bg-blue-300 text-white py-2 rounded mt-7"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Enter the code sent to {email}
            </h2>
            <Input
              type="text"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {error && (
              <div className="text-red-600 text-center font-semibold">
                {error}
              </div>
            )}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-green-700 text-white py-2 rounded mt-3"
            >
              {loading ? "Verifying..." : "Login"}
            </button>

            <button
              onClick={handleSendCode}
              className="w-full font-bold text-blue-950 underline mt-3"
            >
              {loading ? "Sending other code..." : "Resend Code"}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default LoginBox;
