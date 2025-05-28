import axios from "axios";

interface ScheduleProps {
  name: string;
  lastName: string;
  email: string;
  specialty: string;
  selectedDate: Date;
  selectedTime: string;
}

const Schedule = ({
  name,
  lastName,
  email,
  specialty,
  selectedDate,
  selectedTime,
}: ScheduleProps) => {
  const handleSchedule = async () => {
    

    
    const fullDateTime = `${selectedDate.toISOString().split("T")[0]}T${selectedTime}:00`;

    const appointmentData = {
      name,
      lastName,
      email,
      specialty,
      dateTime: fullDateTime,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/createAppointment",
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
