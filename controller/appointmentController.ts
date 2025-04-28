import { Appointment } from './../model/appointment';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

export const createAppointment = async(req: Request, res: Response): Promise<void> =>{
    try{ 
        const {clientName, specialty, dateTime } = req.body
        
        if(!clientName || !specialty || !dateTime){
            res.status(400).json({message: "All fields need to be completed"})
        }

        const appointmentId = uuidv4()

        const newAppointment = await Appointment.create({appointmentId, clientName, specialty, dateTime})

        res.status(200).json({message: "Appointment created ", appointment: newAppointment})
        console.log(req.body)

    } catch (error){
        res.status(500).json({message: "Error creating appointment"})
    }
}

export const getAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { appointmentId } = req.params; 

        const response = await Appointment.findOne({ appointmentId });

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
        const {appointmentId} = req.params;

        const deleteResponse = await Appointment.findOneAndDelete({appointmentId})
        
        if(!deleteResponse){
            res.status(404).json({message: "There's no appointment or this appointment is already canceled"})
        }

        res.status(200).json({message: "Appointment deleted"})
        
    } catch (error){
        console.error(error);
    }
}