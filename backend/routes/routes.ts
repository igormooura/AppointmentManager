import { Router } from "express";
import {
    createAppointmentController,
    getAllAppointmentsController,
    updateAppointmentController
} from "../controllers/appointmentController";

import { createNotificationController } from "../controllers/notificationController";

const router = Router();

router.post("/create-appointment", createAppointmentController);
router.get("/all-appointments", getAllAppointmentsController);
router.put("/update-appointment/:_id", updateAppointmentController);

router.post("/notifications", createNotificationController);

export default router;
