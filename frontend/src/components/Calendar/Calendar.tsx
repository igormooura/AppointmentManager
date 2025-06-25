import { useState } from "react";

type CalendarProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  unavailableDates?: Date[];
};

function Calendar({ selectedDate, setSelectedDate, unavailableDates = [] }: CalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());

  const maxAdvanceDays = 90; 

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

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isBeyondMaxAdvance = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + maxAdvanceDays);
    maxDate.setHours(23, 59, 59, 999);
    return date > maxDate;
  };

  const isUnavailableDate = (date: Date) => {
    // (saturday = 6, sunday=0)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return true;

    for (const d of unavailableDates) {
      if (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      )
        return true;
    }

    return false;
  };

  const isSelectableDate = (date: Date) => {
    return !isPastDate(date) && !isBeyondMaxAdvance(date) && !isUnavailableDate(date);
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);

    if (!isSelectableDate(newDate)) {
      alert("Data não disponível para agendamento.");
      return;
    }

    setSelectedDate(newDate);
  };

  const handleMonthChange = (offset: number) => {

    const newViewDate = new Date(currentYear, currentMonth + offset, 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setDate(today.getDate() + maxAdvanceDays);
    maxDate.setHours(23, 59, 59, 999);

    if (
      newViewDate.getFullYear() < today.getFullYear() ||
      (newViewDate.getFullYear() === today.getFullYear() &&
        newViewDate.getMonth() < today.getMonth())
    ) {
      return;
    }

    if (
      newViewDate.getFullYear() > maxDate.getFullYear() ||
      (newViewDate.getFullYear() === maxDate.getFullYear() &&
        newViewDate.getMonth() > maxDate.getMonth())
    ) {
      return;
    }

    setViewDate(newViewDate);
  };

  const handleYearChange = (offset: number) => {
    handleMonthChange(offset * 12); 
  };

  return (
    <div className="w-full text-center">
      <div className="flex justify-between mb-2">
        <button
          onClick={() => handleYearChange(-1)}
          className="text-gray-600 hover:text-black"
          aria-label="Ano anterior"
        >
          «
        </button>
        <button
          onClick={() => handleMonthChange(-1)}
          className="text-gray-600 hover:text-black"
          aria-label="Mês anterior"
        >
          ‹
        </button>
        <div className="font-semibold">
          {months[currentMonth]} {currentYear}
        </div>
        <button
          onClick={() => handleMonthChange(1)}
          className="text-gray-600 hover:text-black"
          aria-label="Mês seguinte"
        >
          ›
        </button>
        <button
          onClick={() => handleYearChange(1)}
          className="text-gray-600 hover:text-black"
          aria-label="Ano seguinte"
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
          const currentDate = new Date(currentYear, currentMonth, day);

          const isSelected =
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear;

          const today = new Date();
          const isToday =
            today.getDate() === day &&
            today.getMonth() === currentMonth &&
            today.getFullYear() === currentYear;

          const selectable = isSelectableDate(currentDate);
          const unavailable = isUnavailableDate(currentDate);

          return (
            <div
              key={day}
              onClick={() => selectable && handleDateClick(day)}
              className={`cursor-pointer p-2 rounded-md text-center
                ${isSelected ? "bg-blue-600 text-white" : ""}
                ${isToday && !isSelected ? "border border-blue-500" : ""}
                ${!selectable ? "text-gray-400 cursor-not-allowed" : ""}
                ${unavailable ? "bg-red-200" : ""}
                ${!isSelected && !isToday && selectable ? "hover:bg-blue-100" : ""}
              `}
              title={
                !selectable
                  ? "Data indisponível para agendamento"
                  : unavailable
                  ? "Data já ocupada / feriado / fim de semana"
                  : undefined
              }
              aria-disabled={!selectable}
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
