import { logger, firebaseConfig } from "firebase-functions";
import { parse } from "json2csv";
import * as path from "path";
import * as fs from "fs-extra";
import {
  AcuitySchedule,
  ChargeResponse,
  DailyReport,
  ShoppingCart,
  User,
} from "../models";
import {
  formatPhone,
  getTimezoneTime,
  provideLineItemsMetadata,
  wherePropertyExists,
} from "../utils";

/**
 * @param {object} snapshot Query snapshot
 * @return {object} Returns data as array of objects.
 */
export function gatherReportData(
  snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
) {
  if (snapshot.size === 0) {
    logger.warn("Snapshot is empty!");
    process.exit(1);
  } else {
    logger.log("Snapshot size is: ", snapshot.size);
  }

  let count = 1;
  const csvRows: Partial<DailyReport>[] = [];
  snapshot.forEach((document) => {
    const user: User = document.get("user");
    const cart: ShoppingCart = document.get("cart");
    const appointment: AcuitySchedule = document.get("appointment");
    const status = document?.get("status");

    if (cart?.line_items) {
      cart.line_items.forEach((item) => {
        const report: Partial<Record<keyof DailyReport, any>> = {};
        report.No = count;
        const product = item?.product;
        const quantity = item?.quantity;

        report["Clinic/Physician"] = "";
        report["Ext ID"] = "";
        report["Last Name"] = wherePropertyExists([
          user?.last_name,
          cart?.last_name,
          appointment?.lastName,
        ]);
        // report["Passport Number"] = user?.passport_number || "";
        // report["Vaccination Status"] = user?.vaccinated || "";
        report["First Name"] = wherePropertyExists([
          user?.first_name,
          cart?.first_name,
          appointment?.firstName,
        ]);
        report["M.I."] = user?.middle_name || "";
        report["Sex(F/M)"] = user?.gender;
        report["Date of Birth"] = user?.dob || "";
        report["Test Panel"] = "Drop Shipping";

        report.Type = appointment?.type || "";
        report.Storage = "";
        report.Email = wherePropertyExists([
          user?.email,
          cart?.email,
          appointment?.email,
        ]);
        report.Address =
          wherePropertyExists([user?.address1, cart?.address1]) +
          wherePropertyExists([user?.address2, cart?.address2]);
        report.City = wherePropertyExists([
          user?.city,
          cart?.city,
          appointment?.location
            .split(" ")[0]
            .substring(0, appointment?.location.split(" ")[0].length - 1),
        ]);
        report.State = wherePropertyExists([
          user?.province,
          cart?.province,
          appointment?.location.split(" ")[1],
        ]);
        report.Zip = user?.zip || cart?.zip;
        report.Country = user?.country || cart?.country;
        report.Phone = formatPhone(
          user?.phone_number || cart?.phone || appointment?.phone || ""
        );
        // report.Nationality = user?.nationality || "";
        report["Insurance Co"] = user?.insurance_name;
        report["Policy No"] = user?.insurance_policy_number;
        report["Group No"] = user?.insurance_group_number;
        report["Sample Vol/Qty"] = "";
        report["Comments"] = "";
        report["Entry Verification"] = "";
        report["Order ID"] = document.ref.id;
        report["Source ID"] = "Drop Ship";
        report["Created At"] = getTimezoneTime("x") as string;
        report["Shipping Required"] = cart?.shipping_required;
        report["Shipping Address"] = cart?.shipping_address
          ? `${cart.shipping_address?.address1} ${cart.shipping_address?.address2}`
          : "";
        report["Shipping City"] = cart?.shipping_address?.city;
        report["Shipping Country"] = cart?.shipping_address?.country;
        report["Shipping State"] = cart?.shipping_address?.province;
        report["Shipping Province Code"] =
          cart?.shipping_address?.province_code;
        report["Shipping Zip"] = cart?.shipping_address?.zip;
        report.Tax = cart?.tax;
        report.Currency = cart?.currency;
        report.Amount = cart?.amount || appointment?.amountPaid;
        report["Line Item"] = product?.title;
        report["Price"] = product?.price;
        report["Quantity"] = quantity;
        // report["Appointment Date"] = appointment?.date || "";
        // report["Appointment Start Time"] = appointment?.time || "";
        report["Purchased By"] = cart?.prac_pay;
        report["Practitioner ID"] = cart?.customer_id;
        report["Practitioner Name"] =
          cart?.practitioner_name ||
          (cart?.prac_first_name !== undefined &&
          cart?.prac_last_name != undefined
            ? `${cart?.prac_first_name} ${cart?.prac_last_name}`
            : "");
        report["Practitioner First Name"] = cart?.prac_first_name;
        report["Practitioner Last Name"] = cart?.prac_last_name;
        report["Antibody(s) ordered {Sub Category}"] =
          product?.subCategorySelectedText;
        report["Kit Type {Sub Type}"] =
          product?.subTypeSelectedText ||
          (product?.subType &&
            product?.subType[product?.subTypeSelected - 1]?.name);
        report["Status"] = status;
        csvRows.push(report);
      });
      count++;
    } else {
      const report: Partial<Record<keyof DailyReport, any>> = {};
      report.No = count;

      report["Clinic/Physician"] = "";
      report["Ext ID"] = "";
      report["Last Name"] = wherePropertyExists([
        user?.last_name,
        cart?.last_name,
        appointment?.lastName,
      ]);
      // report["Passport Number"] = user?.passport_number || "";
      // report["Vaccination Status"] = user?.vaccinated || "";
      report["First Name"] = wherePropertyExists([
        user?.first_name,
        cart?.first_name,
        appointment?.firstName,
      ]);
      report["M.I."] = user?.middle_name || "";
      report["Sex(F/M)"] = user?.gender;
      report["Date of Birth"] = user?.dob || "";
      report["Test Panel"] = "Drop Shipping";

      report.Type = appointment?.type || "";
      report.Storage = "";
      report.Email = wherePropertyExists([
        user?.email,
        cart?.email,
        appointment?.email,
      ]);
      report.Address =
        wherePropertyExists([user?.address1, cart?.address1]) +
        wherePropertyExists([user?.address2, cart?.address2]);
      report.City = wherePropertyExists([
        user?.city,
        cart?.city,
        appointment?.location
          .split(" ")[0]
          .substring(0, appointment?.location.split(" ")[0].length - 1),
      ]);
      report.State = wherePropertyExists([
        user?.province,
        cart?.province,
        appointment?.location.split(" ")[1],
      ]);
      report.Zip = user?.zip || cart?.zip;
      report.Country = user?.country || cart?.country;
      report.Phone = formatPhone(
        user?.phone_number || cart?.phone || appointment?.phone || ""
      );
      // report.Nationality = user?.nationality || "";
      report["Insurance Co"] = user?.insurance_name;
      report["Policy No"] = user?.insurance_policy_number;
      report["Group No"] = user?.insurance_group_number;
      report["Sample Vol/Qty"] = "";
      report["Comments"] = "";
      report["Entry Verification"] = "";
      report["Order ID"] = document.ref.id;
      report["Source ID"] = "Drop Ship";
      report["Created At"] = getTimezoneTime("x") as string;
      report["Shipping Required"] = cart?.shipping_required;
      report["Shipping Address"] = cart?.shipping_address
        ? `${cart.shipping_address?.address1} ${cart.shipping_address?.address2}`
        : "";
      report["Shipping City"] = cart?.shipping_address?.city;
      report["Shipping Country"] = cart?.shipping_address?.country;
      report["Shipping State"] = cart?.shipping_address?.province;
      report["Shipping Province Code"] = cart?.shipping_address?.province_code;
      report["Shipping Zip"] = cart?.shipping_address?.zip;
      report.Tax = cart?.tax;
      report.Currency = cart?.currency;
      report.Amount = cart?.amount || appointment?.amountPaid;
      report["Line Item"] = "";
      report["Price"] = "";
      report["Quantity"] = "";
      // report["Appointment Date"] = appointment?.date || "";
      // report["Appointment Start Time"] = appointment?.time || "";
      report["Purchased By"] = cart?.prac_pay;
      report["Practitioner ID"] = cart?.customer_id;
      report["Practitioner Name"] =
        cart?.practitioner_name ||
        (cart?.prac_first_name !== undefined &&
        cart?.prac_last_name != undefined
          ? `${cart?.prac_first_name} ${cart?.prac_last_name}`
          : "");
      report["Practitioner First Name"] = cart?.prac_first_name;
      report["Practitioner Last Name"] = cart?.prac_last_name;
      report["Antibody(s) ordered {Sub Category}"] = "";
      report["Kit Type {Sub Type}"] = "";
      report["Status"] = status;
      csvRows.push(report);
    }
  });
  return csvRows;
}

/** Not Implemented, Needs makeover to match original.
 * @param {object} snapshot Query snapshot
 * @return {object} Returns data as array of objects.
 */
export function gatherFullReportData(snapshot: any) {
  let count = 1;
  const csvRows: Partial<DailyReport>[] = [];
  snapshot.forEach((document: any) => {
    const report: Partial<Record<keyof DailyReport, any>> = {};
    const charge_response: ChargeResponse = document.get("charge_response");
    const user: User = document.get("user");
    const status = document.get("status");
    const lis_number = document.get("lis_number");
    const cart: ShoppingCart = document.get("cart");
    const appointment: AcuitySchedule = document.get("appointment");

    let lineItems = "";
    if (cart?.line_items) {
      lineItems = provideLineItemsMetadata(cart?.line_items, true);
    }

    report.No = count++;
    report["Clinic/Physician"] = "";
    report["Ext ID"] = "";
    report["LIS"] = lis_number || "";
    report["Last Name"] = wherePropertyExists([
      user?.last_name,
      cart?.last_name,
      appointment?.lastName,
    ]);
    report["Passport Number"] = user?.passport_number || "";
    report["Vaccination Status"] = user?.vaccinated || "";
    report["First Name"] = wherePropertyExists([
      user?.first_name,
      cart?.first_name,
      appointment?.firstName,
    ]);
    report["M.I."] = user?.middle_name || "";
    report["Sex(F/M)"] = user?.gender;
    report["Date of Birth"] = user?.dob || "";
    report["Test Panel"] = defineTestPanel(appointment?.type);
    report["Date"] = getTimezoneTime(
      "YYYY-MM-DD",
      appointment?.datetime,
      appointment?.timezone
    ) as string;
    report.Time = getTimezoneTime("hh:mm A") as string;
    report["Timezone"] = appointment?.timezone || "";
    report.Type = appointment?.type || "";
    report.Storage = "";
    report.Email = wherePropertyExists([
      user?.email,
      cart?.email,
      appointment?.email,
    ]);
    report.Address =
      wherePropertyExists([user?.address1, cart?.address1]) +
      wherePropertyExists([user?.address2, cart?.address2]);
    report.City = wherePropertyExists([
      user?.city,
      cart?.city,
      appointment?.location
        .split(" ")[0]
        .substring(0, appointment?.location.split(" ")[0].length - 1),
    ]);
    report.State = wherePropertyExists([
      user?.province,
      cart?.province,
      appointment?.location.split(" ")[1],
    ]);
    report.Zip = user?.zip || cart?.zip;
    report.Country = user?.country || cart?.country;
    report.Phone = formatPhone(
      user?.phone_number || cart?.phone || appointment?.phone || ""
    );
    report.Nationality = user?.nationality || "";
    report.Method =
      typeof charge_response?.charge === "string"
        ? charge_response.charge.includes("card")
          ? "card"
          : charge_response
        : charge_response.charge?.payment_method_details?.card?.brand;
    report["Insurance Co"] = user?.insurance_name;
    report["Policy No"] = user?.insurance_policy_number;
    report["Group No"] = user?.insurance_group_number;
    report["Sample Vol/Qty"] = "";
    report.Comments = "";
    report["Entry Verification"] = "";
    report["Order ID"] = document.id;
    report["Source ID"] = firebaseConfig()?.projectId;
    report["Created At"] = getTimezoneTime("x");
    report["Shipping Required"] = cart?.shipping_required;
    report["Shipping Address"] =
      "" + cart?.shipping_address?.address1 != undefined &&
      cart?.shipping_address?.address2 != undefined
        ? `${cart?.shipping_address?.address1} ${cart?.shipping_address?.address2}`
        : "";
    report["Shipping City"] = cart?.shipping_address?.city;
    report["Shipping Country"] = cart?.shipping_address?.country;
    report["Shipping State"] = cart?.shipping_address?.province;
    report["Shipping Province Code"] = cart?.shipping_address?.province_code;
    report["Shipping Zip"] = cart?.shipping_address?.zip;
    report.Tax = cart?.tax;
    report.Currency = cart?.currency;
    report.Amount = cart?.amount || appointment?.amountPaid;
    report["Line Item"] = lineItems;
    report["Purchased By"] = cart?.prac_pay;
    report["Practitioner ID"] = cart?.customer_id;
    report["Practitioner Name"] =
      cart?.practitioner_name ||
      (cart?.prac_first_name !== undefined && cart?.prac_last_name != undefined
        ? `${cart?.prac_first_name} ${cart?.prac_last_name}`
        : "");
    report.Status = status;
    report["Appointment Date"] = appointment?.date || "";
    report["Appointment Start Time"] = appointment?.time || "";
    report["Appointment End Time"] = appointment?.endTime || "";
    csvRows.push(report);
  });
  return csvRows;
}

