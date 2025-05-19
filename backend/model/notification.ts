import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema({
  name: { type: String, required: true },
  lastName: {type: String, required: true},
  message: { type: String, required: true },
  read: { type: Boolean, default: false }, 
}, { timestamps: true });

export const Notification = mongoose.model('Notification', NotificationSchema);
