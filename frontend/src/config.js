// Frontend Config Example
// This file demonstrates common configuration scenarios

// API Configuration
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
  },
  production: {
    baseURL: 'https://api.yourdomain.com/api',
    timeout: 15000,
  },
};

// Auth Configuration
const AUTH_CONFIG = {
  tokenKey: 'token',
  userKey: 'user',
  expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  refreshBuffer: 60 * 1000, // 1 minute
};

// UI Configuration
const UI_CONFIG = {
  itemsPerPage: 10,
  animationDuration: 300,
  toastDuration: 3000,
  debounceDelay: 500,
};

// Feature Flags
const FEATURES = {
  enableNotifications: true,
  enableAnalytics: false,
  enableBeta: false,
  maxTasksPerProject: 100,
};

export { API_CONFIG, AUTH_CONFIG, UI_CONFIG, FEATURES };
