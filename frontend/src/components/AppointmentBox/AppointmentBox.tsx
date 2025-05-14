import { motion } from "framer-motion";

const AppointmentBox = () => {
  return (
    <motion.div
      className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
     
    </motion.div>
  );
};

export default AppointmentBox;
