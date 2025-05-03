// 100% GERADO VIA CHATGPT

import { connectToRabbitMQ } from "../config/rabbitmq"; // Supondo que já tenha essa função configurada
import { Notification } from "../model/notification"; // Modelo de notificação no banco de dados

const sendTestMessage = async () => {
    try {
        const { channel } = await connectToRabbitMQ();

        // Dados de teste para enviar à fila
        const notification = {
            type: "APPOINTMENT_REMINDER",
            clientName: "Alice",
            message: "You have a dermatology appointment at 14:00",
            appointmentId: "test123"
        };

        // Envia a mensagem para a fila 'notifications'
        channel.sendToQueue(
            "notifications",
            Buffer.from(JSON.stringify(notification)),
            { persistent: true } // Garante que a mensagem persista
        );

        console.log("Test message sent to 'notifications' queue");

        // Fecha o canal após o envio da mensagem
        await channel.close();

        // Verifica se a notificação foi salva no banco de dados
        const savedNotification = await Notification.findOne({ appointmentId: "test123" });
        if (savedNotification) {
            console.log("Notification saved in the database:", savedNotification);
        } else {
            console.log("No notification found in the database.");
        }
    } catch (error) {
        console.error("Error sending test message:", error);
    }
};

sendTestMessage();
