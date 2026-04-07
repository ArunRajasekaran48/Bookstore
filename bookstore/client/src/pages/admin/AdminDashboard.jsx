import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookService from '../../services/bookService';
import { categoryService, orderService, inventoryService } from '../../services/otherServices';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { LoadingPage, StatusBadge } from '../../components/common/UI';

const EMPTY_STATS = {
  totalBooks: 0,
  totalCats: 0,
  totalOrders: 0,
  totalRevenue: 0,
  activeAlerts: 0,
  lowStockCount: 0,
};

const asArray = (value) => (Array.isArray(value) ? value : []);

const StatCard = ({ icon, label, value, sub, color = 'primary' }) => {
  const colors = {
    primary: 'from-primary-500 to-amber-600',
    green:   'from-emerald-500 to-teal-600',
    blue:    'from-sky-500 to-blue-600',
    red:     'from-red-500 to-rose-600',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-5 text-white shadow-lg`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-white/70 text-sm font-medium">{label}</p>
      <p className="text-3xl font-display font-bold">{value}</p>
      {sub && <p className="text-white/60 text-xs mt-1">{sub}</p>}
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats]         = useState(EMPTY_STATS);
  const [recentOrders, setRecent] = useState([]);
  const [alerts, setAlerts]       = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [booksResp, catsResp, ordersResp, alertsResp] = await Promise.all([
          bookService.getAll(),
          categoryService.getAll(),
          orderService.getAllOrders(),
          inventoryService.getActiveAlerts(),
        ]);

        const books = asArray(booksResp);
        const cats = asArray(catsResp);
        const orders = asArray(ordersResp);
        const activeAlerts = asArray(alertsResp);

        const totalRevenue = orders
          .filter(o => o.paymentStatus === 'SUCCESS')
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        setStats({
          totalBooks:    books.length,
          totalCats:     cats.length,
          totalOrders:   orders.length,
          totalRevenue,
          activeAlerts:  activeAlerts.length,
          lowStockCount: books.filter(b => b.lowStock).length,
        });
        setRecent(orders.slice(0, 5));
        setAlerts(activeAlerts.slice(0, 4));
      } catch (error) {
        console.error('Failed to load admin dashboard data', error);
        setStats(EMPTY_STATS);
        setRecent([]);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingPage message="Loading dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-dark-900">Admin Dashboard</h1>
        <p className="text-stone-500 mt-1">Smart Inventory Overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📚" label="Total Books"    value={stats.totalBooks}  color="primary" />
        <StatCard icon="📦" label="Total Orders"   value={stats.totalOrders} color="blue" />
        <StatCard icon="💰" label="Revenue"         value={formatCurrency(stats.totalRevenue)} color="green" />
        <StatCard icon="🚨" label="Low Stock Alerts" value={stats.activeAlerts} color="red"
          sub={`${stats.lowStockCount} books below threshold`} />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-3 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-dark-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 && <p className="text-stone-400 text-sm">No orders yet.</p>}
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                <div className="min-w-0">
                  <p className="font-mono text-xs font-semibold text-dark-700 truncate">{order.orderNumber}</p>
                  <p className="text-stone-400 text-xs">{formatDate(order.orderedAt)}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={order.status} />
                  <span className="font-semibold text-dark-900 text-sm">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-dark-900">⚠️ Active Alerts</h2>
            <Link to="/admin/inventory" className="text-primary-600 hover:text-primary-700 text-sm font-medium">Manage →</Link>
          </div>
          {alerts.length === 0
            ? <div className="text-center py-8 text-green-600">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-sm font-medium">All stock levels healthy</p>
              </div>
            : <div className="space-y-3">
                {alerts.map(alert => (
                  <div key={alert.id} className="p-3 bg-red-50 border border-red-100 rounded-lg animate-alert-pulse">
                    <p className="font-semibold text-red-800 text-xs truncate">{alert.book?.title}</p>
                    <p className="text-red-600 text-xs mt-0.5">
                      {alert.stockLevel} left · threshold: {alert.threshold}
                    </p>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { to: '/admin/books',      icon: '📚', label: 'Manage Books' },
          { to: '/admin/categories', icon: '🏷️',  label: 'Categories' },
          { to: '/admin/orders',     icon: '📦', label: 'View Orders' },
          { to: '/admin/inventory',  icon: '🔔', label: 'Inventory Alerts' },
        ].map(link => (
          <Link key={link.to} to={link.to}
            className="card p-4 flex flex-col items-center gap-2 hover:border-primary-200 hover:shadow-md transition-all text-center group">
            <span className="text-3xl">{link.icon}</span>
            <span className="text-sm font-medium text-dark-700 group-hover:text-primary-600 transition-colors">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
