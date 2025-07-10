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


export interface INotification {
  _id: string;
  appointmentId: string;  
  userEmail: string;
  message: string;
  status: "waiting for confirmation" | "confirmed" | "canceled";
  read: boolean;
  createdAt?: string;     
}

export interface ICode {
  email: string;
  code: number;
  createdAt: Date;
  expiresAt: Date;
}