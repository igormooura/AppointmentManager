import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema({
  notificationId: { type: String, required: true, unique: true },
  clientName: { type: String, required: true },
  appointmentId: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }, 
}, { timestamps: true });

export const Notification = mongoose.model('Notification', NotificationSchema);
