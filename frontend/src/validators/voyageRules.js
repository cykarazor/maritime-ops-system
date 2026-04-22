import { required } from "./rules";

export const voyageRules = {
  vesselName: [
    required("Vessel name is required"),
  ],

  voyageNumber: [
    required("Voyage number is required"),
  ],

  loadPort: [],

  dischargePort: [],

  status: [
    required("Status is required"),
  ],

  assignedCustomer: [
    required("Customer is required"),
  ],

  assignedAgent: [
    required("Agent is required"),
  ],
};