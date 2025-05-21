import { connectToRabbitMQ } from "../config/rabbitmq";
import { Appointment } from "../model/appointment";

export const createAppointment = async (
    name: string,
    lastName: string,
    email: string,
    specialty: string,
    dateTime: string
) => {
    // verifica se já existe um agendamento nesse horário
    const existingAppointment = await Appointment.findOne({ dateTime });
    if (existingAppointment) {
        throw new Error("Time slot already booked");
    }

    // cria e salva o agendamento
    const newAppointment = new Appointment({
        name,
        lastName,
        email,
        specialty,
        dateTime,
        status: "PENDING",
    });

    

    await newAppointment.save();

    try {
        const { channel } = await connectToRabbitMQ();

        console.log("chegou no rabbit");

        // envia notificação de agendamento para a fila
        channel.sendToQueue(
            'notifications',
            Buffer.from(JSON.stringify({
                type: 'APPOINTMENT_SCHEDULED',
                id: newAppointment._id,
                name,
                lastName,
                email,
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

    console.log("passa1");

    try {
        const { channel } = await connectToRabbitMQ();
        
        // envia notificação de cancelamento
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
        // busca agendamentos que vão acontecer em até uma hora
        const upcomingAppointments = await Appointment.find({
            dateTime: {
                $gte: now,
                $lt: oneHourLater
            },
            reminderSent: false // só pega os que ainda não receberam notificação
        });

        if (upcomingAppointments.length === 0) return;

        console.log(upcomingAppointments);

        const { channel } = await connectToRabbitMQ();

        for (const appointment of upcomingAppointments) {
            // envia notificação de lembrete para cada agendamento
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

            // marca como notificada
            await Appointment.updateOne({ _id: appointment._id }, { $set: { reminderSent: true } });
        }

        console.log(`[REMINDER] ${upcomingAppointments.length} notificações enviadas.`);

    } catch (error) {
        console.error("Error searching upcoming appointments:", error);
    }
};
