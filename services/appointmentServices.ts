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
            'appointments',
            Buffer.from(JSON.stringify({
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