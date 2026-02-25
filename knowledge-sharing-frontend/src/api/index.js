import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

// Auth
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const logout = () => API.post('/auth/logout');

// Articles
export const getArticles = () => API.get('/articles');
export const getArticle = (id) => API.get(`/articles/${id}`);
export const searchArticles = (q, category) => API.get('/articles/search', { params: { q, category } });
export const getMyArticles = () => API.get('/articles/my');
export const createArticle = (data) => API.post('/articles', data);
export const updateArticle = (id, data) => API.put(`/articles/${id}`, data);
export const deleteArticle = (id) => API.delete(`/articles/${id}`);

// AI
export const aiImprove = (content, title, action) =>
    API.post('/ai/improve', { content, title, action });
export const aiSummarize = (content, title) =>
    API.post('/ai/summarize', { content, title });
export const aiSuggestTags = (content, title) =>
    API.post('/ai/suggest-tags', { content, title });

export default API;
