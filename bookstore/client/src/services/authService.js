import api from './api';

const authService = {
  login: async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    return data.data;
  },

  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;
