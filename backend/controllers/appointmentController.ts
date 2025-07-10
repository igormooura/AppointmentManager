import { Request, Response } from "express";
import { createAppointment, getAllAppointments, getAppointmentByUser, updateAppointment } from "../services/appointmentService";


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

export const getAllAppointmentsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const appointments = await getAllAppointments();
        res.status(200).json({ appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching appointments" });
    }
};

export const updateAppointmentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        const body = req.body;

        const { name, lastName, email, specialty, date, hour, status } = body;

        if (!name && !lastName && !email && !specialty && !date && !hour && !status) {
            res.status(400).json({ message: "Missing required appointment fields" });
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

export const getAppointmentByUserController = async (
  req: Request<{ email: string }>,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.params;
    const appointments = await getAppointmentByUser(email);
    res.status(200).json(appointments);
  } catch (error: unknown) {
    console.error("Error getting appointment by user:", error);
    if (error instanceof Error) {
      if (error.message === "No appointments found for this user.") {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    } else {
      res.status(500).json({ message: "Unknown server error" });
    }
  }
};