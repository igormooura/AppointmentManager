import mongoose, { Schema } from "mongoose";

const AppointmentSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    specialty: { type: String, required: true },
    date: { type: Date, required: true },
    hour: { type: String, required: true },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment;
