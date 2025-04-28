import express from "express"
import {  createAppointmentController, deleteAppointment, getAppointment, updateAppointment } from "../controller/appointmentController";

const router = express.Router();


router.post("/createAppointment", createAppointmentController)
router.get("/getAppointment/:_id", getAppointment);
router.delete("/deleteAppointment/:_id", deleteAppointment);
router.put("/updateAppointment/:_id", updateAppointment);

export default router