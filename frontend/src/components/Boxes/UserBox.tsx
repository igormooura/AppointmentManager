import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Appointment } from "@/types/appointment";
import { AppointmentTable } from "../Tables/AppointmentTable";
import axios from "axios";

interface UserBoxProps {
  email: string;
}

const UserBox = ({ email }: UserBoxProps) => {
  const [appointmentByUser, setAppointmentByUser] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState({ fetch: false, updateId: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!email) return;
      setLoading((prev) => ({ ...prev, fetch: true }));
      setError("");
      try {
        const response = await axios.get<Appointment[]>(`http://localhost:3000/appointment/${email}`);
        setAppointmentByUser(response.data);
      } catch (error: unknown) {
        if(error instanceof Error){ 
          setError(error.message);
          console.error("Fetch error:", error.message);
        }
      } finally {
        setLoading((prev) => ({ ...prev, fetch: false }));
      }
    };
    fetchAppointment();
  }, [email]);

  const formatDateTime = (dateStr: string, hourStr: string) => {
    const [hours, minutes] = hourStr.split(":").map(Number);
    const date = new Date(dateStr);
    date.setHours(hours, minutes, 0, 0);
    return {
      date: date.toLocaleDateString("en-US"),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="mx-auto flex justify-center items-start min-h-screen py-8">
      <motion.div
        className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Your Appointments
        </h2>

        {loading.fetch && <div className="text-center text-gray-500">Loading...</div>}

        {error && <div className="text-center text-red-500">{error}</div>}

        {!loading.fetch && !error && appointmentByUser.length === 0 && (
          <div className="text-center p-8 text-gray-500">No appointments found</div>
        )}

        {!loading.fetch && !error && appointmentByUser.length > 0 && (
          <AppointmentTable
            appointments={appointmentByUser}
            loading={loading}
            updateStatus={() => {}}
            formatDateTime={formatDateTime}
            showActions={false}
          />
        )}
      </motion.div>
    </div>
  );
};

export default UserBox;
