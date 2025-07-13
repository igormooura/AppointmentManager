import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Inputs/Input";

const LoginBox = () => {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!email) throw new Error("E-mail is needed");

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/sendcode", {
        email: email,
      });
      setStep("code");
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error(error.message);
      else console.error("Failed to request the code");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!code) throw new Error("2FA code is needed");

    try {
      setLoading(true);

      const { data } = await axios.post("http://localhost:3000/login", {
        email: email,
        code: code,
      });

      if (data.authenticated && data.token) {
        // If the backend confirms the user is authenticated and returns a valid JWT token...
        localStorage.setItem("token", data.token);
        // Store the authentication token in localStorage to keep the user logged in.
        // This token can be used for future requests to protected routes.
        localStorage.setItem("email", email);
        // Store the user's email in localStorage in case it's needed later in the frontend.
        
        navigate("/user");

      } else {
        throw new Error("Invalid Code");
      }
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error(error.message);
      else console.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step === "email" ? (
          <>
            <h2 className=" text-xl font-semibold mb-4 text-center">
              {" "}
              Enter your email
            </h2>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendCode}
              disabled={loading}
              className=" w-full bg-blue-700 text-white py-2 rounded mt-3"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </>
        ) : (
          <>
            <h2 className=" text-xl font-semibold mb-4 text-center">
              {" "}
              Enter the code sent to {email}
            </h2>
            <Input
              type="text"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className=" w-full bg-green-700 text-white py-2 rounded mt-3 "
            >
              {loading ? "Verifying..." : " Login "}
            </button>

            <button
              onClick={handleSendCode}
              className="w-full font-bold text-blue-950 undeline mt-3"
            >
              Resend code
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default LoginBox;