export const createOrderCSV = async (
  data: any[],
  filePath: string,
  tempFilePath: string
) => {
  console.log("CSV Order file", filePath, tempFilePath);
  const fileName = path.basename(filePath);
  logger.info(`Filename: ${fileName}`);
  try {
    await fs.outputFile(tempFilePath, parse(data));
  } catch (error) {
    logger.error(
      error,
      `Something went wrong with creating CSV file: ${fileName}`
    );
  }
};

/**
 * @param {string} type Type given by appointment object.
 * @return {string} Returns the type of test panel.
 */
export function defineTestPanel(type: string) {
  let testPanel: string;
  switch (type) {
    case "COVID-19 IgM and N-Protein Antibody Test":
      testPanel = "COVID-19 Antibody Screen Reflex";
      break;
    case "COVID-19 PCR test for 7 days before flight - Nasal Swab Collection - For any individual traveling to China":
      testPanel = "COVID-19 RT-PCR";
      break;
    case "COVID-19 Testing 1 Day Before Flight - For mRNA Vaccinated Individuals":
      testPanel = "COVID-19 RT-PCR" + ", " + "COVID-19 Antibody Screen Reflex";
      break;
    case "COVID-19 Testing 1 Day Before Flight - For SinoPharm or Sinovac Vaccinated Individuals":
      testPanel = "COVID-19 RT-PCR";
      break;
    default:
      testPanel = "COVID-19 RT-PCR";
      break;
  }

  return testPanel;
}
