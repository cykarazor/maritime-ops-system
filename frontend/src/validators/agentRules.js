import {
  required,
  contactPerson,
  email,
  phone,
} from "./rules";

export const agentRules = {
  companyName: [
    required("Company name is required"),
  ],

  assignedIsland: [
    required("Assigned island is required"),
  ],

  contactPerson: [
    contactPerson("Contact person is required"),
  ],

  email: [
    email("Invalid email format"),
  ],

  phone: [
    phone("Invalid phone number"),
  ],
};