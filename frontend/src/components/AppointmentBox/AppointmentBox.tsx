import React from "react";
import { Calendar } from "@/components/ui/calendar";

const AppointmentBox = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [form, setForm] = React.useState({
    clientName: "",
    specialty: "",
  });

  const handleSubmit = () => {
    console.log({
      ...form,
      date: date?.toISOString(),
    });
  };

  return (
    <div className="w-full mx-auto px-4 py-6 flex justify-center bg-[#FAF9F6]">
      <div className="bg-white h-[600px] p-6 rounded-lg shadow-md w-full max-w-4xl flex flex-col sm:flex-row gap-8">
        <div className="w-full sm:w-1/2 space-y-4  flex flex-col justify-center items-start ">
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
            <input
              type="text"
              value={form.specialty}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, specialty: e.target.value }))
              }
              className="w-full px-16 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="hidden sm:block w-px bg-gray-300" />

        <div className="w-full sm:w-1/2 flex flex-col justify-center items-center space-y-4">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBox;
