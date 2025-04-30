import { Request, Response } from "express";
import { Notification } from "../model/notification";


export const getNotificationsByClient = async (req: Request, res: Response): Promise<void> => {
    const { clientName } = req.params;

    try {
        const notifications = await Notification.find({ clientName }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};
