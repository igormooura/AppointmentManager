import { Channel, ConsumeMessage } from "amqplib";
import { getRabbitMQChannel } from "./rabbitmq";
import { createNotification } from "../services/notificationService";
import { getIO } from "./socket";

const processMessage = async (channel: Channel, msg: ConsumeMessage, type: "created" | "status.updated") => {
  try {
    const data = JSON.parse(msg.content.toString());

    const appointment = {
      _id: data._id,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      specialty: data.specialty,
      date: new Date(data.date),
      hour: data.hour,
      status: data.status || "waiting for confirmation",
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    };

    await createNotification(appointment as any);

    const io = getIO();
    if (type === "created") {
      io.to(appointment.email).emit("appointment.pending", {
        _id: appointment._id,
        name: appointment.name,
        lastName: appointment.lastName,
        email: appointment.email,
        specialty: appointment.specialty,
        status: appointment.status,
      });
    } else if (type === "status.updated") {
      io.to(appointment.email).emit("appointment.updated", {
        _id: appointment._id,
        status: appointment.status,
      });
    }

    console.log(`Notification created for ${appointment._id} (${type})`);

    channel.ack(msg);
  } catch (err) {
    console.error(`Failed to process message (${type}):`, err);
    channel.nack(msg, false, false);
  }
};

export const startRabbitMQReceiver = async () => {
  try {
    const channel = await getRabbitMQChannel();

    await channel.consume("appointment.created", (msg) =>
      processMessage(channel, msg!, "created")
    );

    await channel.consume("appointment.status.updated", (msg) =>
      processMessage(channel, msg!, "status.updated")
    );

    console.log("RabbitMQ receiver started.");
  } catch (err) {
    console.error("Failed to start receiver:", err);
    throw err;
  }
};
