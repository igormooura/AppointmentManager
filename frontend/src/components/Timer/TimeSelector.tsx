interface TimeSelectorProps {
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

const TimeSelector = ({ selectedTime, setSelectedTime }: TimeSelectorProps) => {
  const times = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];

  return (
    <div className="mt-4 grid grid-cols-4 gap-2">
      {times.map((time) => (
        <button
          key={time}
          onClick={() => setSelectedTime(time)}
          className={`px-3 py-1 rounded-md ${
            selectedTime === time
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {time}
        </button>
      ))}
    </div>
  );
};

export default TimeSelector;
