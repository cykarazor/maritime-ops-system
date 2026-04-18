// validators/rules.js

export const required = (msg = "Required") => (value) =>
  value ? null : msg;

export const isNumber = (msg = "Must be a number") => (value) =>
  value === "" || isNaN(Number(value)) ? msg : null;

export const positive = (msg = "Must be greater than 0") => (value) =>
  Number(value) > 0 ? null : msg;

export const dateRequired = (msg = "Date is required") => (value) =>
  value ? null : msg;

export const dateOrder = (otherField, msg) => (value, data) =>
  new Date(value) >= new Date(data[otherField]) ? null : msg;

export const email = (msg = "Invalid email") => (value) =>
  !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : msg;