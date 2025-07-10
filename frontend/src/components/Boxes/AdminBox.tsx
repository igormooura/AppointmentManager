import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import socket from "../../hook/socket";
import { Appointment } from "@/types/appointment";
import { AppointmentTable } from "../Tables/AppointmentTable";

const AdminBox = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState({ fetch: false, updateId: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setSuccessWithTimeout = useCallback((message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading((prev) => ({ ...prev, fetch: true }));
      setError("");

      try {
        const res = await axios.get("http://localhost:3000/all-appointments");
        setAppointments(res.data.appointments);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          console.error("Fetch error:", err.message);
        } else {
          setError("Unknown error occurred while fetching appointments.");
        }
      } finally {
        setLoading((prev) => ({ ...prev, fetch: false }));
      }
    };

    fetchAppointments();

    const onUpdated = (updatedAppt: Appointment) => {
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === updatedAppt._id ? updatedAppt : appt))
      );
      setSuccessWithTimeout(`Appointment ${updatedAppt.status}`);
    };

    const onCreated = (newAppt: Appointment) => {
      setAppointments((prev) => [...prev, newAppt]);
      setSuccessWithTimeout("New appointment added!");
    };

    socket.on("appointment.updated", onUpdated);
    socket.on("appointment.created", onCreated);

    return () => {
      socket.off("appointment.updated", onUpdated);
      socket.off("appointment.created", onCreated);
    };
  }, [setSuccessWithTimeout]);

  const updateStatus = async (
    _id: string,
    status: "confirmed" | "canceled"
  ) => {
    if (!_id) {
      setError("Invalid appointment ID");
      return;
    }

    setLoading((prev) => ({ ...prev, updateId: _id }));
    setError("");
    setSuccess("");

    // Otimistic update
    setAppointments((prev) =>
      prev.map((appt) => (appt._id === _id ? { ...appt, status } : appt))
    );

    try {
      const res = await axios.put(
        `http://localhost:3000/update-appointment/${encodeURIComponent(_id)}`,
        { status },
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Update failed");
      }

      socket.emit("admin.update", { _id, status });
    } catch (err: unknown) {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === _id ? { ...appt, status: "pending" } : appt
        )
      );

      if (err instanceof Error) {
        setError(err.message);
        console.error("Update error:", err.message);
      } else {
        setError("Unknown error occurred while updating appointment.");
      }
    } finally {
      setLoading((prev) => ({ ...prev, updateId: "" }));
    }
  };

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

  const isRecent = (dateStr: string) => {
    const apptDate = new Date(dateStr);
    const today = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);
    return apptDate >= threeDaysAgo;
  };

  const filteredAppointments = appointments.filter((appt) =>
    isRecent(appt.date)
  );

  return (
    <div className="mx-auto flex justify-center items-start min-h-screen py-8">
      <motion.div
        className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Manage Appointments
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {loading.fetch ? (
          <div className="text-center p-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No appointments found
          </div>
        ) : (
          <AppointmentTable
            appointments={filteredAppointments}
            loading={loading}
            updateStatus={updateStatus}
            formatDateTime={formatDateTime}
            showActions={true}
          />
        )}
      </motion.div>
    </div>
  );
};

export default AdminBox;
