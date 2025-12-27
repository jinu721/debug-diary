import axios from 'axios';
import { AuthResponse, BugEntry, CreateBugData, UpdateBugData, BugFilters } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  signup: async (email: string, password: string) => {
    const response = await api.post('/auth/signup', { email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },
};

export const bugApi = {
  createBug: async (bugData: CreateBugData): Promise<BugEntry> => {
    const response = await api.post('/bugs', bugData);
    return response.data;
  },

  getBugs: async (filters?: BugFilters): Promise<BugEntry[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.rootCauseCategory) params.append('rootCauseCategory', filters.rootCauseCategory);
    if (filters?.technologyTags?.length) params.append('technologyTags', filters.technologyTags.join(','));
    if (filters?.isReusableFix !== undefined) params.append('isReusableFix', filters.isReusableFix.toString());

    const response = await api.get(`/bugs?${params.toString()}`);
    return response.data;
  },

  getBugById: async (id: string): Promise<BugEntry> => {
    const response = await api.get(`/bugs/${id}`);
    return response.data;
  },

  updateBug: async (id: string, updateData: UpdateBugData): Promise<BugEntry> => {
    const response = await api.put(`/bugs/${id}`, updateData);
    return response.data;
  },

  deleteBug: async (id: string): Promise<void> => {
    await api.delete(`/bugs/${id}`);
  },

  getReusableFixes: async (): Promise<BugEntry[]> => {
    const response = await api.get('/bugs/reusable-fixes');
    return response.data;
  },
};