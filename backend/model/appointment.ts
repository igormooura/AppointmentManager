import mongoose, { Schema } from "mongoose";

const AppointmentSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    specialty: { type: String, required: true },
    dateTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "REJECTED"],
      default: "PENDING",
    },
    reminderSent: { type: Boolean, default: false },
  }
);

export const Appointment = mongoose.model("Appointment", AppointmentSchema);
