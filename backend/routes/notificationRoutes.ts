import express from "express";
import { getNotificationsByClient, markNotificationAsRead, handleIncomingNotification } from "../controller/NotificationController";

const router = express.Router();

router.get("/notifications", getNotificationsByClient);
router.patch("/notifications/:id/read", markNotificationAsRead);
router.post("/notifications", handleIncomingNotification); 

export default router;
