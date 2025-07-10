import { useState } from "react";
import { motion } from "framer-motion";
import { Appointment } from "@/types/appointment";
import { AppointmentTable } from "../Tables/AppointmentTable";

const UserBox = () => {
  const [appointments] = useState<Appointment[]>([
    {
      _id: "1",
      name: "Igor",
      lastName: "Modawdawura",
      email: "igor@example.com",
      specialty: "Cardiology",
      date: "2025-07-15",
      hour: "14:00",
      status: "pending",
    },
  ]);

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

        {appointments.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No appointments found
          </div>
        ) : (
          <AppointmentTable
            appointments={appointments}
            loading={{ fetch: false, updateId: "" }}
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
