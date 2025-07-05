import axios from 'axios';

/* Load base URL from Vite env */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API = `${BASE_URL}/api/transactions`;

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

/* Exported API functions */
export const getTransactions     = () => axios.get(API);
export const createTransaction   = (data) => axios.post(API, data);
export const updateTransaction   = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteTransaction   = (id) => axios.delete(`${API}/${id}`);
export const getMonthlySummary   = (year) => axios.get(`${API}/summary/monthly?year=${year}`);
export const getCategories       = () => axios.get(`${API}/categories`);
export const getCategorySummary  = () => axios.get(`${API}/summary/category`);
export const getDashboardSummary = () => axios.get(`${API}/summary/dashboard`);
export const getRecentTransactions = () => axios.get(`${API}/recent`);

