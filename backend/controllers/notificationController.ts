import { Request, Response } from "express";
import { IAppointment } from "../interfaces/interface"
import { createNotification } from "../services/notificationService";

export const createNotificationController = async (req: Request, res: Response): Promise<void> => {
    try {

        const appointment: IAppointment = req.body;

        if (!appointment._id || !appointment.email || !appointment.status || !appointment.date || !appointment.hour) {
            res.status(400).json({ error: "Missing required appointment fields1" });
            return;
        }

        const notification = await createNotification(appointment);
        res.status(201).json({
            success: true,
            data: notification,
            message: "Notification created successfully"
        });

    } catch (error) {
        console.error("Error creating notification:", error);
    }
}