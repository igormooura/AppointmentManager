// src/components/UserBox.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AppointmentTable } from "../Tables/AppointmentTable";
import { Appointment } from "@/types/appointment";
import useAuth from "@/hook/useAuth";



const UserBox = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState({ fetch: false, updateId: "" });
  const [error, setError] = useState("");
  const { userInfo, logout, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!userInfo?.email) return;

    const fetchAppointments = async () => {
      setLoading((prev) => ({ ...prev, fetch: true }));
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get<Appointment[]>(
          `http://localhost:3000/appointment/${userInfo.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppointments(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch appointments");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error while fetching appointments.");
        }
      } finally {
        setLoading((prev) => ({ ...prev, fetch: false }));
      }
    };

    fetchAppointments();
  }, [userInfo]);

  const formatDateTime = (dateStr: string, hourStr: string) => {
    const [hours, minutes] = hourStr.split(":").map(Number);
    const date = new Date(dateStr);
    date.setHours(hours, minutes, 0, 0);
    return {
      date: date.toLocaleDateString("pt-BR"),
      time: date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex justify-center items-start py-10">
      <motion.div
        className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Appointments</h2>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <AppointmentTable
          appointments={appointments}
          loading={loading}
          updateStatus={() => {}}
          formatDateTime={formatDateTime}
          showActions={false}
        />
      </motion.div>
    </div>
  );
};

export default UserBox;