export const API_SERVER_BASE_PATH = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.VITE_API_SERVER_BASE_URL ?? 'https://api.greenwinit.com')

export const API_URL = `${API_SERVER_BASE_PATH}/api`
