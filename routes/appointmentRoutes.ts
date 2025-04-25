import express from "express"
import { createAppointment } from "../controller/appointmentController";

const router = express.Router();


router.post("/createAppointment", createAppointment)

export default router