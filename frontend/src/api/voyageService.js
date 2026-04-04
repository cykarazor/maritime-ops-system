import apiClient from "./client";

// GET ALL
export const fetchVoyages = async (params = {}) => {
  const res = await apiClient.get("/voyages", { params });

  return {
    voyages: res.data?.voyages || [],
    total: res.data?.total || 0,
    page: res.data?.page || 1,
    pages: res.data?.pages || 1,
  };
};

// GET ONE
export const getVoyage = async (id) => {
  const res = await apiClient.get(`/voyages/${id}`);
  return res.data;
};

// CREATE
export const createVoyage = async (data) => {
  const res = await apiClient.post("/voyages", data);
  return res.data;
};

// UPDATE
export const updateVoyage = async (id, data) => {
  const res = await apiClient.put(`/voyages/${id}`, data);
  return res.data;
};

// DELETE
export const deleteVoyage = async (id) => {
  const res = await apiClient.delete(`/voyages/${id}`);
  return res;
};

// RESTORE
export const restoreVoyage = async (id) => {
  const res = await apiClient.put(`/voyages/${id}/restore`);
  return res.data;
};