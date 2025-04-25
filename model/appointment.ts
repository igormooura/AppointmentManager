import mongoose, { Schema } from 'mongoose';

const AppointmentSchema = new Schema({
  userId: { type: String, required: true },
  dateTime: { type: Date, required: true },
  status: { type: String, enum: ['SCHEDULED', 'CANCELLED'], default: 'SCHEDULED' },
}, { timestamps: true });

export const Appointment = mongoose.model('Appointment', AppointmentSchema);
