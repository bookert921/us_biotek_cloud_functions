/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as express from "express";
import {
  addAppointment,
  cancelAppointment,
  updateAppointment,
} from "./acuityControllers";

const router = express.Router();

router.post("/appointments", addAppointment);
router.post("/cancels", cancelAppointment);
router.post("/updates", updateAppointment);

export default router;
