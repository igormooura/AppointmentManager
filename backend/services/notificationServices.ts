import { Notification } from "../model/notification";

export const handleNotification = async (notification: any) => {
  const { type, message, name, lastName, specialty, dateTime, email, appointmentId
  } = notification;

  let finalMessage = "";

  switch (type) {
    case "APPOINTMENT_SCHEDULED":
      finalMessage = `${name} ${lastName}, your ${specialty} appointment has been scheduled for ${dateTime}.`;
      break;
    case "APPOINTMENT_CANCELLED":
      finalMessage = `${name} ${lastName}, your appointment was cancelled: ${message}`;
      break;
    case "APPOINTMENT_REMINDER":
      finalMessage = `${name} ${lastName}, reminder: ${message}`;
      break;
    case "APPOINTMENT_PENDING":
      finalMessage = `${name} ${lastName}, your ${specialty} appointment request for ${dateTime} is pending admin approval.`;
      break;
    case "APPOINTMENT_REJECTED":
      finalMessage = `${name} ${lastName}, your ${specialty} appointment request for ${dateTime} was rejected: ${message || "No reason provided"}.`;
      break;
    default:
      finalMessage = `Unknown notification type: ${type}`;
  }

  try {
    await Notification.create({
      name,
      lastName,
      email,
      appointmentId,
      message: finalMessage,
      type,
      dateTime: dateTime ? new Date(dateTime) : undefined
    });
  } catch (err) {
    console.error("Failed to save notification to database:", err);
  }
};

