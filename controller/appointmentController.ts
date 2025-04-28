import { createAppointment } from './../services/appointmentServices';
import { Appointment } from './../model/appointment';
import { Request, Response } from 'express';

export const createAppointmentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { clientName, specialty, dateTime } = req.body

        if (!clientName || !specialty || !dateTime) {
            res.status(400).json({ message: "All fields need to be completed" })
        }

        const newAppointment = await createAppointment(clientName, specialty, dateTime)

        res.status(200).json({ message: "Appointment created ", appointment: newAppointment })

    } catch (error) {
        res.status(500).json({ message: "Error creating appointment" })
    }
}

export const getAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;

        const response = await Appointment.findOne({ _id });

        if (!response) {
            res.status(404).json({ message: "There's no appointment with this ID" });
            return;
        }

        res.status(200).json({ appointment: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching appointment" });
    }
};

export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;

        const deleteResponse = await Appointment.findOneAndDelete({ _id })

        if (!deleteResponse) {
            res.status(404).json({ message: "There's no appointment or this appointment is already canceled" })
        }

        res.status(200).json({ message: "Appointment deleted" })

    } catch (error) {
        console.error(error);
    }
}

export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        const { clientName, specialty, dateTime } = req.body;

        if (!clientName && !specialty && !dateTime) {
            res.status(400).json({ message: "At least one field (clientName, specialty, or dateTime) must be provided" });
            return;
        }

        const appointment = await Appointment.findOne({ _id });

        if (!appointment) {
            res.status(404).json({ message: "Appointment not found" });
            return;
        }


        if (clientName) appointment.clientName = clientName;
        if (specialty) appointment.specialty = specialty;
        if (dateTime) appointment.dateTime = dateTime;

        const updatedAppointment = await appointment.save();

        res.status(200).json({ message: "Appointment updated", appointment: updatedAppointment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating appointment" });
    }
};
