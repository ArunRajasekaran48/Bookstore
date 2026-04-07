import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookService from '../../services/bookService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency, bookGradient } from '../../utils/helpers';
import { LoadingPage, BackButton } from '../../components/common/UI';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isStudent } = useAuth();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    bookService.getById(id).then(setBook).catch(() => navigate('/books')).finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <LoadingPage />;
  if (!book) return null;

  const inStock = book.stockQuantity > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <BackButton className="mb-6" />

      <div className="card overflow-hidden">
        <div className="grid md:grid-cols-5 gap-0">
          {/* Cover */}
          <div className="md:col-span-2 relative bg-stone-100 min-h-80 flex items-center justify-center">
            {book.coverImageUrl
              ? <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover max-h-[420px]"
                  onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
              : null}
            <div className={`absolute inset-0 bg-gradient-to-br ${bookGradient(book.id)} flex items-center justify-center`}
                 style={{ display: book.coverImageUrl ? 'none' : 'flex' }}>
              <span className="text-8xl">📖</span>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-3 p-8">
            <div className="flex items-start gap-3 flex-wrap mb-2">
              <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
                {book.categoryName}
              </span>
              {book.lowStock && inStock && (
                <span className="badge-low-stock animate-alert-pulse">Only {book.stockQuantity} left!</span>
              )}
              {!inStock && <span className="badge-low-stock">Out of Stock</span>}
            </div>

            <h1 className="font-display text-3xl font-bold text-dark-900 mb-2">{book.title}</h1>
            <p className="text-stone-600 text-lg mb-1">by <span className="font-semibold text-dark-700">{book.author}</span></p>
            {book.publisher && <p className="text-stone-500 text-sm mb-4">{book.publisher}{book.publicationYear ? ` · ${book.publicationYear}` : ''}</p>}

            <p className="font-display text-4xl font-bold text-primary-600 mb-6">{formatCurrency(book.price)}</p>

            {book.description && (
              <p className="text-stone-600 leading-relaxed mb-6 text-sm">{book.description}</p>
            )}

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              {book.isbn && <div><span className="text-stone-400">ISBN:</span> <span className="font-mono text-dark-700">{book.isbn}</span></div>}
              {book.language && <div><span className="text-stone-400">Language:</span> <span className="text-dark-700">{book.language}</span></div>}
              {book.pageCount && <div><span className="text-stone-400">Pages:</span> <span className="text-dark-700">{book.pageCount}</span></div>}
              <div><span className="text-stone-400">In Stock:</span> <span className={`font-semibold ${inStock ? 'text-green-600' : 'text-red-500'}`}>{book.stockQuantity ?? 0} copies</span></div>
            </div>

            {/* Add to cart */}
            {isStudent && (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-3 py-2 text-dark-700 hover:bg-stone-100 transition-colors text-lg">−</button>
                  <span className="px-4 py-2 font-semibold text-dark-900 min-w-[2.5rem] text-center">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(book.stockQuantity || 1, q + 1))}
                    className="px-3 py-2 text-dark-700 hover:bg-stone-100 transition-colors text-lg">+</button>
                </div>
                <button
                  disabled={!inStock}
                  onClick={() => addToCart(book.id, qty)}
                  className={`btn-primary flex-1 flex items-center justify-center gap-2 ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  🛒 Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
