import axios from "axios";

interface ScheduleProps {
  name: string;
  lastName: string;
  email: string;
  specialty: string;
  selectedDate: Date;
  selectedTime: string;
  validate: () => boolean;
}

const Schedule = ({
  name,
  lastName,
  email,
  specialty,
  selectedDate,
  selectedTime,
  validate,
}: ScheduleProps) => {
  const handleSchedule = async () => {
    if (!validate()) {
      return;
    }

    const fullDateTime = `${selectedDate.toISOString().split("T")[0]}T${selectedTime}:00`;

    const appointmentData = {
      name,
      lastName,
      email,
      specialty,
      date: new Date(fullDateTime),
      hour: selectedTime,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/create-appointment",
        appointmentData
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={handleSchedule}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Schedule Appointment
      </button>
    </div>
  );
};

export default Schedule;
