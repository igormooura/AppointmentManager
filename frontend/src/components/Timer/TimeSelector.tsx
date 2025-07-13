import { useEffect, useState } from "react";
import axios from "axios";

interface TimeSelectorProps {
  selectedDate: Date;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

interface Appointment {
  date: string;
  hour: string;
  status: "confirmed" | "waiting for confirmation" | string;
}

interface ApiResponse {
  appointments: Appointment[];
}

const TimeSelector = ({
  selectedDate,
  selectedTime,
  setSelectedTime,
}: TimeSelectorProps) => {
  const times = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);

  useEffect(() => {
    const fetchOccupiedTimes = async () => {
      try {
        const res = await axios.get<ApiResponse>("http://localhost:3000/all-appointments");
        const selectedDateStr = selectedDate.toISOString().split("T")[0];

        const filtered = res.data.appointments
          .filter((a: Appointment) =>
            a.date.startsWith(selectedDateStr) && 
            (a.status === "confirmed" || a.status === "waiting for confirmation"))
          .map((a: Appointment) => a.hour);

        setOccupiedTimes(filtered);
      } catch (err) {
        console.error("Error fetching occupied times:", err);
      }
    };

    setSelectedTime("");
    fetchOccupiedTimes();
  }, [selectedDate, setSelectedTime]);

  const isToday = () => selectedDate.toDateString() === new Date().toDateString();

  const isAtLeastOneHourAhead = (time: string, date: Date) => {
    const now = new Date();
    const [hour, minute] = time.split(":").map(Number);
    const selectedTimeDate = new Date(date);
    selectedTimeDate.setHours(hour, minute, 0, 0);
    return selectedTimeDate.getTime() >= now.getTime() + 1 * 60 * 60 * 1000;
  };

  return (
    <div className="mt-4 grid grid-cols-4 gap-2">
      {times.map((time) => {
        const isOccupied = occupiedTimes.includes(time);
        const blockedByTime = isToday() && !isAtLeastOneHourAhead(time, selectedDate);
        const disabled = isOccupied || blockedByTime;
        const isSelected = selectedTime === time;

        return (
          <button
            key={time}
            onClick={() => !disabled && setSelectedTime(time)}
            disabled={disabled}
            className={`px-3 py-1 rounded-md transition
              ${isSelected ? "bg-blue-600 text-white" : disabled ? "bg-red-300 text-white cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`}
          >
            {time}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSelector;