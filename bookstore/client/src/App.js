import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';

// Auth pages
import LoginPage    from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Student pages
import BookCatalogPage  from './pages/student/BookCatalogPage';
import BookDetailPage   from './pages/student/BookDetailPage';
import CartPage         from './pages/student/CartPage';
import CheckoutPage     from './pages/student/CheckoutPage';
import StudentOrdersPage from './pages/student/StudentOrdersPage';

// Admin pages
import AdminDashboard      from './pages/admin/AdminDashboard';
import AdminBooksPage      from './pages/admin/AdminBooksPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage     from './pages/admin/AdminOrdersPage';
import AdminInventoryPage  from './pages/admin/AdminInventoryPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: { fontFamily: 'Source Sans 3, sans-serif', fontSize: '14px', borderRadius: '10px' },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />

          <div className="min-h-screen bg-stone-50 flex flex-col">
            <Navbar />

            <main className="flex-1">
              <Routes>
                {/* Public */}
                <Route path="/"         element={<Navigate to="/books" replace />} />
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/books"    element={<BookCatalogPage />} />
                <Route path="/books/:id" element={<BookDetailPage />} />

                {/* Student protected */}
                <Route element={<ProtectedRoute role="STUDENT" />}>
                  <Route path="/cart"           element={<CartPage />} />
                  <Route path="/checkout"       element={<CheckoutPage />} />
                  <Route path="/student/orders" element={<StudentOrdersPage />} />
                </Route>

                {/* Admin protected */}
                <Route element={<ProtectedRoute role="ADMIN" />}>
                  <Route path="/admin/dashboard"  element={<AdminDashboard />} />
                  <Route path="/admin/books"      element={<AdminBooksPage />} />
                  <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                  <Route path="/admin/orders"     element={<AdminOrdersPage />} />
                  <Route path="/admin/inventory"  element={<AdminInventoryPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="bg-dark-900 text-stone-400 text-center text-xs py-4 mt-auto">
              <p>© 2024 BookHaven · Online Bookstore with Smart Inventory · Built with Spring Boot &amp; React</p>
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
