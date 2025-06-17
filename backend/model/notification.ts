import mongoose, { Schema } from "mongoose";

const NotificationSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  userEmail: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["waiting for confirmation", "confirmed", "canceled"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
