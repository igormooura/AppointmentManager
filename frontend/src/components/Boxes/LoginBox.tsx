import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Input from "../Inputs/Input";

const LoginBox = () => {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSendCode = async () => {
    setError("");
    if (!email) return setError("Please enter your e-mail.");
    try {
      setLoading(true);
      await axios.post("http://localhost:3000/sendcode", { email });
      setStep("code");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to request code.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError("");
    if (!code) return setError("Please enter the code.");
    try {
      setLoading(true);
      const { data } = await axios.post("http://localhost:3000/login", { email, code });
      if (data?.authenticated) {
        navigate("/user");
      } else {
        setError("Invalid code.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center">
      <motion.div
        className="relative w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-4 z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {step === "email" && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-2">
              Enter your e-mail
            </h2>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="btn-primary mt-4"
              disabled={loading}
              onClick={handleSendCode}
            >
              {loading ? "Sending..." : "Send code"}
            </button>
          </>
        )}

        {step === "code" && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-2">
              Enter the code sent to {email}
            </h2>
            <Input
              placeholder="6-digit code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
      
            />
            <button
              className="btn-primary mt-4"
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
            <button
              className="text-sm text-blue-500 underline mt-2"
              disabled={loading}
              onClick={handleSendCode}
            >
              Resend code
            </button>
          </>
        )}

        {error && (
          <p className="text-center text-red-600 mt-2">{error}</p>
        )}
      </motion.div>
    </div>
  );
};

export default LoginBox;
