import { useState } from "react";
import Calendar from "../Calendar/Calendar";

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
    dateTime: "",
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSubmit = () => {
    console.log({
      ...form,
      date: selectedDate.toISOString(),
    });
  };

  return (
    <div className="w-full mx-auto px-4 py-6 flex justify-center bg-[#FAF9F6]">
      <div className="bg-white h-[600px] p-6 rounded-lg shadow-md w-full max-w-4xl flex flex-col md:flex-row gap-8">
        <div className="w-full sm:w-1/2 space-y-4 flex flex-col justify-center items-start">
          <div>
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

          <div>
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
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horário
            </label>
            <input
              type="text"
              value={form.dateTime}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dateTime: e.target.value }))
              }
              className="w-full px-16 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="hidden md:block w-px bg-gray-300" />

        <div className="w-full md:w-1/2 flex flex-col justify-center items-center space-y-4">
          <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Agendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBox;