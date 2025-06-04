import { connectToRabbitMQ } from "../config/rabbitmq";
import { getIo } from "../config/socketManager";
import { Appointment } from "../model/appointment";


export const createAppointment = async (
    name: string,
    lastName: string,
    email: string,
    specialty: string,
    dateTime: string
) => {
    const existingAppointment = await Appointment.findOne({ dateTime });
    if (existingAppointment) throw new Error("Time slot already booked");

    const newAppointment = new Appointment({
        name,
        lastName,
        email,
        specialty,
        dateTime: new Date(dateTime),
        status: "PENDING",
    });

    await newAppointment.save();

    try {
        const { channel } = await connectToRabbitMQ();
        
        channel.sendToQueue(
            'notifications',
            Buffer.from(JSON.stringify({
                type: 'APPOINTMENT_SCHEDULED',
                id: newAppointment._id,
                name,
                lastName,
                email,
                specialty,
                dateTime,
                socketRoom: email
            })),
            { persistent: true }
        );

        const io = getIo();
        if (io) {
            io.to(email).emit("appointment_status", {
                message: "Your appointment has been scheduled and is awaiting approval.",
                appointmentId: newAppointment._id,
                status: "PENDING",
            });
        }
    } catch (error) {
        console.error("Failed to send to queue:", error);
    }

    return newAppointment;
};

export const cancelAppointment = async (_id: string) => {
    const deletedAppointment = await Appointment.findOneAndDelete({ _id });
    if (!deletedAppointment) throw new Error("Appointment not found or already canceled");

    try {
        const { channel } = await connectToRabbitMQ();
        channel.sendToQueue(
            'notifications',
            Buffer.from(JSON.stringify({
                type: 'APPOINTMENT_CANCELLED',
                message: `Your appointment on ${deletedAppointment.dateTime} was cancelled.`,
                appointmentId: deletedAppointment._id,
                name: deletedAppointment.name,
                lastName: deletedAppointment.lastName,
                email: deletedAppointment.email
            })),
            { persistent: true }
        );
    } catch (error) {
        console.error(error);
    }

    return deletedAppointment;
};

export const appointmentReminder = async () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    try {
        const upcomingAppointments = await Appointment.find({
            dateTime: { $gte: now, $lt: oneHourLater },
            reminderSent: false
        });

        if (upcomingAppointments.length === 0) return;

        const { channel } = await connectToRabbitMQ();

        for (const appointment of upcomingAppointments) {
            channel.sendToQueue(
                'notifications',
                Buffer.from(JSON.stringify({
                    type: 'APPOINTMENT_REMINDER',
                    message: `You have a ${appointment.specialty} appointment at ${appointment.dateTime}`,
                    appointmentId: appointment._id,
                    name: appointment.name,
                    lastName: appointment.lastName,
                    email: appointment.email
                })),
                { persistent: true }
            );

            await Appointment.updateOne({ _id: appointment._id }, { $set: { reminderSent: true } });
        }

        console.log(`[REMINDER] ${upcomingAppointments.length} notifications sent.`);
    } catch (error) {
        console.error("Error searching upcoming appointments:", error);
    }
};

export const sendNotification = async (notificationData: any) => {
    try {
        await handleNotification(notificationData);
        const io = getIo();
        if (io && notificationData.email) {
            io.to(notificationData.email).emit('new_notification', notificationData);
        }
        const { channel } = await connectToRabbitMQ();
        channel.sendToQueue(
            'notifications',
            Buffer.from(JSON.stringify(notificationData)),
            { persistent: true }
        );
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

export const handleNotification = async (notification: any) => {
    const { type, message, name, lastName, specialty, dateTime, email, appointmentId } = notification;
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
        await notificationSchema.create({
            name,
            lastName,
            email,
            appointmentId,
            message: finalMessage,
            type,
            dateTime: dateTime ? new Date(dateTime) : undefined,
            read: false,
            createdAt: new Date()
        });
    } catch (err) {
        console.error("Failed to save notification to database:", err);
    }
};