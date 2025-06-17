import { Router } from "express";
import {
    createAppointmentController,
    getAllAppointmentsController,
    updateAppointmentController
} from "../controllers/appointmentController";

import { createNotificationController } from "../controllers/notificationController";

const router = Router();

router.post("/appointments", createAppointmentController);
router.get("/appointments", getAllAppointmentsController);
router.put("/appointments/:_id", updateAppointmentController);

router.post("/notifications", createNotificationController);

export default router;
