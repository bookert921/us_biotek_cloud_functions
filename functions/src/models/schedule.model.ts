export interface AcuitySchedule {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  endTime: string;
  dateCreated: string;
  datetime: Date;
  price: string;
  paid: string;
  amountPaid: string;
  type: string;
  appointmentTypeID: number;
  addonIDs: number[];
  classID: any;
  duration: string;
  calendar: string;
  calendarID: number;
  canClientCancel: boolean;
  canClientReschedule: boolean;
  location: string;
  certificate: any;
  confirmationPage: string;
  formsText: string;
  notes: string;
  timezone: string;
  forms: Form[];
  labels: Label[];
}

type Form = {
  id: number;
  name: string;
  values: FormValue[];
};

type FormValue = {
  value: string;
  name: string;
  fieldID: number;
  id: number;
};

type Label = {
  id: number;
  name: string;
  color: string;
};
