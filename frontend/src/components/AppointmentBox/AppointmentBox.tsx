import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import socket from "../../hook/socket";
import Input from "../Inputs/Input";
import Calendar from "../Calendar/Calendar";
import Schedule from "../Buttons/Schedule";
import TimeSelector from "../Timer/TimeSelector";

type NotificationType = {
  id: number;
  status: "pending" | "confirmed" | "canceled";
  message: string;
};

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

  const Notification = ({
    status,
    message,
    onClose,
  }: {
    status: string;
    message: string;
    onClose: () => void;
  }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }, [onClose]);

    const getStatusStyles = () => {
      switch (status) {
        case "pending":
          return "bg-gray-200 text-gray-800";
        case "confirmed":
          return "bg-green-100 text-green-800";
        case "canceled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-200 text-gray-800";
      }
    };

    const getStatusIcon = () => {
      switch (status) {
        case "pending":
          return (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            </div>
          );
        case "confirmed":
          return (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          );
        case "canceled":
          return (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          );
        default:
          return null;
      }
    };

    if (!isVisible) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`p-4 rounded-lg shadow-lg flex items-start ${getStatusStyles()}`}
      >
        <div className="mr-2 mt-0.5">{getStatusIcon()}</div>
        <div>
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="ml-4 text-current hover:opacity-70"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center">
      {/* Container de notificações */}
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
