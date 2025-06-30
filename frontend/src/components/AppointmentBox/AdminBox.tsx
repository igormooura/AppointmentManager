import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import socket from "../../hook/socket";

interface Appointment {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  specialty: string;
  date: string;
  hour: string;
  status: "pending" | "confirmed" | "canceled";
}

const AdminBox = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState({ fetch: false, updateId: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading((prev) => ({ ...prev, fetch: true }));
      setError("");
      try {
        const res = await axios.get("http://localhost:3000/all-appointments");
        setAppointments(res.data.appointments);
      } catch (err) {
        setError("Failed to load appointments. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, fetch: false }));
      }
    };

    fetchAppointments();

    socket.on("appointment.updated", (updatedAppt: Appointment) => {
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === updatedAppt._id ? updatedAppt : appt))
      );
      setSuccess(`Appointment ${updatedAppt.status}`);
      setTimeout(() => setSuccess(""), 3000);
    });

    socket.on("appointment.created", (newAppt: Appointment) => {
      setAppointments((prev) => [...prev, newAppt]);
      setSuccess("New appointment added!");
      setTimeout(() => setSuccess(""), 3000);
    });

    return () => {
      socket.off("appointment.updated");
      socket.off("appointment.created");
    };
  }, []);

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
        throw new Error(res.data.message || "Update failed");
      }

      socket.emit("admin.update", { _id, status });
    } catch (err: any) {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === _id ? { ...appt, status: "pending" } : appt
        )
      );
      setError(err.response?.data?.message || err.message);
      console.error("Update error:", err);
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

  const isAppointmentWithinLast3Days = (dateStr: string) => {
    const apptDate = new Date(dateStr);
    const today = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 3);
    return apptDate >= fiveDaysAgo;
  };

  const filteredAppointments = appointments.filter((appt) =>
    isAppointmentWithinLast3Days(appt.date)
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
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>
        )}

        {loading.fetch ? (
          <div className="text-center p-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center p-8 text-gray-500">No appointments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="p-3 border-b">Patient</th>
                  <th className="p-3 border-b">Contact</th>
                  <th className="p-3 border-b">Specialty</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Time</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt) => {
                  const { date, time } = formatDateTime(appt.date, appt.hour);
                  const isUpdating = loading.updateId === appt._id;
                  return (
                    <tr
                      key={appt._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3">
                        <div className="font-medium">
                          {appt.name} {appt.lastName}
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{appt.email}</td>
                      <td className="p-3 capitalize">{appt.specialty}</td>
                      <td className="p-3">{date}</td>
                      <td className="p-3">{time}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            appt.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appt.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className="p-3 space-x-2">
                        <button
                          disabled={isUpdating || appt.status === "confirmed"}
                          onClick={() => updateStatus(appt._id, "confirmed")}
                          className={`px-4 py-2 rounded-md text-white font-medium transition-colors duration-300 ${
                            appt.status === "confirmed"
                              ? "bg-gray-300 cursor-not-allowed"
                              : isUpdating
                              ? "bg-green-700 cursor-wait opacity-70"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {isUpdating ? (
                            <svg
                              className="animate-spin h-5 w-5 mx-auto text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            "Confirm"
                          )}
                        </button>
                        <button
                          disabled={isUpdating || appt.status === "canceled"}
                          onClick={() => updateStatus(appt._id, "canceled")}
                          className={`px-4 py-2 rounded-md text-white font-medium transition-colors duration-300 ${
                            appt.status === "canceled"
                              ? "bg-gray-300 cursor-not-allowed"
                              : isUpdating
                              ? "bg-red-700 cursor-wait opacity-70"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          {isUpdating ? (
                            <svg
                              className="animate-spin h-5 w-5 mx-auto text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            "Cancel"
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminBox;
