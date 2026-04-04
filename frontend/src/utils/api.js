// src/utils/api.js
import apiClient from "../api/client";

// =========================
// USERS
// =========================
export const getUsers = async (params = {}) => {
  const res = await apiClient.get("/users", { params });
  return {
    users: res.data?.users || [],
    total: res.data?.total || 0,
    page: res.data?.page || 1,
    pages: res.data?.pages || 1,
  };
};

export const getUser = async (id) => {
  const res = await apiClient.get(`/users/${id}`);
  return res.data;
};

export const createUser = async (data) => {
  const res = await apiClient.post("/users", data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await apiClient.put(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await apiClient.delete(`/users/${id}`);
  return res.data;
};

// =========================
// SUPPLIERS
// =========================
export const getSuppliers = async (params = {}) => {
  const res = await apiClient.get("/suppliers", { params });
  return {
    suppliers: res.data?.suppliers || [],
    total: res.data?.total || 0,
    page: res.data?.page || 1,
    pages: res.data?.pages || 1,
  };
};

export const getSupplier = async (id) => {
  const res = await apiClient.get(`/suppliers/${id}`);
  return res.data;
};

export const createSupplier = async (data) => {
  const res = await apiClient.post("/suppliers", data);
  return res.data;
};

export const updateSupplier = async (id, data) => {
  const res = await apiClient.put(`/suppliers/${id}`, data);
  return res.data;
};

export const deleteSupplier = async (id) => {
  const res = await apiClient.delete(`/suppliers/${id}`);
  return res.data;
};

export const restoreSupplier = async (id) => {
  const res = await apiClient.put(`/suppliers/${id}/restore`);
  return res.data;
};

// =========================
// CUSTOMERS
// =========================
export const getCustomers = async (params = {}) => {
  const res = await apiClient.get("/customers", { params });
  return {
    customers: res.data?.customers || [],
    total: res.data?.total || 0,
    page: res.data?.page || 1,
    pages: res.data?.pages || 1,
  };
};

export const getCustomer = async (id) => {
  const res = await apiClient.get(`/customers/${id}`);
  return res.data;
};

export const createCustomer = async (data) => {
  const res = await apiClient.post("/customers", data);
  return res.data;
};

export const updateCustomer = async (id, data) => {
  const res = await apiClient.put(`/customers/${id}`, data);
  return res.data;
};

export const deleteCustomer = async (id) => {
  const res = await apiClient.delete(`/customers/${id}`);
  return res.data;
};

export const restoreCustomer = async (id) => {
  const res = await apiClient.put(`/customers/${id}/restore`);
  return res.data;
};

export const getCustomerBalance = async (id) => {
  const res = await apiClient.get(`/customers/${id}/balance`);
  return res.data;
};

// =========================
// INVOICES
// =========================
export const getInvoices = async (params = {}) => {
  const res = await apiClient.get("/invoices", { params });
  return {
    invoices: res.data?.invoices || [],
    total: res.data?.total || 0,
    page: res.data?.page || 1,
    pages: res.data?.pages || 1,
  };
};

export const getInvoice = async (id) => {
  const res = await apiClient.get(`/invoices/${id}`);
  return res.data;
};

export const createInvoice = async (data) => {
  const res = await apiClient.post("/invoices", data);
  return res.data;
};

export const updateInvoice = async (id, data) => {
  const res = await apiClient.put(`/invoices/${id}`, data);
  return res.data;
};

export const deleteInvoice = async (id) => {
  const res = await apiClient.delete(`/invoices/${id}`);
  return res.data;
};

export const restoreInvoice = async (id) => {
  const res = await apiClient.put(`/invoices/${id}/restore`);
  return res.data;
};

// =========================
// CARGO
// =========================
export const getCargo = async (params = {}) => {
  const res = await apiClient.get("/cargo", { params });
  return {
    cargo: res.data?.cargo || [],
    total: res.data?.total || 0,
    page: res.data?.page || 1,
    pages: res.data?.pages || 1,
  };
};

export const getCargoById = async (id) => {
  const res = await apiClient.get(`/cargo/${id}`);
  return res.data;
};

export const createCargo = async (data) => {
  const res = await apiClient.post("/cargo", data);
  return res.data;
};

export const updateCargo = async (id, data) => {
  const res = await apiClient.put(`/cargo/${id}`, data);
  return res.data;
};

export const deleteCargo = async (id) => {
  const res = await apiClient.delete(`/cargo/${id}`);
  return res.data;
};

export const restoreCargo = async (id) => {
  const res = await apiClient.put(`/cargo/${id}/restore`);
  return res.data;
};

// =========================
// AGENTS
// =========================
export const getAgents = async (params = {}) => {
  const res = await apiClient.get("/agents", { params });
  return {
    agents: res.data?.agents || [],
    total: res.data?.total || 0,
    page: res.data?.page || 1,
    pages: res.data?.pages || 1,
  };
};

export const getAgent = async (id) => {
  const res = await apiClient.get(`/agents/${id}`);
  return res.data;
};

export const createAgent = async (data) => {
  const res = await apiClient.post("/agents", data);
  return res.data;
};

export const updateAgent = async (id, data) => {
  const res = await apiClient.put(`/agents/${id}`, data);
  return res.data;
};

export const deleteAgent = async (id) => {
  const res = await apiClient.delete(`/agents/${id}`);
  return res.data;
};

export const restoreAgent = async (id) => {
  const res = await apiClient.put(`/agents/${id}/restore`);
  return res.data;
};

// =========================
// VOYAGES (as you originally pasted)
// =========================
export const getVoyages = async (params = {}) => {
  const res = await apiClient.get("/voyages", { params });
  return {
    voyages: res.data?.voyages || [],
    total: res.data?.total || 0,
    page: res.data?.page || 1,
    pages: res.data?.pages || 1,
  };
};

export const getVoyage = async (id) => {
  const res = await apiClient.get(`/voyages/${id}`);
  return res.data;
};

export const createVoyage = async (data) => {
  const res = await apiClient.post("/voyages", data);
  return res.data;
};

export const updateVoyage = async (id, data) => {
  const res = await apiClient.put(`/voyages/${id}`, data);
  return res.data;
};

export const deleteVoyage = async (id) => {
  const res = await apiClient.delete(`/voyages/${id}`);
  return res.data;
};

export const restoreVoyage = async (id) => {
  const res = await apiClient.put(`/voyages/${id}/restore`);
  return res.data;
};