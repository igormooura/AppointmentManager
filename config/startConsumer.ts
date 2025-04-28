import { connectToRabbitMQ } from "./rabbitmq";

export const startConsumer = async () => {
    try {
        const { channel } = await connectToRabbitMQ();

        const notificationQueue = 'notifications';


        channel.consume(notificationQueue, (msg) => {
            if (msg) {
                const notification = JSON.parse(msg.content.toString());
                console.log('Notificação recebida:', notification);
                channel.ack(msg);
            }
        }, { noAck: false });

        console.log('Consumer ativo e aguardando mensagens.');
    } catch (error) {
        console.error("Erro ao iniciar o consumer:", error);
    }
};
