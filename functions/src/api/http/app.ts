import * as express from "express";
import * as cors from "cors";
import acuityRoutes from "./acuity/routes";
import { validateAcuityRequest } from "./acuity/validateAcuity";
import { logger } from "firebase-functions";

const app = express();

app.use(
  cors({
    origin: "https://acuityscheduling.com/api/v1/webhooks/",
    methods: ["POST"],
  })
);

app.use(express.urlencoded({ extended: true, verify: validateAcuityRequest }));

app.use(function abortOnError(
  err: ErrorEvent,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (err) {
    logger.error(err.message);
    res.status(400).end();
  } else {
    next();
  }
});

app.use("/webhooks", acuityRoutes);

export default app;
