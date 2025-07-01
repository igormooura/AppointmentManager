export interface Appointment {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  specialty: string;
  date: string;
  hour: string;
  status: "pending" | "confirmed" | "canceled";
}

export type NotificationType = {
  id: number;
  status: "pending" | "confirmed" | "canceled";
  message: string;
};