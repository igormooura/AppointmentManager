// AppointmentBox.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import DateBox from "./DateBox";

const AppointmentBox = () => {
  const specialties = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Psychiatry",
    "Radiology",
  ];

  const [form, setForm] = useState({
    clientName: "",
    specialty: "",
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSubmit = () => {
    if (form.clientName && form.specialty) {
      setIsFormSubmitted(true);
    } else {
      alert("Please complete all fields.");
    }
  };

  return (
    <div className="w-full mx-auto px-4 py-6 flex justify-center bg-[#FAF9F6]">
      <motion.div
        className="bg-white h-[600px] p-6 rounded-lg shadow-md w-full max-w-4xl flex flex-col justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {!isFormSubmitted ? (
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center h-full">
            <div className="w-full md:w-1/2 space-y-4 flex flex-col items-center">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.clientName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, clientName: e.target.value }))
                  }
                  className="w-full px-16 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty
                </label>
                <select
                  value={form.specialty}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, specialty: e.target.value }))
                  }
                  className="w-full px-16 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a specialty</option>
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <DateBox
            clientName={form.clientName}
            specialty={form.specialty}
            onBack={() => setIsFormSubmitted(false)}
          />
        )}

        {!isFormSubmitted && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AppointmentBox;
