import express from "express"
import { createAppointment, getAppointment } from "../controller/appointmentController";

const router = express.Router();


router.post("/createAppointment", createAppointment)
router.get("/getAppointment/:appointmentId", getAppointment);

export default router