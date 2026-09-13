import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // If the response is wrapped in our custom ApiResponse (has explicit 'success' boolean)
    // we unwrap it so components always receive the actual data payload predictably.
    const data = response.data;
    if (data && typeof data === 'object' && typeof data.success === 'boolean') {
      if (data.success) {
        return data.data; // Return the typed inner payload
      }
    }
    // Return standard data (e.g. Page objects, direct DTOs, binary blobs)
    return data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect if unauthorized
      localStorage.removeItem('token');
      // Using window.location to force full reload to clear states, 
      // though a router navigate is preferred in React. 
      // For global interceptor, this is standard unless injected with a router instance.
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }

    const normalizedError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
      code: error.response?.data?.error?.code,
      requestId: error.response?.data?.error?.requestId,
      original: error,
    };

    if (!error.response) {
      normalizedError.message = 'Unable to connect to the server. Please check your network or try again later.';
    } else if (error.response?.data?.error?.message) {
      normalizedError.message = error.response.data.error.message;
    } else if (error.response?.status === 401) {
      normalizedError.message = 'Invalid credentials or unauthorized access.';
    } else if (error.response?.status === 403) {
      normalizedError.message = 'You do not have permission to perform this action.';
    } else if (error.message) {
      normalizedError.message = error.message;
    }

    return Promise.reject(normalizedError);
  }
);
