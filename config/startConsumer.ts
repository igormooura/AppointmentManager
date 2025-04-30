import { handleNotification } from "../services/notificationServices";
import { connectToRabbitMQ } from "./rabbitmq";

export const startConsumer = async () => {
    try {
        const { channel } = await connectToRabbitMQ();

        channel.consume('notifications', async (msg) => {
            if (msg) {
                    try {
                      const content = msg.content.toString();
                      const notification = JSON.parse(content);
            
                      await handleNotification(notification);
            
                      channel.ack(msg);
                    } catch (err) {
                      console.error("Failed to process message:", err);
                      channel.nack(msg, false); 
                    }
                  }
        }, { noAck: false });

        console.log('Active consumer');
    } catch (error) {
        console.error("Error: ", error);
    }
};
