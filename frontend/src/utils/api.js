import axios from 'axios'

const api = axios.create({
  baseURL: '/',
  withCredentials: true,   // send session cookie
  headers: { 'Content-Type': 'application/json' },
})

// Attach Django CSRF token automatically
api.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find(r => r.startsWith('csrftoken='))
    ?.split('=')[1]
  if (token) config.headers['X-CSRFToken'] = token
  return config
})

export default api
