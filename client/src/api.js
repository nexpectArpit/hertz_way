const BACKEND_ORIGIN = import.meta.env.VITE_API_BASE_URL || '';
// If VITE_API_BASE_URL is set (production), calls go to `${origin}/api/...`.
// Otherwise we keep the current dev behavior where Vite proxies `/api` to the backend.
const API = BACKEND_ORIGIN
    ? `${BACKEND_ORIGIN.replace(/\/$/, '')}/api`
    : '/api';

const call = async (method, path, body) => {
    const opts = {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) opts.body = JSON.stringify(body);
    
    try {
        const r = await fetch(API + path, opts);
        
        // If 401 or 403, clear localStorage to sync frontend state
        if (r.status === 401 || r.status === 403) {
            localStorage.removeItem('hw_user');
        }
        
        return r.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

export const me = () => call('GET', '/me');
export const login = (email, pw, role) => call('POST', '/auth/login', { email, password: pw, role });
export const logout = () => call('POST', '/auth/logout');

export const signupCustomer = (data) => call('POST', '/auth/register/customer', data);
export const signupAgency = (data) => call('POST', '/auth/register/agency', data);

export const fetchCars = () => call('GET', '/cars');
export const myCars = () => call('GET', '/cars/my-cars');
export const createCar = (data) => call('POST', '/cars/add', data);
export const updateCar = (id, data) => call('PUT', `/cars/edit/${id}`, data);

export const reserve = (data) => call('POST', '/bookings/book', data);
export const myBookings = () => call('GET', '/bookings/agency-bookings');
