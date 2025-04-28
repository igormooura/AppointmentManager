import { connectToRabbitMQ } from "../config/rabbitmq";
import { Appointment } from "../model/appointment";

export const createAppointment = async (clientName: string, specialty: string, dateTime: string) => {

    console.log("esta passando pelo serviço")

    const existingAppointment = await Appointment.findOne({ dateTime });
    if (existingAppointment) {
        throw new Error("Time slot already booked");
    }

    const newAppointment = new Appointment({ clientName, specialty, dateTime });
    await newAppointment.save();

    try {
        const { channel } = await connectToRabbitMQ();

        console.log("chegou no rabbit")

        channel.sendToQueue(
            'notifications',
            Buffer.from(JSON.stringify({
                type: 'APPOINTMENT_SCHEDULED',
                id: newAppointment._id,
                clientName,
                specialty,
                dateTime
            })),
            { persistent: true }
        );
    } catch (error) {
        console.error("Failed to send to queue:", error);
    }

    return newAppointment;
};

export const cancelAppointment = async (_id: string) => {
    const deletedAppointment = await Appointment.findOneAndDelete({ _id });

    if (!deletedAppointment) {
        throw new Error("There's no appointment or this appointment is already canceled");
    }
    console.log("passa1")
    try {
        const { channel } = await connectToRabbitMQ();
        
        channel.sendToQueue(
            'notifications',
            Buffer.from(JSON.stringify({
                type: 'APPOINTMENT_CANCELLED',
                message: `Your appointment on ${deletedAppointment.dateTime} was cancelled.`,
                appointmentId: deletedAppointment._id,
                clientName: deletedAppointment.clientName
            })),
            { persistent: true }
        );
        
    } catch (error) {
        console.error(error);
    }
    return deletedAppointment;
};