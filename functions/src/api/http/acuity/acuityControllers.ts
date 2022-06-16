/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import axios from "axios";

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
      /* Find Appointment and email of client */
      const response = await acuity.get(`/appointments/${appointmentId}`);
      const appointment = response.data;
      const email = appointment.email;

      /* Search Firestore for all orders related to email, from appointment */
      const snapshot = await ordersRef.where("email", "==", email).get();
      functions.logger.log(`Snapshot size: ${snapshot.size}`);
      const matches: any = [];
      snapshot.forEach((doc) => {
        if (doc.exists) {
          matches.push([doc.id, doc.data()]);
        }
      });

      /* If there are no matches by email, create new order holding appointment with flag under status */
      if (!matches.length) {
        functions.logger.warn("No matches found!");
        ordersRef.doc().create({
          cart: {}, // Empty because no orders found associated to appointment email
          created_at: Date.now(),
          updated_at: Date.now(),
          email: email,
          appointment: appointment,
          status: "No preliminary information found",
        });
        functions.logger.info("Order with appointment created!");
        res.status(201).end();
      }

      matches.sort((a: any, b: any) => b[1].created_at - a[1].created_at);
      const match = matches[0];
      const [docId, doc] = match;
      functions.logger.info(
        `Most current order found with email ${email} is ${docId}`
      );

      /* To avoid replacing multiple appointments, create new appointment object */
      if (doc.appointment != null) {
        ordersRef.doc().create({
          ...doc,
          appointment: appointment,
          created_at: Date.now(),
          updated_at: Date.now(),
        });
        res
          .status(201)
          .end(() =>
            functions.logger.info(
              "Appointment has been successfully added to new order."
            )
          );
      }

      /* Otherwise, append new appointment to most current order */
      ordersRef.doc(docId).set({ appointment: appointment }, { merge: true });
      res
        .status(201)
        .end(() =>
          functions.logger.info("Appointment has been successfully added.")
        );
    } catch (error) {
      res.status(400).end(() => functions.logger.error(error));
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
      const email = appointment.email;
      /* Search Firestore for orderId related to appointmentId */
      const snapshot = await ordersRef
        .where("appointment.id", "==", appointmentId)
        .get();

      functions.logger.log(`Snapshot size: ${snapshot.size}`);
      const matches: any = [];
      snapshot.forEach((doc) => {
        if (doc.exists) {
          matches.push([doc.id, doc.data()]);
        }
      });
      matches.sort((a: any, b: any) => b[1].created_at - a[1].created_at);
      const match = matches[0];
      const [docId] = match;
      functions.logger.info(
        `Most current order found with email ${email} is ${docId}`
      );

      /* Overlay appointment object with changes */
      ordersRef.doc(docId).update({ appointment: appointment });
      res
        .status(200)
        .end(() =>
          functions.logger.info("Appointment has been successfully added.")
        );
    } catch (error) {
      res.status(400).end(() => functions.logger.error(error));
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
      const email = appointment.email;
      /* Search Firestore for orderId related to appointmentId */
      const snapshot = await ordersRef
        .where("appointment.id", "==", appointmentId)
        .get();

      functions.logger.log(`Snapshot size: ${snapshot.size}`);
      const matches: any = [];
      snapshot.forEach((doc) => {
        if (doc.exists) {
          matches.push([doc.id, doc.data()]);
        }
      });
      matches.sort((a: any, b: any) => b[1].created_at - a[1].created_at);
      const match = matches[0];
      const [docId] = match;
      functions.logger.info(
        `Most current order found with email ${email} is ${docId}`
      );

      /* Overlay appointment object with changes */
      ordersRef.doc(docId).update({ appointment: appointment });
      res
        .status(200)
        .end(() =>
          functions.logger.info("Appointment has been successfully added.")
        );
    } catch (error) {
      res.status(400).end(() => functions.logger.error(error));
    }
  }
};
