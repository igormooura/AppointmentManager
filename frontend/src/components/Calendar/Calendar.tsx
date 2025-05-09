import { useState } from "react";

function Calendar({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}) {
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

  return (
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
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const isSelected =
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear;

          const today = new Date();
          const isToday =
            today.getDate() === day &&
            today.getMonth() === currentMonth &&
            today.getFullYear() === currentYear;

          return (
            <div
              key={day}
              onClick={() => handleDateClick(day)}
              className={`cursor-pointer p-2 rounded-md text-center 
        ${isSelected ? "bg-blue-600 text-white" : ""}
        ${isToday && !isSelected ? "border border-blue-500" : ""}
        ${!isSelected && !isToday ? "hover:bg-blue-100" : ""}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
