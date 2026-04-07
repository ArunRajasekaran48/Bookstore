import React, { useState } from 'react';
import bookService from '../../services/bookService';
import { useBooks, useCategories } from '../../hooks/useData';
import { formatCurrency } from '../../utils/helpers';
import { LoadingPage, EmptyState, ConfirmModal, StatusBadge, BackButton } from '../../components/common/UI';
import toast from 'react-hot-toast';

const EMPTY_FORM = { title:'', author:'', isbn:'', description:'', price:'', coverImageUrl:'', publisher:'', publicationYear:'', language:'English', pageCount:'', categoryId:'', initialStock:'10', reorderThreshold:'5' };

const BookFormModal = ({ book, categories, onClose, onSaved }) => {
  const editing = !!book?.id;
  const [form, setForm] = useState(editing ? {
    ...book, categoryId: book.categoryId, initialStock: book.stockQuantity ?? 10, reorderThreshold: book.reorderThreshold ?? 5
  } : EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), publicationYear: form.publicationYear ? parseInt(form.publicationYear) : null, pageCount: form.pageCount ? parseInt(form.pageCount) : null, categoryId: parseInt(form.categoryId), initialStock: parseInt(form.initialStock), reorderThreshold: parseInt(form.reorderThreshold) };
      editing ? await bookService.update(book.id, payload) : await bookService.create(payload);
      toast.success(editing ? 'Book updated!' : 'Book created!');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save book');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4 animate-fade-in">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-dark-900">{editing ? 'Edit Book' : 'Add New Book'}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-dark-900 text-2xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto">
          <div className="col-span-2"><label className="block text-xs font-medium text-stone-600 mb-1">Title *</label><input name="title" value={form.title} onChange={set} required className="input-field" /></div>
          <div><label className="block text-xs font-medium text-stone-600 mb-1">Author *</label><input name="author" value={form.author} onChange={set} required className="input-field" /></div>
          <div><label className="block text-xs font-medium text-stone-600 mb-1">ISBN</label><input name="isbn" value={form.isbn} onChange={set} className="input-field" /></div>
          <div><label className="block text-xs font-medium text-stone-600 mb-1">Price (₹) *</label><input type="number" step="0.01" name="price" value={form.price} onChange={set} required className="input-field" /></div>
          <div><label className="block text-xs font-medium text-stone-600 mb-1">Category *</label>
            <select name="categoryId" value={form.categoryId} onChange={set} required className="input-field">
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-span-2"><label className="block text-xs font-medium text-stone-600 mb-1">Description</label><textarea name="description" value={form.description} onChange={set} rows={2} className="input-field resize-none" /></div>
          <div className="col-span-2"><label className="block text-xs font-medium text-stone-600 mb-1">Cover Image URL</label><input name="coverImageUrl" value={form.coverImageUrl} onChange={set} className="input-field" placeholder="https://..." /></div>
          <div><label className="block text-xs font-medium text-stone-600 mb-1">Publisher</label><input name="publisher" value={form.publisher} onChange={set} className="input-field" /></div>
          <div><label className="block text-xs font-medium text-stone-600 mb-1">Year</label><input type="number" name="publicationYear" value={form.publicationYear} onChange={set} className="input-field" /></div>
          <div><label className="block text-xs font-medium text-stone-600 mb-1">Language</label><input name="language" value={form.language} onChange={set} className="input-field" /></div>
          <div><label className="block text-xs font-medium text-stone-600 mb-1">Pages</label><input type="number" name="pageCount" value={form.pageCount} onChange={set} className="input-field" /></div>
          {!editing && <div><label className="block text-xs font-medium text-stone-600 mb-1">Initial Stock *</label><input type="number" name="initialStock" value={form.initialStock} onChange={set} required min="0" className="input-field" /></div>}
          <div><label className="block text-xs font-medium text-stone-600 mb-1">Reorder Threshold</label><input type="number" name="reorderThreshold" value={form.reorderThreshold} onChange={set} min="1" className="input-field" /></div>

          <div className="col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"/>Saving...</> : (editing ? 'Update Book' : 'Add Book')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StockModal = ({ book, onClose, onSaved }) => {
  const [qty, setQty]     = useState(book.stockQuantity ?? 0);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await bookService.updateStock(book.id, qty, reason);
      toast.success('Stock updated!');
      onSaved();
    } catch (err) {
      toast.error('Failed to update stock');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
        <h2 className="font-display text-lg font-semibold mb-1">Update Stock</h2>
        <p className="text-stone-500 text-sm mb-4 truncate">{book.title}</p>
        <div className="mb-3">
          <label className="block text-xs font-medium text-stone-600 mb-1">New Stock Quantity</label>
          <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} min="0" className="input-field" />
        </div>
        <div className="mb-5">
          <label className="block text-xs font-medium text-stone-600 mb-1">Reason (optional)</label>
          <input value={reason} onChange={e => setReason(e.target.value)} className="input-field" placeholder="Restocked, Returned..." />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="btn-primary flex-1">
            {loading ? 'Saving...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminBooksPage = () => {
  const { books, loading, refetch } = useBooks();
  const { categories }              = useCategories();
  const [showForm, setShowForm]     = useState(false);
  const [editBook, setEditBook]     = useState(null);
  const [stockBook, setStockBook]   = useState(null);
  const [delBook, setDelBook]       = useState(null);
  const [search, setSearch]         = useState('');

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    try { await bookService.delete(delBook.id); toast.success('Book deleted'); refetch(); }
    catch { toast.error('Failed to delete'); }
    finally { setDelBook(null); }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton className="mb-4" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-dark-900">Manage Books</h1>
        <button className="btn-primary" onClick={() => { setEditBook(null); setShowForm(true); }}>+ Add Book</button>
      </div>

      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} className="input-field max-w-sm" placeholder="Search books..." />
      </div>

      {filtered.length === 0
        ? <EmptyState icon="📚" title="No books found" />
        : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    {['Title', 'Author', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map(book => (
                    <tr key={book.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-dark-900 text-sm max-w-[200px] truncate">{book.title}</p>
                        <p className="text-stone-400 text-xs font-mono">{book.isbn || '—'}</p>
                      </td>
                      <td className="px-4 py-3 text-stone-600">{book.author}</td>
                      <td className="px-4 py-3 text-stone-600">{book.categoryName}</td>
                      <td className="px-4 py-3 font-semibold text-primary-600">{formatCurrency(book.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${book.lowStock ? 'text-red-600' : 'text-green-600'}`}>{book.stockQuantity ?? 0}</span>
                        {book.lowStock && <span className="ml-1 text-red-400 text-xs">⚠️</span>}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={book.active ? 'CONFIRMED' : 'CANCELLED'} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditBook(book); setShowForm(true); }}
                            className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">Edit</button>
                          <button onClick={() => setStockBook(book)}
                            className="text-green-600 hover:text-green-800 text-xs px-2 py-1 rounded hover:bg-green-50 transition-colors">Stock</button>
                          <button onClick={() => setDelBook(book)}
                            className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      {showForm && <BookFormModal book={editBook} categories={categories} onClose={() => { setShowForm(false); setEditBook(null); }} onSaved={() => { setShowForm(false); setEditBook(null); refetch(); }} />}
      {stockBook && <StockModal book={stockBook} onClose={() => setStockBook(null)} onSaved={() => { setStockBook(null); refetch(); }} />}
      <ConfirmModal isOpen={!!delBook} title="Delete Book" message={`Delete "${delBook?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete} onCancel={() => setDelBook(null)} confirmLabel="Delete" danger />
    </div>
  );
};

export default AdminBooksPage;
