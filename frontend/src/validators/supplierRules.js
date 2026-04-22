import { required, email, positive } from "./rules";

export const supplierRules = {
  companyName: [
    required("Company name is required")
  ],
  
  country: [
    required("Country is required")]
    ,
  
    contactPerson: [
      required("Contact person is required")
    ],

  email: [email("Invalid email format")],

  phone: [
    required("Phone is required"),
    (value) =>
      /^[0-9+\-\s]{7,15}$/.test(value || "")
        ? null
        : "Invalid phone number",
  ],

  paymentTerms: [
    positive("Payment terms must be greater than 0"),
  ],

  creditLimit: [
    positive("Credit limit must be 0 or greater"),
  ],
};