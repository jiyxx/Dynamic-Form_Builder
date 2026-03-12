import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Forms API
export const createForm = async (data) => {
  const response = await api.post('/forms', data);
  return response.data;
};

export const getForms = async (params) => {
  const response = await api.get('/forms', { params });
  return response.data;
};

export const getForm = async (id) => {
  const response = await api.get(`/forms/${id}`);
  return response.data;
};

export const updateForm = async (id, data) => {
  const response = await api.put(`/forms/${id}`, data);
  return response.data;
};

export const duplicateForm = async (id) => {
  const response = await api.post(`/forms/${id}/duplicate`);
  return response.data;
};

export const deleteForm = async (id) => {
  await api.delete(`/forms/${id}`);
};

// Responses API
export const submitResponse = async (data) => {
  const response = await api.post('/responses', data);
  return response.data;
};

export const getResponses = async (formId, params) => {
  const response = await api.get(`/responses/${formId}`, { params });
  return response.data;
};

// Return a Blob for download
export const downloadCsv = async (formId) => {
  const response = await api.get(`/responses/${formId}/csv`, {
    responseType: 'blob',
  });
  return response.data;
};

export const getAnalytics = async (formId) => {
  const response = await api.get(`/responses/${formId}/analytics`);
  return response.data;
};

// Also expose as named exports
export default api;
