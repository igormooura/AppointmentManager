import express from "express"
import { createAppointment, deleteAppointment, getAppointment, updateAppointment } from "../controller/appointmentController";

const router = express.Router();


router.post("/createAppointment", createAppointment)
router.get("/getAppointment/:appointmentId", getAppointment);
router.delete("/deleteAppointment/:appointmentId", deleteAppointment);
router.put("/updateAppointment/:appointmentId", updateAppointment);

export default router