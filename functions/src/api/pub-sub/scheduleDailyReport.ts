import { pubsub, firebaseConfig, logger } from "firebase-functions";
import { blob, store } from "../db";
import { getTimezoneTime } from "../../utils";
import { v4 as uuid } from "uuid";
import * as path from "path";
import * as os from "os";
import * as fs from "fs-extra";
import { createOrderCSV, gatherReportData } from "../../services";

// const CATEGORY =
//   "COVID-19 Test For Travel To China, Serum and Nasal Swab Collection | COVID-19 中国旅行检测, 血清和鼻拭测试";

export const scheduleDailyReports = pubsub
  .schedule("30 10 * * 1-5") // 0 15 * * 1-5
  // .schedule("35 20 * * *")
  .timeZone("America/Los_Angeles")
  .onRun(async (_) => {
    const dailyReportsRef = store.collection("daily-reports");
    const ordersRef = store.collection("orders");

    const storage = blob.bucket(firebaseConfig()?.storageBucket);
    const fileName = getTimezoneTime("MM-DD-YYYY_HH:mm") as string;
    const filePath = `daily-reports/${fileName}.csv`;

    const tempFilePath = path.join(os.tmpdir(), filePath);
    console.log("CSV Order file", filePath, tempFilePath);

    try {
      /* Create CSV from Orders range */
      logger.info("Grabbing orders...");
      // let q = ordersRef.where(
      //   "appointment.date",
      //   "==",
      //   getTimezoneTime("MMMM D, YYYY") as string
      // );
      // q = q.where("appointment.category", "==", CATEGORY);

      // let q = ordersRef.where("created_at", ">=", getTimezoneTime("x"));
      // q = q.where("status", "==", succeeded);

      // /* Generate report to upload */
      // const snapshot = await q.get();

      const snapshot = await ordersRef.get();
      // Handle edge case of empty snapshot
      if (snapshot.size === 0) {
        logger.log("No data to create file with");
        return;
      } else {
        logger.log("Snapshot size is: ", snapshot.size);
      }
      const data = gatherReportData(snapshot);
      await createOrderCSV(data, fileName, tempFilePath);

      logger.info(
        `File created. Now adding to storage location ${
          firebaseConfig()?.storageBucket
        }...`
      );
      /* Upload CSV to Storage */
      const uploadedFile = await storage.upload(tempFilePath, {
        destination: filePath,
        public: true,
        metadata: {
          contentType: "text/csv",
          metadata: { firebaseStorageDownloadTokens: uuid() },
        },
      });
      const url = uploadedFile[1].mediaLink;

      /* Provide link to report */
      logger.info("Creating daily reports...");
      await dailyReportsRef
        .doc(fileName)
        .create({ created_at: getTimezoneTime("x") as number, url: url })
        .then(() => {
          logger.info(`Report, ${fileName}, created successfully at ${url}.`);
          return fs.unlinkSync(tempFilePath);
        });
    } catch (err) {
      logger.error(err);
    }
  });
