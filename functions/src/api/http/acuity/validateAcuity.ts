/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as crypto from "crypto";
import { logger } from "firebase-functions";
import { Request, Response } from "express";

const secret = process.env.ACUITY_API_KEY!;

/**
 * Validates incoming requests as Acuity requests
 *
 * @param {Request} req Request to validate
 * @param {Response} _res
 * @param {Buffer} buf
 * @param {BufferEncoding} _encoding
 */
export function validateAcuityRequest(
  req: Request,
  _res: Response,
  buf: Buffer,
  _encoding: BufferEncoding
) {
  try {
    const signature = req.get("X-Acuity-Signature")!;
    const hasher = crypto.createHmac("sha256", secret);
    hasher.update(buf);
    const hash = hasher.digest("base64");
    logger.info(
      `X-Acuity-Signature: ${signature} Content: ${buf.toString("utf8")}`
    );
    if (signature === hash) {
      logger.info("Valid signature!");
    } else {
      throw new Error("Invalid signature!");
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    logger.error(error);
  }
}
