import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      toast.success(`Welcome back, ${user.fullName}!`);
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">📚</div>
          <h1 className="font-display text-3xl font-bold text-dark-900">Welcome Back</h1>
          <p className="text-stone-500 mt-1">Sign in to BookHaven</p>
        </div>

        <div className="card p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Username</label>
              <input
                name="username" value={form.username} onChange={handleChange}
                required autoComplete="username"
                className="input-field" placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Password</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                required autoComplete="current-password"
                className="input-field" placeholder="Enter your password"
              />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading ? <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
