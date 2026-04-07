import React, { useState, useMemo } from 'react';
import { useBooks, useCategories } from '../../hooks/useData';
import BookCard from '../../components/student/BookCard';
import { LoadingPage, EmptyState } from '../../components/common/UI';

const BookCatalogPage = () => {
  const { books, loading }         = useBooks();
  const { categories }             = useCategories();
  const [search, setSearch]        = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [sortBy, setSortBy]        = useState('title');

  const filtered = useMemo(() => {
    let result = [...books];
    if (selectedCat !== 'all') result = result.filter(b => b.categoryId === Number(selectedCat));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.isbn && b.isbn.includes(q))
      );
    }
    result.sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'title')      return a.title.localeCompare(b.title);
      if (sortBy === 'author')     return a.author.localeCompare(b.author);
      return 0;
    });
    return result;
  }, [books, selectedCat, search, sortBy]);

  if (loading) return <LoadingPage message="Loading catalog..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero strip */}
      <div className="mb-8 bg-gradient-to-r from-dark-900 to-dark-700 rounded-2xl p-6 text-white">
        <h1 className="font-display text-3xl font-bold mb-1">Book Catalog</h1>
        <p className="text-stone-400">Browse {books.length} books across {categories.length} categories</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-10" placeholder="Search by title, author, or ISBN…"
          />
        </div>
        <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)} className="input-field sm:w-48">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field sm:w-44">
          <option value="title">Sort: Title</option>
          <option value="author">Sort: Author</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0
        ? <EmptyState icon="🔍" title="No books found" message="Try adjusting your search or filters." />
        : (
          <>
            <p className="text-sm text-stone-500 mb-4">{filtered.length} books found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
              {filtered.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </>
        )
      }
    </div>
  );
};

export default BookCatalogPage;
