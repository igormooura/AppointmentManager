import { useState } from "react";

const TimeSelector = () => {
  const [selectedTime, setSelectedTime] = useState("");
  const availableTimes = [
    ["08:00", "09:00", "10:00", "11:00"],
    ["12:00", "13:00", "14:00", "15:00"],
    ["16:00", "17:00", "18:00", "19:00"],
  ];

  return (
    <div className="mt-8 w-full">
      <h1 className="text-lg text-center mb-4 font-bold">Available Times</h1>
      <div className="grid grid-cols-4 gap-2">
        {availableTimes.flat().map((time) => ( //flat just for array tests
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`px-3 py-2 rounded-lg ${
              selectedTime === time
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSelector;