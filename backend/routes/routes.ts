import { Router } from "express";
import {
    createAppointmentController,
    getAllAppointmentsController,
    getAppointmentByUserController,
    updateAppointmentController
} from "../controllers/appointmentController";

import { createNotificationController } from "../controllers/notificationController";


const router = Router();

router.post("/create-appointment", createAppointmentController);
router.get("/all-appointments", getAllAppointmentsController);
router.put("/update-appointment/:_id", updateAppointmentController);
router.get("/appointment/:email", getAppointmentByUserController);

router.post("/notifications", createNotificationController);

export default router;
