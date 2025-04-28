import mongoose, { Schema } from 'mongoose';

const AppointmentSchema = new Schema({
  appointmentId: { type: String, required: true, unique: true }, 
  clientName: { type: String, required: true }, 
  specialty: { type: String, required: true }, 
  dateTime: { type: Date, required: true },
  status: { type: String, enum: ['SCHEDULED', 'CANCELLED', 'WAITING FOR ANSWER'], default:"WAITING FOR ANSWER" }, 
}, { timestamps: true });

export const Appointment = mongoose.model('Appointment', AppointmentSchema);
