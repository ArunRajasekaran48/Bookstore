import React, { useState } from 'react';
import { categoryService } from '../../services/otherServices';
import { useCategories } from '../../hooks/useData';
import { LoadingPage, ConfirmModal, BackButton } from '../../components/common/UI';
import toast from 'react-hot-toast';

const AdminCategoriesPage = () => {
  const { categories, loading, refetch } = useCategories();
  const [form, setForm]   = useState({ name: '', description: '' });
  const [editing, setEditing] = useState(null);
  const [delCat, setDelCat]   = useState(null);
  const [saving, setSaving]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      editing
        ? await categoryService.update(editing.id, form)
        : await categoryService.create(form);
      toast.success(editing ? 'Category updated!' : 'Category created!');
      setForm({ name: '', description: '' });
      setEditing(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally { setSaving(false); }
  };

  const startEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || '' });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
  };

  const handleDelete = async () => {
    try {
      await categoryService.delete(delCat.id);
      toast.success('Category deleted');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally { setDelCat(null); }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton className="mb-4" />
      <h1 className="font-display text-3xl font-bold text-dark-900 mb-8">Manage Categories</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold mb-4">{editing ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                required className="input-field" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={3} className="input-field resize-none" placeholder="Brief description..." />
            </div>
            <div className="flex gap-2 pt-1">
              {editing && <button type="button" onClick={cancelEdit} className="btn-secondary flex-1 text-sm">Cancel</button>}
              <button type="submit" disabled={saving} className="btn-primary flex-1 text-sm">
                {saving ? 'Saving...' : editing ? 'Update' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold mb-4">All Categories ({categories.length})</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {categories.map(cat => (
              <div key={cat.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${editing?.id === cat.id ? 'border-primary-300 bg-primary-50' : 'border-stone-100 hover:border-stone-200'}`}>
                <div className="min-w-0">
                  <p className="font-medium text-dark-800 text-sm truncate">{cat.name}</p>
                  <p className="text-stone-400 text-xs">{cat.bookCount} books</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => startEdit(cat)}
                    className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">Edit</button>
                  <button onClick={() => setDelCat(cat)}
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors">Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmModal isOpen={!!delCat} title="Delete Category"
        message={`Delete "${delCat?.name}"? All books in this category may be affected.`}
        onConfirm={handleDelete} onCancel={() => setDelCat(null)} confirmLabel="Delete" danger />
    </div>
  );
};

export default AdminCategoriesPage;
