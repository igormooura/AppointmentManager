import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface Appointment {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  specialty: string;
  dateTime: string;
  status: string;
}

const AdminBox = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/getAllAppointments")
      .then((res) => {
        setAppointments(res.data);
        console.log("response:", res);
      })
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  const updateStatus = async (_id: string, status: string) => {
    try {
      await axios.put(`http://localhost:3000/updateAppointment/${_id}`, {
        status,
      });

      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === _id ? { ...appt, status } : appt
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="mx-auto flex justify-center items-center min-h-screen">
      <motion.div
        className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Manage Appointments</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Specialty</th>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Time</th> 
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{`${appt.name} ${appt.lastName}`}</td>
                <td className="p-3">{appt.email}</td>
                <td className="p-3">{appt.specialty}</td>
                <td className="p-3">
                  {new Date(appt.dateTime).toLocaleDateString("pt-BR")}
                </td>
                <td className="p-3">
                  {new Date(appt.dateTime).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-3">{appt.status}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded"
                    onClick={() => updateStatus(appt._id, "Confirmed")}
                  >
                    Confirm
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => updateStatus(appt._id, "Canceled")}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default AdminBox;
