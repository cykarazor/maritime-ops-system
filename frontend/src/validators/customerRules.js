import {
  required,
  email,
  phone,
} from "./rules";

export const customerRules = {
  companyName: [
    required("Company name is required"),
  ],

  country: [
    required("Country is required"),
  ],

  email: [
    email("Invalid email format"),
  ],

  phone: [
    phone("Invalid phone number format"),
  ],
};