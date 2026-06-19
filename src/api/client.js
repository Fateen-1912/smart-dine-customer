// Central API client — all backend calls go through here.
// Reads VITE_API_URL from .env (default: https://smart-dine-api.onrender.com).

export const BASE_URL = import.meta.env.VITE_API_URL || 'https://smart-dine-api.onrender.com';

function getToken() {
  return localStorage.getItem('accessToken');
}

async function request(method, endpoint, body) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body !== undefined) options.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, options);
  } catch {
    throw new Error('Cannot reach server. Make sure the backend is running.');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  get:   (endpoint)        => request('GET',   endpoint),
  post:  (endpoint, body)  => request('POST',  endpoint, body),
  patch: (endpoint, body)  => request('PATCH', endpoint, body),
};
