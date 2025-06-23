import { getRabbitMQChannel } from "../config/rabbitmq";
import { getIO } from "../config/socket";
import Appointment from "../model/appointment_info";
import { IAppointment } from "../interfaces/interface";

export const createAppointment = async (
  name: string,
  lastName: string,
  email: string,
  specialty: string,
  date: Date,
  hour: string
) => {
  const newAppointment = new Appointment({
    name,
    lastName,
    email,
    specialty,
    date,
    hour,
    status: "waiting for confirmation"
  });

  const savedAppointment = await newAppointment.save();

  const channel = getRabbitMQChannel();
  channel.sendToQueue(
    "appointment.created",
    Buffer.from(JSON.stringify(savedAppointment))
  );

  return savedAppointment;
};

export const updateAppointment = async (
  _id: string,
  name?: string,
  lastName?: string,
  email?: string,
  specialty?: string,
  date?: Date,
  hour?: string,
  status?: "waiting for confirmation" | "confirmed" | "canceled"
): Promise<IAppointment> => {
  const appointment = await Appointment.findOne({ _id });
  if (!appointment) throw new Error("Appointment not found");

  if (name) appointment.name = name;
  if (lastName) appointment.lastName = lastName;
  if (email) appointment.email = email;
  if (specialty) appointment.specialty = specialty;
  if (date) appointment.date = date;
  if (hour) appointment.hour = hour;
  if (status) appointment.status = status;

  const updatedAppointment = await appointment.save();

  if (status || date || hour) {
    const channel = getRabbitMQChannel();
    channel.sendToQueue(
      "appointment.status.updated",
      Buffer.from(JSON.stringify(updatedAppointment))
    );
  }

  return updatedAppointment;
};


export const getAllAppointments = async (): Promise<IAppointment[]> => {
  return await Appointment.find();
};
