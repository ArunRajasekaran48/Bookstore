import { useState, useEffect, useCallback } from 'react';
import bookService from '../services/bookService';
import { categoryService, orderService, inventoryService } from '../services/otherServices';
import toast from 'react-hot-toast';

const asArray = (value) => (Array.isArray(value) ? value : []);

export const useBooks = (categoryId = null) => {
  const [books, setBooks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = categoryId
        ? await bookService.getByCategory(categoryId)
        : await bookService.getAll();
      setBooks(asArray(data));
    } catch (err) {
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => { fetch(); }, [fetch]);
  return { books, loading, error, refetch: fetch };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(asArray(data));
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { categories, loading, refetch: fetch };
};

export const useOrders = (isAdmin = false) => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = isAdmin
        ? await orderService.getAllOrders()
        : await orderService.getMyOrders();
      setOrders(asArray(data));
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => { fetch(); }, [fetch]);
  return { orders, loading, refetch: fetch };
};

export const useAlerts = () => {
  const [alerts, setAlerts]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getAllAlerts();
      setAlerts(asArray(data));
    } catch (err) {
      console.error(err);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const acknowledge = async (alertId) => {
    try {
      await inventoryService.acknowledgeAlert(alertId);
      toast.success('Alert acknowledged');
      fetch();
    } catch { toast.error('Failed to acknowledge alert'); }
  };

  const resolve = async (alertId) => {
    try {
      await inventoryService.resolveAlert(alertId);
      toast.success('Alert resolved');
      fetch();
    } catch { toast.error('Failed to resolve alert'); }
  };

  useEffect(() => { fetch(); }, [fetch]);
  return { alerts, loading, refetch: fetch, acknowledge, resolve };
};
