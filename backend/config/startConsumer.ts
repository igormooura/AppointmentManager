import { handleNotification } from "../services/notificationServices";
import { connectToRabbitMQ } from "./rabbitmq";
import { getIo } from "./socketManager";


export const startConsumer = async () => {
  try {
    const { channel } = await connectToRabbitMQ();

    await channel.assertQueue('notifications', { durable: true });
    console.log('Waiting for messages in queue: notifications');

    channel.consume('notifications', async (msg) => {
      if (!msg) return;

      try {
        const notification = JSON.parse(msg.content.toString());
        console.log('[RABBITMQ] Received notification:', notification.type);

        await handleNotification(notification);

        const io = getIo();
        if (io && notification.email) {
          io.to(notification.email).emit('new_notification', notification);
        }

        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    console.error('Failed to start consumer:', error);
    setTimeout(startConsumer, 5000);
  }
};