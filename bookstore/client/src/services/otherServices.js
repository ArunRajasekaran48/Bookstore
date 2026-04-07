import api from './api';

export const categoryService = {
  getAll: async () => {
    const { data } = await api.get('/categories');
    return data.data;
  },
  create: async (payload) => {
    const { data } = await api.post('/categories', payload);
    return data.data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/categories/${id}`, payload);
    return data.data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },
};

export const cartService = {
  getCart: async () => {
    const { data } = await api.get('/cart');
    return data.data;
  },
  addToCart: async (bookId, quantity) => {
    const { data } = await api.post('/cart/add', { bookId, quantity });
    return data.data;
  },
  updateItem: async (itemId, quantity) => {
    const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
    return data.data;
  },
  removeItem: async (itemId) => {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    return data.data;
  },
  clearCart: async () => {
    const { data } = await api.delete('/cart/clear');
    return data;
  },
};

export const orderService = {
  placeOrder: async (payload) => {
    const { data } = await api.post('/orders/place', payload);
    return data.data;
  },
  processPayment: async (orderId, paymentData) => {
    const { data } = await api.post(`/orders/${orderId}/payment`, paymentData);
    return data.data;
  },
  getMyOrders: async () => {
    const { data } = await api.get('/orders/my-orders');
    return data.data;
  },
  getById: async (orderId) => {
    const { data } = await api.get(`/orders/${orderId}`);
    return data.data;
  },
  getAllOrders: async () => {
    const { data } = await api.get('/orders');
    return data.data;
  },
  updateStatus: async (orderId, status) => {
    const { data } = await api.patch(`/orders/${orderId}/status?status=${status}`);
    return data.data;
  },
};

export const inventoryService = {
  getActiveAlerts: async () => {
    const { data } = await api.get('/inventory/alerts');
    return data.data;
  },
  getAllAlerts: async () => {
    const { data } = await api.get('/inventory/alerts/all');
    return data.data;
  },
  acknowledgeAlert: async (alertId) => {
    const { data } = await api.patch(`/inventory/alerts/${alertId}/acknowledge`);
    return data;
  },
  resolveAlert: async (alertId) => {
    const { data } = await api.patch(`/inventory/alerts/${alertId}/resolve`);
    return data;
  },
  triggerSync: async () => {
    const { data } = await api.post('/inventory/sync');
    return data;
  },
};
