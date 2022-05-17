export type Gender = "M" | "F";

export interface DailyReport {
  No: number;
  "Clinic/Physician": string;
  "Ext ID": string;
  "Last Name": string;
  "Passport Number": string;
  "Vaccination Status": string;
  "First Name": string;
  "M.I.": string;
  "Sex(F/M)": Gender;
  "Date of Birth": string;
  "Test Panel": string;
  Date: string;
  Time: string;
  Timezone: string;
  Type: string;
  Storage: string;
  Email: string;
  Address: string;
  City: string;
  State: string;
  Zip: string;
  Country: string;
  Phone: string;
  Nationality: string;
  Method: string;
  "Insurance Co": string;
  "Policy No": string;
  "Group No": string;
  "Sample Vol/Qty": string;
  Comments: string;
  "Entry Verification": string;
  "Order ID": string;
  "Source ID": string;
  "Created At": Date;
  "Shipping Required": boolean;
  "Shipping Address": string;
  "Shipping City": string;
  "Shipping Country": string;
  "Shipping State": string;
  "Shipping Province Code": string;
  "Shipping Zip": string;
  Tax: number;
  Currency: string;
  Amount: string;
  "Line Item": string;
  Quantity: string;
  "Purchased By": string;
  "Practitioner ID": string;
  "Practitioner Name": string;
  Status: string;
  "Appointment Date": string;
  "Appointment Start Time": string;
  "Appointment End Time": string;
  "Practitioner First Name": string;
  "Practitioner Last Name": string;
  "Antibody(s) ordered {Sub Category}": string;
  "Kit Type {Sub Type}": string;
}

export const ReportProps = [
  "No",
  "Clinic/Physician",
  "Ext ID",
  "Last Name",
  "Passport Number",
  "Vaccination Status",
  "First Name",
  "M.I.",
  "Sex(F/M)",
  "Date of Birth",
  "Test Panel",
  "Date",
  "Time",
  "Timezone",
  "Type",
  "Storage",
  "Email",
  "Address",
  "City",
  "State",
  "Zip",
  "Country",
  "Phone",
  "Nationality",
  "Method",
  "Insurance Co",
  "Policy No",
  "Group No",
  "Sample Vol/Qty",
  "Comments",
  "Entry Verification",
  "Order ID",
  "Source ID",
  "Created At",
  "Shipping Required",
  "Shipping Address",
  "Shipping City",
  "Shipping Country",
  "Shipping State",
  "Shipping Province Code",
  "Shipping Zip",
  "Tax",
  "Currency",
  "Amount",
  "Line Items",
  "Purchased By",
  "Practitioner ID",
  "Practitioner Name",
  "Status",
  "Appointment Date",
  "Appointment Start Time",
  "Appointment End Time",
];
