import { connectToRabbitMQ } from "../config/rabbitmq";

export const startConsumer = async () => {
    try {
        const { channel } = await connectToRabbitMQ();
        const queue = 'appointments';

        channel.consume(queue, (msg) => {
            if (msg) {
                const appointment = JSON.parse(msg.content.toString());
                console.log('Novo agendamento recebido:', appointment);
                channel.ack(msg);
            }
        }, { noAck: false });

        console.log('Consumer ativo e aguardando novas mensagens.');
    } catch (error) {
        console.error("Erro ao iniciar o consumer:", error);
    }
};

