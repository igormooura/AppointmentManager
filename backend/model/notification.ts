import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    specialty: { type: String },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    dateTime: { type: Date },
    type: {
      type: String,
      enum: [
        "APPOINTMENT_SCHEDULED",
        "APPOINTMENT_CANCELLED",
        "APPOINTMENT_REMINDER",
        "APPOINTMENT_PENDING",
        "APPOINTMENT_REJECTED",
        "APPOINTMENT_CONFIRMED",
      ],
      required: true,
    },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model("Notification", NotificationSchema);
