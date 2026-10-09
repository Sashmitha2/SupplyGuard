import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// =========================
// MATERIALS
// =========================

export const getMaterials = () => {
  return API.get("/materials");
};

export const getMaterial = (id) => {
  return API.get(`/materials/${id}`);
};

export const createMaterial = (data) => {
  return API.post("/materials", data);
};

export const updateMaterial = (id, data) => {
  return API.put(`/materials/${id}`, data);
};

export const deleteMaterial = (id) => {
  return API.delete(`/materials/${id}`);
};

// =========================
// SUPPLIERS
// =========================

export const getSuppliers = () => {
  return API.get("/suppliers");
};

export const getSupplier = (id) => {
  return API.get(`/suppliers/${id}`);
};

export const createSupplier = (data) => {
  return API.post("/suppliers", data);
};

export const updateSupplier = (id, data) => {
  return API.put(`/suppliers/${id}`, data);
};

export const deleteSupplier = (id) => {
  return API.delete(`/suppliers/${id}`);
};

// =========================
// DISRUPTIONS
// =========================

export const getDisruptions = () => {
  return API.get("/disruptions");
};

export const getDisruption = (id) => {
  return API.get(`/disruptions/${id}`);
};

export const createDisruption = (data) => {
  return API.post("/disruptions", data);
};

export const updateDisruption = (id, data) => {
  return API.put(`/disruptions/${id}`, data);
};

export const deleteDisruption = (id) => {
  return API.delete(`/disruptions/${id}`);
};

// =========================
// ANALYTICS
// =========================

export const getAnalyticsSummary = () => {
  return API.get("/analytics/summary");
};

export const getMaterialRisk = () => {
  return API.get("/analytics/material-risk");
};

export const getSupplierRisk = () => {
  return API.get("/analytics/supplier-risk");
};

export const getDisruptionAnalytics = () => {
  return API.get("/analytics/disruptions");
};

export const getCriticalMaterials = () => {
  return API.get(
    "/analytics/critical-materials"
  );
};

export default API;