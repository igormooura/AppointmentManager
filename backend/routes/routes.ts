import { Router } from "express";
import {
  createAppointmentController,
  getAllAppointmentsController,
  getAppointmentByUserController,
  updateAppointmentController,
} from "../controllers/appointmentController";

import { createNotificationController } from "../controllers/notificationController";
import { requestCodeController } from "../controllers/codeController";
import { loginController } from "../controllers/loginController";
import { authenticateJWT } from "../middleware/authMiddleware";


const router = Router();

router.post("/create-appointment", createAppointmentController);

router.get("/all-appointments", getAllAppointmentsController);
router.put("/update-appointment/:_id", authenticateJWT, updateAppointmentController);
router.get("/appointment/:email", authenticateJWT, getAppointmentByUserController);

router.post("/notifications", createNotificationController);

router.post("/sendcode", requestCodeController);
router.post("/login", loginController);


export default router;
