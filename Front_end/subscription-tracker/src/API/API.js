import axios from "axios";

const ApiFormData = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data' // Fixed typo: "multipare"
    }
});

const Api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// ======== Auth APIs ========
export const signUp = (data) => Api.post('/api/auth/sign-up', data);
export const signIn = (data) => Api.post('/api/auth/sign-in', data);

// // ======== Subscription APIs ========
// export const getUserSubscriptions = (userId) => Api.get(`/api/subscription/user/${userId}`);
export const getAllSubscriptions = () => Api.get('/api/subscription');
export const getSubscriptionById = (id) => Api.get(`/api/subscription/${id}`);
// export const createSubscription = (data) => Api.post('/api/subscription', data);
export const updateSubscription = (id, data) => Api.put(`/api/subscription/${id}`, data);

export const cancelSubscription = (id) => Api.put(`/api/subscription/${id}/cancel`);
export const getUpcomingRenewals = () => Api.get('/api/subscription/upcoming-renewals');

export const getUserSubscriptions = (userId) =>
    Api.get(`/api/subscription/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
export const createSubscription = (data) =>
    Api.post('/api/subscription', data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

export const deleteSubscription = (id) =>
    Api.delete(`/api/subscription/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });


export const signOut = () => Api.post('/api/auth/sign-out');