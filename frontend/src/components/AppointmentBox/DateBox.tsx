import { motion } from "framer-motion";
import { useState } from "react";
import Calendar from "../Calendar/Calendar";
import axios from "axios";

type DateTypeProps = {
    onBack: () => void;
    clientName: string;
    specialty: string;
  };
  

const mockAvailabilityData = [
  {
    date: "2025-05-12",
    availableSlots: ["09:00", "09:30", "10:00", "14:00", "14:30"],
  },
  {
    date: "2025-05-13",
    availableSlots: ["08:00", "08:30", "13:00", "13:30"],
  },
];

const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let h = 7; h < 18; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
};

const DateBox = ({  onBack,  clientName, specialty }: DateTypeProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const timeSlots = generateTimeSlots();
  const selectedDateString = selectedDate.toISOString().split("T")[0];
  const availableSlots =
    mockAvailabilityData.find((entry) => entry.date === selectedDateString)
      ?.availableSlots || [];

  const handleTimeClick = (slot: string, isAvailable: boolean) => {
    if (!isAvailable) return;
    setSelectedTime(slot);
    setError(""); 
  };

  const handleSubmit = async () => {
    if (!selectedTime) {
      setError("Please select a time slot");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
        await axios.post("http://localhost:3000/createAppointment", {
            clientName,
            specialty,
            dateTime: `${selectedDateString}T${selectedTime}:00`,
          });
          
    } catch (err) {
      console.error("Error submitting appointment:", err);
      setError("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full h-full flex-col items-center mx-auto"
    >
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6">
        <Calendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="w-full flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium mb-4">
            Available Time Slots for {selectedDate.toLocaleDateString()}
          </h3>

          {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[250px] overflow-y-auto p-2 w-full">
            {timeSlots.map((slot) => {
              const isAvailable = availableSlots.includes(slot);
              const isSelected = selectedTime === slot;

              return (
                <button
                  key={slot}
                  onClick={() => handleTimeClick(slot, isAvailable)}
                  disabled={!isAvailable}
                  aria-label={`${slot} ${isAvailable ? "available" : "unavailable"}`}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition
                    ${isAvailable ? "bg-cyan-500 text-white hover:bg-cyan-600" : "bg-gray-200 text-gray-500 cursor-not-allowed"}
                    ${isSelected && isAvailable ? "ring-2 ring-cyan-700 bg-cyan-600" : ""}
                    focus:outline-none focus:ring-2 focus:ring-cyan-500
                  `}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8 w-full">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition disabled:opacity-50"
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          disabled={!selectedTime || isSubmitting}
          aria-busy={isSubmitting}
          className={`px-6 py-2 rounded-md font-medium transition
            ${selectedTime && !isSubmitting
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
            disabled:opacity-50
          `}
        >
          {isSubmitting ? "Sending..." : "Confirm"}
        </button>
      </div>
    </motion.div>
  );
};

export default DateBox;
