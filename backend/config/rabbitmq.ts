import amqp, { Channel } from "amqplib";

let channel: Channel;

export const connectToRabbitMQ = async (): Promise<void> => {
  
  try {
    const connect = await amqp.connect("amqp://localhost");
    channel = await connect.createChannel();
    await channel.assertQueue("appointment.created");
    await channel.assertQueue("appointment.status.updated");
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
    process.exit(1);
  }
};


// function cuz the other one is a void
export const getRabbitMQChannel = (): Channel => {
    if (!channel) {
        throw new Error("RabbitMQ channel not initialized");
    }
    return channel;
};