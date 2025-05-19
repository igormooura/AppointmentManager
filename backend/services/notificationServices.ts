import { Notification } from "../model/notification";

export const handleNotification = async (notification: any) => {
  const { type, message, appointmentId, name, lastName, specialty, dateTime } = notification;

  let finalMessage = "";

  const fullName = `${name} ${lastName}`;

  switch (type) {
    case 'APPOINTMENT_SCHEDULED':
      finalMessage = `${fullName}, your ${specialty} appointment has been scheduled for ${dateTime}.`;
      break;
    case 'APPOINTMENT_CANCELLED':
      finalMessage = `${fullName}, your appointment was cancelled: ${message}`;
      break;
    case 'APPOINTMENT_REMINDER':
      finalMessage = `${fullName}, reminder: ${message}`;
      break;
    default:
      finalMessage = `Unknown notification type: ${type}`;
  }

  try {
    await Notification.create({
      name,
      lastName,
      message: finalMessage,
    });
  } catch (err) {
    console.error("Failed to save notification to database:", err);
  }
};

