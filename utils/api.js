import AsyncStorage from '@react-native-async-storage/async-storage';
let DEFAULT_API_URL = 'https://budget-tracker-mobile-app.onrender.com/api'; // Render backend
export const getApiUrl = async () => {
  const saved = await AsyncStorage.getItem('budget_api_url');
  return saved || DEFAULT_API_URL;
};
export const setApiUrl = async (url) => {
  await AsyncStorage.setItem('budget_api_url', url);
};
const api = {
  async getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    const user = await AsyncStorage.getItem('budget_user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed && parsed.token) {
          headers['Authorization'] = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error('Error parsing user token', err);
      }
    }
    return headers;
  },
  async request(endpoint, options = {}) {
    const baseUrl = await getApiUrl();
    const url = `${baseUrl}${endpoint}`;
    const headers = { ...(await this.getHeaders()), ...options.headers };
    
    // 6-second custom timeout limit
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const config = {
      ...options,
      headers,
      signal: controller.signal,
    };
    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Connection timed out. Please verify your backend server is running and the IP address is correct.');
      }
      throw err;
    }
  },
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },
  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};
export default api;