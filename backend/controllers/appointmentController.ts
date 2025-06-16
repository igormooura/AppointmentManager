import { Request, Response } from "express";
import { createAppointment, updateAppointment } from "../services/appointmentService";


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

export const updateAppointmentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        const body = req.body || {};

        const { name, lastName, email, specialty, date, hour, status } = body;

        if (!name && !lastName && !email && !specialty && !date && !hour && !status) {
            res.status(400).json({ message: "At least one field must be provided" });
            return;
        }

        const updatedAppointment = await updateAppointment(_id, name, lastName, email, specialty, date ? new Date(date) : undefined, hour, status);

        if (!updatedAppointment) {
            res.status(404).json({ message: "Appointment not found" });
            return;
        }

        res.status(200).json({ message: "Appointment updated", appointment: updatedAppointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating appointment" });
    }
};