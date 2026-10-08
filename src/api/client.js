/**
 * client.js
 * Centralized API client for SRR Academy Portal.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('srr_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const url = `${BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, config);

        // Handle 401 Unauthorized
        if (response.status === 401) {
            localStorage.removeItem('srr_token');
            localStorage.removeItem('srr_user');
            window.dispatchEvent(new Event('auth:unauthorized'));
            // If not already on login, redirect
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        return data;
    } catch (err) {
        throw err;
    }
}

export const api = {
    get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    patch: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
