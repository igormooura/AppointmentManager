import Notification from "../model/notification";
import { getIO } from "../config/socket";
import { INotification, IAppointment } from "../interfaces/interface";

export const createNotification = async (appointment: IAppointment): Promise<INotification> => {
  const message = getStatusMessage(appointment.status, appointment.date, appointment.hour);
  
  const notification = await Notification.create({
    appointmentId: appointment._id,
    userEmail: appointment.email,
    message,
    status: appointment.status,
    read: false
  });

  getIO().emit("appointmentStatusUpdate", {
    message: notification.message,
    status: notification.status
  });

  return {
    _id: notification._id.toString(),
    appointmentId: notification.appointmentId.toString(),
    userEmail: notification.userEmail,
    message: notification.message,
    status: notification.status,
    read: notification.read,
    createdAt: notification.createdAt?.toISOString()
  };
};

const getStatusMessage = (status: string, date: Date, hour: string): string => {
    switch (status) {
        case "waiting for confirmation":
            return `Your appointment on ${date.toLocaleDateString()} at ${hour} is awaiting confirmation.`;
        case "confirmed":
            return `Your appointment on ${date.toLocaleDateString()} at ${hour} has been confirmed.`;
        case "canceled":
            return `Your appointment on ${date.toLocaleDateString()} at ${hour} has been canceled. Please contact support if needed.`;
        default:
            return `Your appointment on ${date.toLocaleDateString()} at ${hour} has been updated.`;
    }
};