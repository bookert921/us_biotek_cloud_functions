import { blob, store } from "../api/db";
import * as path from "path";
import * as os from "os";
import * as fs from "fs-extra";
import { User } from "../models";
import { firebaseConfig, logger } from "firebase-functions/v1";
import * as moment from "moment-timezone";
import { v4 as uuid } from "uuid";

/**
 * Special Use Case Only
 */
export const getLicense = async () => {
  const STORAGE_BUCKET = firebaseConfig()?.storageBucket;
  const temp = store.collection("temporary");
  const bucket = new Storage().bucket(STORAGE_BUCKET);

  const filePath = "temporary/licenses.txt";
  const tempFilePath = path.join(os.tmpdir(), filePath);

  try {
    const db = store;
    const ordersRef = db.collection("orders");
    const orders = await ordersRef.get();

    const allLicense: string[] = [];
    orders.forEach((documentSnapshot) => {
      const user: User = documentSnapshot.get("user");
      let license;
      if (user.license != null) {
        license = user.license;
      }
      license?.imageURL.forEach((imageURL) => {
        allLicense.push(imageURL?.url);
      });
    });

    await fs.outputFile(tempFilePath, allLicense.join("\n"));
    logger.info(`File created. Now adding to storage location ${bucket}...`);

    const uploadedFile = await blob.bucket(bucket).upload(tempFilePath, {
      destination: filePath,
      public: true,
      metadata: {
        contentType: "text/csv",
        metadata: { firebaseStorageDownloadTokens: uuid() },
      },
    });
    const fileUrl = uploadedFile[1].mediaLink;

    if (fileUrl) {
      await temp.doc("license").create({
        created_at: Number.parseInt(
          moment(Date.now()).tz("America/Los_Angeles").format("x")
        ),
        url: fileUrl,
      });
      logger.info(`Report, license, created successfully at ${fileUrl}.`);
    }

    fs.unlinkSync(tempFilePath);
  } catch (error) {
    console.log(error);
  }
};
