import { Notification } from "../model/notification";

export const handleNotification = async (notification: any) => {
    const { type, message, appointmentId, clientName, specialty, dateTime } = notification;

    let finalMessage = "";

    switch (type) {
        case 'APPOINTMENT_SCHEDULED':
            finalMessage = `${clientName}, your ${specialty} appointment has been scheduled for ${dateTime}.`;
            break;

        case 'APPOINTMENT_CANCELLED':
            finalMessage = `${clientName}, your appointment was cancelled: ${message}`;
            break;

        case 'APPOINTMENT_REMINDER':
            finalMessage = `${clientName}, reminder: ${message}`;
            break;

        default:
            finalMessage = `Unknown notification type: ${type}`;
    }

    try {
        await Notification.create({
            clientName,
            message: finalMessage
        });
    } catch (err) {
        console.error("Failed to save notification to database:", err);
    }
};
