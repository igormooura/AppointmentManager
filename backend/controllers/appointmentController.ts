import { Request, Response } from "express";
import { createAppointment } from "../services/appointmentService";


export const createAppointmentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, lastName, email, specialty, date, hour } = req.body;

        if (!name || !lastName || !email || !specialty || !date || !hour) {
            res.status(400).json({ message: "All fields (name, lastName, email, specialty, date, hour) must be completed" });
            return;
        }

        const newAppointment = await createAppointment(name, lastName, email, specialty, new Date(date), hour);

        res.status(201).json({ message: "Appointment created", appointment: newAppointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating appointment" });
    }
};