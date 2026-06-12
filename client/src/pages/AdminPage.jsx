import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { getProductImage, getCategoryImage } from '../utils/imageUtils';

const fmt = (v) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(v || 0);

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'products', label: 'Products', icon: '🌸' },
  { id: 'orders', label: 'Orders', icon: '📦' },
  { id: 'categories', label: 'Categories', icon: '🏷️' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'upload', label: 'Upload', icon: '📷' },
];

export default function AdminPage() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Product modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', salePrice: '', stock: '10', category: '', tags: '', images: [] });
  const [saving, setSaving] = useState(false);
  const [productImageUploading, setProductImageUploading] = useState(false);

  // Category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', image: '' });
  const [editingCategory, setEditingCategory] = useState(null);

  // Upload
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploadMsg, setUploadMsg] = useState('');

  useEffect(() => {
    if (tab === 'overview') fetchStats();
    if (tab === 'products') fetchProducts();
    if (tab === 'orders') fetchOrders();
    if (tab === 'categories') fetchCategories();
    if (tab === 'users') fetchUsers();
  }, [tab]);

  const fetchStats = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/stats'); setStats(data); }
    catch { setStats(null); }
    finally { setLoading(false); }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([api.get('/products'), api.get('/categories')]);
      setProducts(p.data.products || p.data || []);
      setCategories(c.data || []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/orders'); setOrders(data || []); }
    catch { setOrders([]); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try { const { data } = await api.get('/categories'); setCategories(data || []); }
    catch { setCategories([]); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/users'); setUsers(data || []); }
    catch { setUsers([]); }
    finally { setLoading(false); }
  };

  // Product CRUD
  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: '', salePrice: '', stock: '10', category: categories[0]?._id || '', tags: '', images: [] });
    setShowProductModal(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p._id);
    setProductForm({
      name: p.name, description: p.description || '', price: p.price,
      salePrice: p.salePrice || '', stock: p.stock ?? 10,
      category: p.category?._id || p.category || '',
      tags: p.tags?.join(', ') || '', images: p.images || [],
    });
    setShowProductModal(true);
  };

  const handleProductSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        salePrice: productForm.salePrice ? Number(productForm.salePrice) : undefined,
        stock: Number(productForm.stock),
        category: productForm.category,
        tags: productForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: productForm.images.length ? productForm.images : ['https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=900'],
      };
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }
      setShowProductModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/admin/products/${id}`); fetchProducts(); }
    catch { alert('Failed to delete product.'); }
  };

  // Upload images for product form
  const handleProductImageUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;
    setProductImageUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(f => formData.append('images', f));
    try {
      const { data } = await api.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const newUrls = data.urls || [];
      setProductForm(f => ({ ...f, images: [...f.images, ...newUrls] }));
    } catch (err) {
      alert(err.response?.data?.message || 'Image upload failed.');
    } finally {
      setProductImageUploading(false);
    }
  };

  // Order status
  const handleOrderStatus = async (id, status) => {
    try { await api.put(`/admin/orders/${id}`, { status }); fetchOrders(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to update order.'); }
  };

  // Category CRUD
  const openNewCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', image: '' });
    setShowCategoryModal(true);
  };

  const openEditCategory = (c) => {
    setEditingCategory(c._id);
    setCategoryForm({ name: c.name, image: c.image || '' });
    setShowCategoryModal(true);
  };

  const handleCategorySave = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory}`, categoryForm);
      } else {
        await api.post('/admin/categories', categoryForm);
      }
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err) { alert(err.response?.data?.message || 'Failed to save category'); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await api.delete(`/admin/categories/${id}`); fetchCategories(); }
    catch { alert('Failed to delete category.'); }
  };

  // Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) { setUploadMsg('Select image files first.'); return; }
    setUploading(true); setUploadMsg('');
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    try {
      const { data } = await api.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploadedUrls(data.urls || []);
      setUploadMsg(`Uploaded ${data.files?.length || 0} image(s) successfully.`);
      setFiles([]);
    } catch (err) { setUploadMsg(err.response?.data?.message || 'Upload failed.'); }
    finally { setUploading(false); }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[80vh]">
      {/* Sidebar - horizontal scroll on mobile, vertical on desktop */}
      <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-rose-100 bg-gray-50 p-3 md:p-4 overflow-x-auto md:overflow-x-visible">
        <h2 className="hidden md:block mb-6 text-lg font-semibold tracking-wide text-brand-black">Admin Panel</h2>
        <nav className="flex md:flex-col gap-1 md:space-y-1">
          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} className={`flex items-center gap-2 md:gap-3 whitespace-nowrap rounded-xl px-3 py-2 md:py-2.5 text-left text-xs md:text-sm transition ${tab === n.id ? 'bg-rose-100 font-semibold text-brand-black' : 'text-gray-600 hover:bg-rose-50'} ${tab === n.id ? '' : ''} md:w-full`}>
              <span>{n.icon}</span><span>{n.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0">
        {/* ─── OVERVIEW ─── */}
        {tab === 'overview' && (
          <div>
            <h1 className="text-2xl font-semibold tracking-wide">Dashboard Overview</h1>
            {loading ? <p className="mt-6 text-gray-500">Loading...</p> : stats ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Revenue" value={fmt(stats.totalRevenue)} icon="💰" />
                <StatCard label="Total Orders" value={stats.totalOrders} icon="📦" />
                <StatCard label="Products" value={stats.totalProducts} icon="🌸" />
                <StatCard label="Customers" value={stats.totalUsers} icon="👥" />
              </div>
            ) : <p className="mt-6 text-red-500">Failed to load stats.</p>}
          </div>
        )}

        {/* ─── PRODUCTS ─── */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-wide">Products</h1>
              <button onClick={openNewProduct} className="rounded-full bg-brand-black px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose">+ New Product</button>
            </div>
            {loading ? <p className="mt-6 text-gray-500">Loading...</p> : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-rose-100 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead className="border-b border-rose-100 bg-rose-50/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Image</th>
                      <th className="px-4 py-3 text-left font-medium">Name</th>
                      <th className="px-4 py-3 text-left font-medium">Category</th>
                      <th className="px-4 py-3 text-left font-medium">Price</th>
                      <th className="px-4 py-3 text-left font-medium">Stock</th>
                      <th className="px-4 py-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id} className="border-b border-rose-50 hover:bg-rose-50/30">
                        <td className="px-4 py-3"><img src={getProductImage(p)} alt="" className="h-10 w-10 rounded-lg object-cover" /></td>
                        <td className="px-4 py-3 font-medium">{p.name}</td>
                        <td className="px-4 py-3 text-gray-600">{p.category?.name || '—'}</td>
                        <td className="px-4 py-3">{fmt(p.price)}{p.salePrice && <span className="ml-1 text-xs text-green-600">{fmt(p.salePrice)}</span>}</td>
                        <td className="px-4 py-3">{p.stock}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => openEditProduct(p)} className="mr-2 text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length === 0 && <p className="p-6 text-center text-gray-400">No products found.</p>}
              </div>
            )}
          </div>
        )}

        {/* ─── ORDERS ─── */}
        {tab === 'orders' && (
          <div>
            <h1 className="text-2xl font-semibold tracking-wide">Orders</h1>
            {loading ? <p className="mt-6 text-gray-500">Loading...</p> : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-rose-100 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead className="border-b border-rose-100 bg-rose-50/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Order ID</th>
                      <th className="px-4 py-3 text-left font-medium">Customer</th>
                      <th className="px-4 py-3 text-left font-medium">Date</th>
                      <th className="px-4 py-3 text-left font-medium">Total</th>
                      <th className="px-4 py-3 text-left font-medium">Payment</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id} className="border-b border-rose-50 hover:bg-rose-50/30">
                        <td className="px-4 py-3 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                        <td className="px-4 py-3">{o.user?.name || o.userId?.name || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-medium">{fmt(o.total || o.totalPrice)}</td>
                        <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[o.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>{o.paymentStatus}</span></td>
                        <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status}</span></td>
                        <td className="px-4 py-3">
                          <select value={o.status} onChange={e => handleOrderStatus(o._id, e.target.value)} className="rounded-lg border border-gray-200 px-2 py-1 text-xs">
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <p className="p-6 text-center text-gray-400">No orders yet.</p>}
              </div>
            )}
          </div>
        )}

        {/* ─── CATEGORIES ─── */}
        {tab === 'categories' && (
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-wide">Categories</h1>
              <button onClick={openNewCategory} className="rounded-full bg-brand-black px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose">+ New Category</button>
            </div>
            {loading ? <p className="mt-6 text-gray-500">Loading...</p> : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map(c => (
                  <div key={c._id} className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                    <img src={getCategoryImage(c)} alt={c.name} className="h-12 w-12 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditCategory(c)} className="text-xs text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteCategory(c._id)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && <p className="text-gray-400">No categories.</p>}
              </div>
            )}
          </div>
        )}

        {/* ─── USERS ─── */}
        {tab === 'users' && (
          <div>
            <h1 className="text-2xl font-semibold tracking-wide">Customers</h1>
            {loading ? <p className="mt-6 text-gray-500">Loading...</p> : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-rose-100 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead className="border-b border-rose-100 bg-rose-50/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Name</th>
                      <th className="px-4 py-3 text-left font-medium">Email</th>
                      <th className="px-4 py-3 text-left font-medium">Role</th>
                      <th className="px-4 py-3 text-left font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-b border-rose-50 hover:bg-rose-50/30">
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-gray-600">{u.email}</td>
                        <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                        <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <p className="p-6 text-center text-gray-400">No users found.</p>}
              </div>
            )}
          </div>
        )}

        {/* ─── UPLOAD ─── */}
        {tab === 'upload' && (
          <div>
            <h1 className="text-2xl font-semibold tracking-wide">Upload Images</h1>
            <p className="mt-1 text-sm text-gray-500">JPG, PNG, WEBP · Max 5 files, 5 MB each.</p>
            <form onSubmit={handleUpload} className="mt-6 space-y-4">
              <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={e => setFiles(Array.from(e.target.files || []))} className="block w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm" />
              <button type="submit" disabled={uploading} className="rounded-full bg-brand-black px-6 py-3 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose disabled:opacity-60">{uploading ? 'Uploading…' : 'Upload'}</button>
            </form>
            {uploadMsg && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm">{uploadMsg}</p>}
            {uploadedUrls.length > 0 && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {uploadedUrls.map(url => (
                  <div key={url} className="overflow-hidden rounded-2xl border border-rose-100">
                    <img src={url} alt="" className="h-40 w-full object-cover" />
                    <p className="break-all px-3 py-2 text-xs text-gray-600">{url}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Product Modal */}
      {showProductModal && (
        <Modal onClose={() => setShowProductModal(false)} title={editingProduct ? 'Edit Product' : 'New Product'}>
          <form onSubmit={handleProductSave} className="space-y-4">
            <Input label="Product Name" value={productForm.name} onChange={v => setProductForm(f => ({ ...f, name: v }))} required />
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
              <textarea rows={3} required value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input label="Price" type="number" value={productForm.price} onChange={v => setProductForm(f => ({ ...f, price: v }))} required />
              <Input label="Sale Price" type="number" value={productForm.salePrice} onChange={v => setProductForm(f => ({ ...f, salePrice: v }))} />
              <Input label="Stock" type="number" value={productForm.stock} onChange={v => setProductForm(f => ({ ...f, stock: v }))} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Category</label>
              <select value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <Input label="Tags (comma separated)" value={productForm.tags} onChange={v => setProductForm(f => ({ ...f, tags: v }))} />
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Product Images</label>
              <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleProductImageUpload} className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm mb-2" />
              {productImageUploading && <p className="text-xs text-gray-500 mb-2">Uploading...</p>}
              {productForm.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {productForm.images.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt="" className="h-14 w-14 rounded-lg object-cover border border-gray-200" />
                      <button type="button" onClick={() => setProductForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
                    </div>
                  ))}
                </div>
              )}
              <input type="text" placeholder="Or paste image URLs (comma separated)" value={productForm.images.join(', ')} onChange={e => setProductForm(f => ({ ...f, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="rounded-full bg-brand-black px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose disabled:opacity-60">{saving ? 'Saving...' : 'Save Product'}</button>
              <button type="button" onClick={() => setShowProductModal(false)} className="rounded-full border border-gray-300 px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <Modal onClose={() => setShowCategoryModal(false)} title={editingCategory ? 'Edit Category' : 'New Category'}>
          <form onSubmit={handleCategorySave} className="space-y-4">
            <Input label="Category Name" value={categoryForm.name} onChange={v => setCategoryForm(f => ({ ...f, name: v }))} required />
            <Input label="Image URL" value={categoryForm.image} onChange={v => setCategoryForm(f => ({ ...f, image: v }))} />
            <div className="flex gap-3 pt-2">
              <button type="submit" className="rounded-full bg-brand-black px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose">Save</button>
              <button type="button" onClick={() => setShowCategoryModal(false)} className="rounded-full border border-gray-300 px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ─── Reusable Components ─── */
function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500">{label}</p>
          <p className="mt-1 text-xl font-bold text-brand-black">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full sm:max-w-lg overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
    </div>
  );
}
