import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, bookGradient } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const { isStudent } = useAuth();
  const { addToCart } = useCart();

  const inStock = book.stockQuantity > 0;

  return (
    <div className="book-card card flex flex-col overflow-hidden cursor-pointer group"
         onClick={() => navigate(`/books/${book.id}`)}>

      {/* Cover */}
      <div className="relative h-52 overflow-hidden bg-stone-100">
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div className={`absolute inset-0 bg-gradient-to-br ${bookGradient(book.id)} flex items-center justify-center`}
             style={{ display: book.coverImageUrl ? 'none' : 'flex' }}>
          <span className="text-5xl opacity-80">📖</span>
        </div>

        {/* Stock badge */}
        <div className="absolute top-2 right-2">
          {!inStock
            ? <span className="badge-low-stock">Out of Stock</span>
            : book.lowStock
              ? <span className="badge-low-stock animate-alert-pulse">Low Stock</span>
              : <span className="badge-in-stock">In Stock</span>
          }
        </div>

        {/* Category */}
        <div className="absolute bottom-2 left-2">
          <span className="bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
            {book.categoryName}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-display font-semibold text-dark-900 text-base leading-snug line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-stone-500 text-sm mb-3">{book.author}</p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="font-display font-bold text-primary-600 text-lg">
            {formatCurrency(book.price)}
          </span>
          {isStudent && (
            <button
              className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95 ${
                inStock
                  ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
              disabled={!inStock}
              onClick={(e) => { e.stopPropagation(); addToCart(book.id, 1); }}
            >
              {inStock ? '+ Cart' : 'Unavailable'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
