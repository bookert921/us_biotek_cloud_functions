import * as functions from "firebase-functions";
import { onCartCreate } from "./api/db/carts/on-create";
import app from "./api/http/app";
import { scheduleDailyReports } from "./api/pub-sub/scheduleDailyReport";

export const makePayment = onCartCreate;
export const createDailyReport = scheduleDailyReports;
export const acuity = functions.https.onRequest(app);
