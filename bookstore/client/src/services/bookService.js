import api from './api';

const bookService = {
  getAll: async () => {
    const { data } = await api.get('/books');
    return data.data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/books/${id}`);
    return data.data;
  },

  getByCategory: async (categoryId) => {
    const { data } = await api.get(`/books/category/${categoryId}`);
    return data.data;
  },

  search: async (keyword) => {
    const { data } = await api.get(`/books/search?keyword=${encodeURIComponent(keyword)}`);
    return data.data;
  },

  getLowStock: async () => {
    const { data } = await api.get('/books/low-stock');
    return data.data;
  },

  create: async (bookData) => {
    const { data } = await api.post('/books', bookData);
    return data.data;
  },

  update: async (id, bookData) => {
    const { data } = await api.put(`/books/${id}`, bookData);
    return data.data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/books/${id}`);
    return data;
  },

  updateStock: async (id, quantity, reason) => {
    const { data } = await api.patch(`/books/${id}/stock`, { quantity, reason });
    return data.data;
  },
};

export default bookService;
