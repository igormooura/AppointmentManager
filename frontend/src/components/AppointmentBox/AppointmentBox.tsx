import { motion } from "framer-motion";
import { useState } from "react";
import Input from "../Inputs/input";

const AppointmentBox = () => {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");

  const specialtyOptions = [
    { value: "cardiology", label: "Cardiology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "orthopedics", label: "Orthopedics" },

  ];

  return (
    <div className=" mx-auto flex justify-center items-center min-h-screen">
      <motion.div
        className=" relative w-7xl h-[600px] bg-white shadow-xl rounded-2xl p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="m-4 flex flex-col gap-4 items-start">
        <Input
          placeholder="Your name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="select"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          placeholder="Select a specialty"
          options={specialtyOptions}
        />
        </div>
    
   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[60%] w-px bg-gray-300"/>

      </motion.div>
    </div>
  );
};

export default AppointmentBox;