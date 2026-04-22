import {
  required,
  positive,
} from "./rules";

export const cargoRules = {
  voyage: [
    required("Voyage is required"),
  ],

  customer: [
    required("Customer is required"),
  ],

  cargoType: [
    required("Cargo type is required"),
  ],

  quantity: [
    required("Quantity is required"),
    positive("Quantity must be greater than 0"),
  ],

  unit: [
    required("Unit is required"),
  ],

  rate: [
    required("Rate is required"),
    positive("Rate must be greater than 0"),
  ],
};