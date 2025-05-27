import { cancelAppointment, createAppointment } from './../services/appointmentServices';
import { Appointment } from './../model/appointment';
import { Request, Response } from 'express';

export const createAppointmentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, lastName, email, specialty, dateTime } = req.body;

        if (!name || !lastName || !email || !specialty || !dateTime) {
            res.status(400).json({ message: "All fields (name, lastName, email, specialty, dateTime) must be completed" });
            return;
        }

        const newAppointment = await createAppointment(name, lastName, email, specialty, dateTime);

        res.status(200).json({ message: "Appointment created", appointment: newAppointment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating appointment" });
    }
};


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

export const getAllAppointments = async (req: Request, res: Response): Promise<void> => { 
    try {

        const response = await Appointment.find({});

        console.log(response)

        if(!response){ 
            res.status(404).json({message: "No data!"})
        }

        res.status(200).json(response);
    } catch (err){
        console.log(err)
    }
}

export const deleteAppointmentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;

        const deletedAppointment = await cancelAppointment(_id);

        res.status(200).json({ message: "Appointment deleted", appointment: deletedAppointment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting appointment" });
    }
};

export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        const body = req.body || {}; // Evita undefined

        const { name, lastName, email, specialty, dateTime, status } = body;

        if (!name && !lastName && !email && !specialty && !dateTime && !status) {
            res.status(400).json({ message: "At least one field must be provided" });
            return;
        }

        const appointment = await Appointment.findOne({ _id });

        if (!appointment) {
            res.status(404).json({ message: "Appointment not found" });
            return;
        }

        if (name) appointment.name = name;
        if (lastName) appointment.lastName = lastName;
        if (email) appointment.email = email;
        if (specialty) appointment.specialty = specialty;
        if (dateTime) appointment.dateTime = dateTime;
        if (status) appointment.status = status;

        const updatedAppointment = await appointment.save();

        res.status(200).json({ message: "Appointment updated", appointment: updatedAppointment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating appointment" });
    }
};


