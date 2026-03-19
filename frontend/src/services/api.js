import axios from 'axios';

// Base API URL — points to our Express backend
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// ─── Request Interceptor ──────────────────────────────────
// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Response Interceptor ─────────────────────────────────
// Handle 401 globally (token expired)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth Endpoints ───────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// ─── Notes Endpoints ──────────────────────────────────────
export const notesAPI = {
  getAll: (params) => API.get('/notes', { params }),
  getById: (id) => API.get(`/notes/${id}`),
  upload: (data) => API.post('/notes/upload', data),
  upvote: (id) => API.put(`/notes/${id}/upvote`),
  delete: (id) => API.delete(`/notes/${id}`),
};

// ─── Questions Endpoints ──────────────────────────────────
export const questionsAPI = {
  getAll: (params) => API.get('/questions', { params }),
  create: (data) => API.post('/questions', data),
  postAnswer: (id, data) => API.post(`/questions/${id}/answer`, data),
  markBest: (id, answerId) => API.put(`/questions/${id}/best/${answerId}`),
};

// ─── Tasks Endpoints ──────────────────────────────────────
export const tasksAPI = {
  getAll: () => API.get('/tasks'),
  create: (data) => API.post('/tasks', data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  delete: (id) => API.delete(`/tasks/${id}`),
};

// ─── Study / Pomodoro Endpoints ───────────────────────────
export const studyAPI = {
  getAll: () => API.get('/study'),
  logSession: (data) => API.post('/study', data),
  delete: (id) => API.delete(`/study/${id}`),
};

// ─── Flashcards Endpoints ─────────────────────────────────
export const flashcardsAPI = {
  getAll: () => API.get('/flashcards'),
  create: (data) => API.post('/flashcards', data),
  update: (id, data) => API.put(`/flashcards/${id}`, data),
  delete: (id) => API.delete(`/flashcards/${id}`),
};

export default API;