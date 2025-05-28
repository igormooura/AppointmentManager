import express from "express"
import {  createAppointmentController, deleteAppointmentController, getAllAppointments, getAppointment, updateAppointment } from "../controller/appointmentController";

const router = express.Router();

router.post("/createAppointment", createAppointmentController)
router.get("/getAllAppointments", getAllAppointments);
router.get("/getAppointment/:_id", getAppointment);
router.delete("/deleteAppointment/:_id", deleteAppointmentController);
router.put("/updateAppointment/:_id", updateAppointment);

export default router