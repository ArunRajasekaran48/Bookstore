import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-900/30 group-hover:scale-105 transition-transform">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H12v16H6.5A2.5 2.5 0 0 0 4 22z" />
                <path d="M20 6.5A2.5 2.5 0 0 0 17.5 4H12v16h5.5A2.5 2.5 0 0 1 20 22z" />
              </svg>
            </span>
            <span className="font-display font-bold text-xl text-primary-400 group-hover:text-primary-300 transition-colors">
              BookHaven
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {!user && (
              <>
                <Link to="/books" className="text-stone-300 hover:text-white text-sm font-medium transition-colors">Browse</Link>
                <Link to="/login" className="text-stone-300 hover:text-white text-sm font-medium transition-colors">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </>
            )}

            {isStudent && (
              <>
                <Link to="/books" className="text-stone-300 hover:text-white text-sm font-medium transition-colors">Browse</Link>
                <Link to="/student/orders" className="text-stone-300 hover:text-white text-sm font-medium transition-colors">My Orders</Link>
                <Link to="/cart" className="relative text-stone-300 hover:text-white transition-colors">
                  <span className="text-xl">🛒</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className="text-stone-300 hover:text-white text-sm font-medium transition-colors">Dashboard</Link>
                <Link to="/admin/books" className="text-stone-300 hover:text-white text-sm font-medium transition-colors">Books</Link>
                <Link to="/admin/orders" className="text-stone-300 hover:text-white text-sm font-medium transition-colors">Orders</Link>
                <Link to="/admin/inventory" className="text-stone-300 hover:text-white text-sm font-medium transition-colors">Inventory</Link>
              </>
            )}

            {user && (
              <div className="flex items-center gap-3 pl-3 border-l border-stone-700">
                <span className="text-sm text-stone-400">Hi, <span className="text-white font-medium">{user.fullName?.split(' ')[0]}</span></span>
                <button onClick={handleLogout} className="text-stone-400 hover:text-white text-sm transition-colors">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-stone-300 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-700 py-3 space-y-1">
            {isStudent && (
              <>
                <Link to="/books" className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded" onClick={() => setMenuOpen(false)}>Browse Books</Link>
                <Link to="/cart" className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded" onClick={() => setMenuOpen(false)}>Cart ({cartCount})</Link>
                <Link to="/student/orders" className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded" onClick={() => setMenuOpen(false)}>My Orders</Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/admin/books" className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded" onClick={() => setMenuOpen(false)}>Books</Link>
                <Link to="/admin/orders" className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded" onClick={() => setMenuOpen(false)}>Orders</Link>
                <Link to="/admin/inventory" className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded" onClick={() => setMenuOpen(false)}>Inventory</Link>
              </>
            )}
            {user
              ? <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-stone-800 rounded">Logout</button>
              : <Link to="/login" className="block px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded" onClick={() => setMenuOpen(false)}>Login</Link>
            }
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
