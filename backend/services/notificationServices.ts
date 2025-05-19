import { Notification } from "../model/notification";

export const handleNotification = async (notification: any) => {
  const { type, message, name, lastName, specialty, dateTime } = notification;

  let finalMessage = "";

  switch (type) {
    case 'APPOINTMENT_SCHEDULED':
      finalMessage = `${name} ${lastName}, your ${specialty} appointment has been scheduled for ${dateTime}.`;
      break;
    case 'APPOINTMENT_CANCELLED':
      finalMessage = `${name} ${lastName}, your appointment was cancelled: ${message}`;
      break;
    case 'APPOINTMENT_REMINDER':
      finalMessage = `${name} ${lastName}, reminder: ${message}`;
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

