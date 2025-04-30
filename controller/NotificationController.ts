import { Request, Response } from "express";
import { Notification } from "../model/notification";
import { handleNotification } from "../services/notificationServices";

export const getNotificationsByClient = async (req: Request, res: Response): Promise<void> => {
    const { clientName } = req.params;

    try {
        const notifications = await Notification.find({ clientName }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

export const handleIncomingNotification = async (req: Request, res: Response): Promise<void> => {
    const notification = req.body;  

    try {
        await handleNotification(notification);
        res.status(200).json({ message: "Notification processed successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to process notification" });
    }
};

export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const notification = Notification.findByIdAndUpdate(
                id,
                { $set: { read: true } }, // determine read as true
                { new: true } // return new 
        )

        if (!notification) {
             res.status(404).json({ error: "Notification not found" });
        }

        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: "Failed to update notification" });
    }
};

