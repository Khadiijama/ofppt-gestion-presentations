import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

const api = axios.create({ baseURL: BASE_URL });

// Users
export const getUserByEmail = (email) => api.get(`/users?email=${email}`);
export const getUserById = (id) => api.get(`/users/${id}`);
export const getUsers = () => api.get('/users');
export const updateUser = (id, data) => api.put(`/users/${id}`, data);

// Classes
export const getClasses = () => api.get('/classes');
export const getClassById = (id) => api.get(`/classes/${id}`);
export const getClassesByFormateur = (formateurId) => api.get(`/classes?formateurId=${formateurId}`);
export const createClasse = (data) => api.post('/classes', data);
export const updateClasse = (id, data) => api.put(`/classes/${id}`, data);
export const deleteClasse = (id) => api.delete(`/classes/${id}`);

// Presentations
export const getPresentations = () => api.get('/presentations');
export const getPresentationById = (id) => api.get(`/presentations/${id}`);
export const getPresentationsByClass = (classId) => api.get(`/presentations?classId=${classId}`);
export const getPresentationsByFormateur = (formateurId) => api.get(`/presentations?formateurId=${formateurId}`);
export const createPresentation = (data) => api.post('/presentations', data);
export const updatePresentation = (id, data) => api.put(`/presentations/${id}`, data);
export const deletePresentation = (id) => api.delete(`/presentations/${id}`);

// Notifications
export const getNotifications = (userId) => api.get(`/notifications?userId=${userId}`);
export const markNotificationRead = (id) => api.patch(`/notifications/${id}`, { lu: true });
export const createNotification = (data) => api.post('/notifications', data);

export default api;
