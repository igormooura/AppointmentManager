import React from "react";
import { useState } from "react";

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
  const [viewDate, setViewDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  const handleMonthChange = (offset: number) => {
    setViewDate(new Date(currentYear, currentMonth + offset, 1));
  };

  const handleYearChange = (offset: number) => {
    setViewDate(new Date(currentYear + offset, currentMonth, 1));
  };

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
          <div className="w-full text-center">
            <div className="flex justify-between mb-2">
              <button
                onClick={() => handleYearChange(-1)}
                className="text-gray-600 hover:text-black"
              >
                «
              </button>
              <button
                onClick={() => handleMonthChange(-1)}
                className="text-gray-600 hover:text-black"
              >
                ‹
              </button>
              <div className="font-semibold">
                {months[currentMonth]} {currentYear}
              </div>
              <button
                onClick={() => handleMonthChange(1)}
                className="text-gray-600 hover:text-black"
              >
                ›
              </button>
              <button
                onClick={() => handleYearChange(1)}
                className="text-gray-600 hover:text-black"
              >
                »
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-sm mb-1">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-gray-500 font-medium">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-sm">
              {Array(firstDay)
                .fill("")
                .map((_, i) => (
                  <div key={"empty-" + i}></div>
                ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                (day) => {
                  const isSelected =
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === currentMonth &&
                    selectedDate.getFullYear() === currentYear;
                  return (
                    <div
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`cursor-pointer p-2 rounded-md text-center 
                      ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-100"
                      }`}
                    >
                      {day}
                    </div>
                  );
                }
              )}
            </div>
          </div>

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
