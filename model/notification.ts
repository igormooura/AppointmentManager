import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema({
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export const Notification = mongoose.model('Notification', NotificationSchema);
