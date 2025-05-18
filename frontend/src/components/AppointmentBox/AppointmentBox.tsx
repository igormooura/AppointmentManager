import { motion } from "framer-motion";
import { useState } from "react";
import Input from "../Inputs/Input";
import Calendar from "../Calendar/Calendar";
import Schedule from "../Buttons/Schedule";
import TimeSelector from "../TimeAvaliable.tsx/TimeSelector";

const AppointmentBox = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [email, setEmail] = useState("")


  const specialtyOptions = [
    { value: "cardiology", label: "Cardiology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "orthopedics", label: "Orthopedics" },
  ];

  

  return (
    <div className="mx-auto flex justify-center items-center min-h-screen">
      <motion.div
        className="relative w-7xl h-[750px] bg-white shadow-xl rounded-2xl p-8 flex flex-col"
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
            

          <TimeSelector/>

           
          </div>
        </div>

        <Schedule/>
      </motion.div>
    </div>
  );
};

export default AppointmentBox;