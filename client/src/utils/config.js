export const BASE_URL = process.env.REACT_APP_FRONTEND_URL || 
  (process.env.NODE_ENV === 'production' 
    ? window.location.origin 
    : 'http://localhost:3000')