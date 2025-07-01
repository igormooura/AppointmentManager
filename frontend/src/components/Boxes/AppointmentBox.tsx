import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import socket from "../../hook/socket";
import Input from "../Inputs/Input";
import Calendar from "../Calendar/Calendar";
import Schedule from "../Buttons/Schedule";
import TimeSelector from "../Timer/TimeSelector";
import Notification from "../Notification/Notification";
import { NotificationType } from "@/types/appointment";

const AppointmentBox = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [email, setEmail] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    if (email) {
      socket.emit("joinRoom", email);
    }
  }, [email]);

  const addNotification = (
    status: "pending" | "confirmed" | "canceled",
    message: string
  ) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, status, message }]);
    setTimeout(() => removeNotification(id), 10000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    socket.on("appointment.pending", (data) => {
      if (
        data.name === name &&
        data.lastName === lastName &&
        data.email === email
      ) {
        addNotification(
          "pending",
          "Sua consulta foi enviada e está aguardando confirmação."
        );
      }
    });

    socket.on("appointment.updated", (data) => {
      if (data.status === "confirmed") {
        addNotification("confirmed", "Sua consulta foi confirmada!");
      } else if (data.status === "canceled") {
        addNotification("canceled", "Sua consulta foi cancelada.");
      }
    });

    return () => {
      socket.off("appointment.pending");
      socket.off("appointment.updated");
    };
  }, [name, lastName, email]);

  const specialtyOptions = [
    { value: "cardiology", label: "Cardiology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "orthopedics", label: "Orthopedics" },
  ];

  return (
    <div className="relative min-h-screen flex justify-center items-center">
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            status={notification.status}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      <motion.div
        className="relative w-7xl h-[750px] bg-white shadow-xl rounded-2xl p-8 flex flex-col z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-1">
          <div className="w-1/2 pr-8 flex flex-col justify-center">
            <div className="flex flex-col gap-4 items-start">
              <Input
                placeholder="Your name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="select"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Select a specialty"
                options={specialtyOptions}
              />
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[60%] w-px bg-gray-300" />

          <div className="w-1/2 pl-8 flex flex-col justify-center items-center">
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            <TimeSelector
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
          </div>
        </div>

        <Schedule
          name={name}
          lastName={lastName}
          email={email}
          specialty={specialty}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      </motion.div>
    </div>
  );
};

export default AppointmentBox;