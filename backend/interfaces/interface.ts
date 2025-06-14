import { Document } from "mongoose";

export interface IAppointment extends Document {
    name: string;
    lastName: string;
    email: string;
    specialty: string;
    date: Date;
    hour: string;
    status: "waiting for confirmation" | "confirmed" | "canceled";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface INotification extends Document {
    appointmentId: string;
    userEmail: string;
    message: string;
    status: "waiting for confirmation" | "confirmed" | "canceled";
    createdAt: Date;
    read: boolean;
}

export interface AppointmentInput {
    name: string;
    lastName: string;
    email: string;
    specialty: string;
    date: Date;
    hour: string;
}