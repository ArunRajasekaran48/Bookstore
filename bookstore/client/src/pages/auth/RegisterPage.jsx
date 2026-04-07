import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', password: '', fullName: '', phone: '', role: 'STUDENT'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created successfully!');
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">📚</div>
          <h1 className="font-display text-3xl font-bold text-dark-900">Create Account</h1>
          <p className="text-stone-500 mt-1">Join BookHaven today</p>
        </div>

        <div className="card p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange}
                required className="input-field" placeholder="Your full name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Username</label>
                <input name="username" value={form.username} onChange={handleChange}
                  required minLength={3} className="input-field" placeholder="username" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="input-field" placeholder="10-digit" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                required className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                required minLength={6} className="input-field" placeholder="Min. 6 characters" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="input-field">
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading
                ? <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />Creating account...</>
                : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-stone-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
