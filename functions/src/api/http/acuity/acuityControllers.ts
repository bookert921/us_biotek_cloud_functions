/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import axios from "axios";
import * as moment from "moment";

const db = admin.firestore();
// eslint-disable-next-line new-cap

const acuity = axios.create({
  baseURL: process.env.ACUITY_URL,
  auth: {
    username: process.env.ACUITY_USER_ID!,
    password: process.env.ACUITY_API_KEY!,
  },
});

export const addAppointment = async (req: Request, res: Response) => {
  functions.logger.info(`Acuity action: ${req.body.action}`);
  const appointmentId = req.body.id;
  const ordersRef = db.collection("orders");
  if (appointmentId != undefined) {
    try {
      const response = await acuity.get(`/appointments/${appointmentId}`);
      const appointment = response.data;
      const email = appointment.email;

      const snapshot = await ordersRef.where("email", "==", email).get();
      functions.logger.log(`Snapshot size: ${snapshot.size}`);
      const matches: any = [];
      snapshot.forEach((doc) => {
        if (doc.exists) {
          matches.push([doc.id, doc.data()]);
        }
      });
      functions.logger.info(
        `Here are the matches found:\n${matches.join("\n")}`
      );

      if (matches.length > 0) {
        matches.sort((a: any, b: any) => b[1].created_at - a[1].created_at);
        const docId = matches[0][0];
        functions.logger.info(`Match found for ${docId}`);
        ordersRef.doc(docId).set({ appointment: appointment }, { merge: true });
      } else {
        functions.logger.warn("No matches found!");
        ordersRef.doc().create({
          cart: {},
          created_at: Number.parseInt(moment(Date.now()).format("x")),
          updated_at: Number.parseInt(moment(Date.now()).format("x")),
          email: email,
          appointment: appointment,
          status: "No preliminary information found",
        });
        functions.logger.info("Appointment created!");
      }

      functions.logger.info(
        `Appointment ${appointment.id} for order ${ordersRef.id} added.`
      );

      res
        .status(200)
        .send(
          `Appointment for appointment id: ${appointment.id} has been successfully added.`
        );
    } catch (error) {
      functions.logger.error(error);
      res.status(400).end();
    }
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  functions.logger.info(`Acuity action: ${req.body.action}`);
  const appointmentId = req.body.id;
  const ordersRef = db.collection("orders");
  if (appointmentId != undefined) {
    try {
      const response = await acuity.get(`/appointments/${appointmentId}`);
      const appointment = response.data;

      const snapshot = await ordersRef
        .where("appointment.id", "==", appointment.id)
        .get();
      functions.logger.log(`Snapshot size: ${snapshot.size}`);
      const matches: any = [];
      snapshot.forEach((doc) => {
        if (doc.exists) {
          matches.push([doc.id, doc.data()]);
        }
      });
      functions.logger.info(
        `Here are the matches found:\n${matches.join("\n")}`
      );
      if (matches.length > 0) {
        matches.sort((a: any, b: any) => b[1].created_at - a[1].created_at);
        const docId = matches[0][0];
        functions.logger.info(`Match found for ${docId}`);
        await ordersRef.doc(docId).update({ appointment: appointment });
        functions.logger.info(
          `Appointment ${appointment.id} for ${ordersRef.id} has been updated.`
        );
      } else {
        functions.logger.warn("No matches found!");
      }
      res.status(200).end();
    } catch (error) {
      functions.logger.error(error);
      res.status(400).end();
    }
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  functions.logger.info(`Acuity action: ${req.body.action}`);
  const appointmentId = req.body.id;
  const ordersRef = db.collection("orders");
  if (appointmentId != undefined) {
    try {
      const response = await acuity.get(`/appointments/${appointmentId}`);
      const appointment = response.data;

      const snapshot = await ordersRef
        .where("appointment.id", "==", appointment.id)
        .get();
      functions.logger.log(`Snapshot size: ${snapshot.size}`);
      const matches: any = [];
      snapshot.forEach((doc) => {
        if (doc.exists) {
          matches.push([doc.id, doc.data()]);
        }
      });
      functions.logger.info(
        `Here are the matches found:\n${matches.join("\n")}`
      );
      if (matches.length > 0) {
        matches.sort((a: any, b: any) => b[1].created_at - a[1].created_at);
        const docId = matches[0][0];
        functions.logger.info(`Match found for ${docId}`);
        await ordersRef.doc(docId).update({ appointment: appointment });
        functions.logger.info(
          `Appointment ${appointment.id} for ${ordersRef.id} has been removed.`
        );
      } else {
        functions.logger.warn("No matches found!");
      }
      res.status(200).end();
    } catch (error) {
      functions.logger.error(error);
      res.status(400).end();
    }
  }
};
