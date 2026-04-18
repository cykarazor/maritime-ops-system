import { required, positive, dateRequired, dateOrder } from "./rules";

export const invoiceRules = {
  invoiceNumber: [required("Invoice number required")],
  type: [required("Type required")],

   voyage: [required("Voyage is required")],

  invoiceDate: [
    dateRequired("Invoice date required")],

  dueDate: [
    dateRequired("Due date required"),
    dateOrder("invoiceDate", "Due date must be after invoice date"),
  ],

  amount: [
    required("Amount required"),
    positive("Amount must be greater than 0"),
  ],

  customer: [
    (value, data) =>
      data.type === "AR" && !value
        ? "Customer required for AR invoices"
        : null,
  ],

  supplier: [
    (value, data) =>
      data.type === "AP" && !value
        ? "Supplier required for AP invoices"
        : null,
  ],
};