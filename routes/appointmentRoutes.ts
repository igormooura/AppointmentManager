import express from "express"
import { createAppointment, deleteAppointment, getAppointment, updateAppointment } from "../controller/appointmentController";

const router = express.Router();


router.post("/createAppointment", createAppointment)
router.get("/getAppointment/:_id", getAppointment);
router.delete("/deleteAppointment/:_id", deleteAppointment);
router.put("/updateAppointment/:_id", updateAppointment);

export default router