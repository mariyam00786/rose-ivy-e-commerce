import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { getProductImage, getCategoryImage } from '../utils/imageUtils';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FiLogOut, FiMenu, FiX, FiHome } from 'react-icons/fi';
import { Badge, Modal, StatCard, Skeleton } from '../components/ui';

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
  { id: 'blog', label: 'Blog', icon: '📝' },
  { id: 'coupons', label: 'Coupons', icon: '🎟️' },
  { id: 'upload', label: 'Upload', icon: '📷' },
];

export default function AdminPage() {
  const [tab, setTab] = useState('overview');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search states
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');

  // Product modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', salePrice: '', stock: '10', category: '', tags: '', images: [] });
  const [saving, setSaving] = useState(false);
  const [productImageUploading, setProductImageUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', image: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryImageUploading, setCategoryImageUploading] = useState(false);

  // Blog modal
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogForm, setBlogForm] = useState({ title: '', content: '', image: '', category: '', author: '' });
  const [savingBlog, setSavingBlog] = useState(false);

  // Coupon modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'percentage', discountValue: '', minOrder: '', expiresAt: '', usageLimit: '' });
  const [savingCoupon, setSavingCoupon] = useState(false);

  // Order detail
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Upload
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploadMsg, setUploadMsg] = useState('');

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

  useEffect(() => {
    if (tab === 'overview') fetchStats();
    if (tab === 'products') fetchProducts();
    if (tab === 'orders') fetchOrders();
    if (tab === 'categories') fetchCategories();
    if (tab === 'users') fetchUsers();
    if (tab === 'blog') fetchBlogs();
    if (tab === 'coupons') fetchCoupons();
  }, [tab]);

  // API error handler with 401 redirect
  const handleApiError = (err, fallbackMsg) => {
    if (err.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      logout();
      navigate('/admin/login');
      return;
    }
    toast.error(err.response?.data?.message || fallbackMsg);
  };

  const fetchStats = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/stats'); setStats(data); }
    catch (err) { handleApiError(err, 'Failed to load stats'); setStats(null); }
    finally { setLoading(false); }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([api.get('/products'), api.get('/categories')]);
      setProducts(p.data.products || p.data || []);
      setCategories(c.data || []);
    } catch (err) { handleApiError(err, 'Failed to load products'); setProducts([]); }
    finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/orders'); setOrders(data || []); }
    catch (err) { handleApiError(err, 'Failed to load orders'); setOrders([]); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try { const { data } = await api.get('/categories'); setCategories(data || []); }
    catch (err) { handleApiError(err, 'Failed to load categories'); setCategories([]); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/users'); setUsers(data || []); }
    catch (err) { handleApiError(err, 'Failed to load users'); setUsers([]); }
    finally { setLoading(false); }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try { const { data } = await api.get('/blog'); setBlogs(data || []); }
    catch (err) { handleApiError(err, 'Failed to load blogs'); setBlogs([]); }
    finally { setLoading(false); }
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try { const { data } = await api.get('/coupons'); setCoupons(data || []); }
    catch { setCoupons([]); }
    finally { setLoading(false); }
  };

  // ─── Product CRUD ───
  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: '', salePrice: '', stock: '10', category: categories[0]?._id || '', tags: '', images: [] });
    setImageUrlInput('');
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
    setImageUrlInput('');
    setShowProductModal(true);
  };

  const handleProductSave = async (e) => {
    e.preventDefault();

    // Validate sale price
    if (productForm.salePrice && Number(productForm.salePrice) >= Number(productForm.price)) {
      toast.error('Sale price must be less than the regular price');
      return;
    }

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
        toast.success('Product updated!');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Product created!');
      }
      setShowProductModal(false);
      fetchProducts();
    } catch (err) {
      handleApiError(err, 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDeleteProduct = (id) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      onConfirm: async () => {
        try { await api.delete(`/admin/products/${id}`); fetchProducts(); toast.success('Product deleted'); }
        catch (err) { handleApiError(err, 'Failed to delete product'); }
        finally { setConfirmDialog(d => ({ ...d, open: false })); }
      },
    });
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
      toast.success('Images uploaded!');
    } catch (err) {
      handleApiError(err, 'Image upload failed');
    } finally {
      setProductImageUploading(false);
    }
  };

  // Add image URL manually (separated from upload)
  const handleAddImageUrl = () => {
    const urls = imageUrlInput.split(',').map(s => s.trim()).filter(Boolean);
    if (urls.length) {
      setProductForm(f => ({ ...f, images: [...f.images, ...urls] }));
      setImageUrlInput('');
    }
  };

  // ─── Order ───
  const handleOrderStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}`, { status });
      fetchOrders();
      toast.success(`Order marked as ${status}`);
    } catch (err) { handleApiError(err, 'Failed to update order'); }
  };

  // ─── Category CRUD ───
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
        toast.success('Category updated!');
      } else {
        await api.post('/admin/categories', categoryForm);
        toast.success('Category created!');
      }
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err) { handleApiError(err, 'Failed to save category'); }
  };

  const handleCategoryImageUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;
    setCategoryImageUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(f => formData.append('images', f));
    try {
      const { data } = await api.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const url = data.urls?.[0];
      if (url) setCategoryForm(f => ({ ...f, image: url }));
      toast.success('Image uploaded!');
    } catch (err) { handleApiError(err, 'Image upload failed'); }
    finally { setCategoryImageUploading(false); }
  };

  const handleDeleteCategory = (id) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category?',
      onConfirm: async () => {
        try { await api.delete(`/admin/categories/${id}`); fetchCategories(); toast.success('Category deleted'); }
        catch (err) { handleApiError(err, 'Failed to delete category'); }
        finally { setConfirmDialog(d => ({ ...d, open: false })); }
      },
    });
  };

  // ─── Blog CRUD ───
  const handleBlogSave = async (e) => {
    e.preventDefault();
    setSavingBlog(true);
    try {
      await api.post('/admin/blog', blogForm);
      toast.success('Blog post created!');
      setShowBlogModal(false);
      setBlogForm({ title: '', content: '', image: '', category: '', author: '' });
      fetchBlogs();
    } catch (err) { handleApiError(err, 'Failed to save blog'); }
    finally { setSavingBlog(false); }
  };

  // ─── Coupon CRUD ───
  const handleCouponSave = async (e) => {
    e.preventDefault();
    setSavingCoupon(true);
    try {
      await api.post('/coupons', {
        ...couponForm,
        discountValue: Number(couponForm.discountValue),
        minOrder: Number(couponForm.minOrder) || 0,
        usageLimit: Number(couponForm.usageLimit) || 100,
      });
      toast.success('Coupon created!');
      setShowCouponModal(false);
      setCouponForm({ code: '', discountType: 'percentage', discountValue: '', minOrder: '', expiresAt: '', usageLimit: '' });
      fetchCoupons();
    } catch (err) { handleApiError(err, 'Failed to save coupon'); }
    finally { setSavingCoupon(false); }
  };

  // ─── Upload ───
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) { toast.error('Select image files first.'); return; }
    setUploading(true); setUploadMsg('');
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    try {
      const { data } = await api.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploadedUrls(data.urls || []);
      setUploadMsg(`Uploaded ${data.files?.length || 0} image(s) successfully.`);
      setFiles([]);
      toast.success('Upload complete!');
    } catch (err) { handleApiError(err, 'Upload failed'); }
    finally { setUploading(false); }
  };

  // ─── Filtered data ───
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.category?.name || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const matchesSearch = !orderSearch || 
      o._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.user?.name || o.userId?.name || '').toLowerCase().includes(orderSearch.toLowerCase());
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-[#f9f5f3]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-rose-100 shadow-lg transition-transform duration-300 md:relative md:translate-x-0 md:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-rose-100">
          <div>
            <h2 className="text-base font-semibold tracking-wide text-brand-black">Rose & Ivy</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-0.5">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded-lg hover:bg-gray-100">
            <FiX size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => { setTab(n.id); setSidebarOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${tab === n.id ? 'bg-rose-100 font-semibold text-brand-black shadow-sm' : 'text-gray-600 hover:bg-rose-50 hover:text-brand-black'}`}>
              <span className="text-base">{n.icon}</span><span>{n.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer - User info */}
        <div className="border-t border-rose-100 px-4 py-4 space-y-3">
          {/* Back to Store */}
          <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:bg-rose-50 hover:text-brand-black transition">
            <FiHome size={16} /><span>Back to Store</span>
          </Link>
          {/* User Info */}
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="h-8 w-8 rounded-full bg-brand-rose/20 flex items-center justify-center text-xs font-semibold text-brand-black">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-black truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur-sm px-4 md:px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <FiMenu size={20} className="text-gray-700" />
            </button>
            <h1 className="text-lg md:text-xl font-semibold tracking-wide text-brand-black">
              {{ overview: 'Dashboard Overview', products: 'Products', orders: 'Orders', categories: 'Categories', users: 'Customers', blog: 'Blog Posts', coupons: 'Coupons', upload: 'Upload Images' }[tab] || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {tab === 'products' && (
              <button onClick={openNewProduct} className="rounded-full bg-brand-black px-4 py-2 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose transition">+ New Product</button>
            )}
            {tab === 'categories' && (
              <button onClick={openNewCategory} className="rounded-full bg-brand-black px-4 py-2 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose transition">+ New Category</button>
            )}
            {tab === 'blog' && (
              <button onClick={() => setShowBlogModal(true)} className="rounded-full bg-brand-black px-4 py-2 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose transition">+ New Post</button>
            )}
            {tab === 'coupons' && (
              <button onClick={() => setShowCouponModal(true)} className="rounded-full bg-brand-black px-4 py-2 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose transition">+ New Coupon</button>
            )}
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md hover:bg-red-600 transition z-10"
            >
              <FiLogOut size={14} /><span>Logout</span>
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 lg:p-8">

        {/* ─── OVERVIEW ─── */}
        {tab === 'overview' && (
          <div>
            {loading ? <Skeleton count={4} /> : stats ? (
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
            {/* Search */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="w-full max-w-md rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-rose focus:outline-none"
              />
            </div>
            {loading ? <Skeleton count={3} /> : (
              <>
                <p className="mt-3 text-xs text-gray-400">{filteredProducts.length} product(s)</p>
                {/* Desktop table */}
                <div className="mt-3 hidden md:block overflow-x-auto rounded-2xl border border-rose-100 bg-white shadow-sm">
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
                      {filteredProducts.map(p => (
                        <tr key={p._id} className="border-b border-rose-50 hover:bg-rose-50/30">
                          <td className="px-4 py-3"><img src={getProductImage(p)} alt="" className="h-10 w-10 rounded-lg object-cover" /></td>
                          <td className="px-4 py-3 font-medium">{p.name}</td>
                          <td className="px-4 py-3 text-gray-600">{p.category?.name || '—'}</td>
                          <td className="px-4 py-3">{fmt(p.price)}{p.salePrice && <span className="ml-1 text-xs text-green-600">{fmt(p.salePrice)}</span>}</td>
                          <td className="px-4 py-3"><span className={p.stock <= 0 ? 'text-red-500 font-semibold' : p.stock < 5 ? 'text-yellow-600' : ''}>{p.stock}</span></td>
                          <td className="px-4 py-3">
                            <button onClick={() => openEditProduct(p)} className="mr-2 text-blue-600 hover:underline">Edit</button>
                            <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 hover:underline">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredProducts.length === 0 && <p className="p-6 text-center text-gray-400">No products found.</p>}
                </div>
                {/* Mobile cards */}
                <div className="mt-3 md:hidden space-y-3">
                  {filteredProducts.map(p => (
                    <div key={p._id} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={getProductImage(p)} alt="" className="h-12 w-12 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.category?.name || '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">{fmt(p.price)}</span>
                          {p.salePrice && <span className="text-xs text-green-600">{fmt(p.salePrice)}</span>}
                          <span className="text-xs text-gray-400">Stock: {p.stock}</span>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => openEditProduct(p)} className="text-xs text-blue-600 font-medium">Edit</button>
                          <button onClick={() => handleDeleteProduct(p._id)} className="text-xs text-red-500 font-medium">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── ORDERS ─── */}
        {tab === 'orders' && !selectedOrder && (
          <div>
            {/* Search & Filter */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search by ID or customer..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                className="flex-1 max-w-md rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-rose focus:outline-none"
              />
              <select
                value={orderFilter}
                onChange={e => setOrderFilter(e.target.value)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            {loading ? <Skeleton count={3} /> : (
              <>
                <p className="mt-3 text-xs text-gray-400">{filteredOrders.length} order(s)</p>
                {/* Desktop table */}
                <div className="mt-3 hidden md:block overflow-x-auto rounded-2xl border border-rose-100 bg-white shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="border-b border-rose-100 bg-rose-50/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Order ID</th>
                        <th className="px-4 py-3 text-left font-medium">Customer</th>
                        <th className="px-4 py-3 text-left font-medium">Date</th>
                        <th className="px-4 py-3 text-left font-medium">Total</th>
                        <th className="px-4 py-3 text-left font-medium">Payment</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o._id} className="border-b border-rose-50 hover:bg-rose-50/30">
                          <td className="px-4 py-3 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                          <td className="px-4 py-3">{o.user?.name || o.userId?.name || '—'}</td>
                          <td className="px-4 py-3 text-gray-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3 font-medium">{fmt(o.total || o.totalPrice)}</td>
                          <td className="px-4 py-3"><Badge label={o.paymentStatus} variant={o.paymentStatus} /></td>
                          <td className="px-4 py-3">
                            <select value={o.status} onChange={e => handleOrderStatus(o._id, e.target.value)} className="rounded-lg border border-gray-200 px-2 py-1 text-xs">
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => setSelectedOrder(o)} className="text-blue-600 hover:underline text-xs">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && <p className="p-6 text-center text-gray-400">No orders found.</p>}
                </div>
                {/* Mobile cards */}
                <div className="mt-3 md:hidden space-y-3">
                  {filteredOrders.map(o => (
                    <div key={o._id} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm" onClick={() => setSelectedOrder(o)}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-semibold">#{o._id.slice(-8).toUpperCase()}</span>
                        <span className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">{o.user?.name || o.userId?.name || '—'}</span>
                        <span className="text-sm font-semibold">{fmt(o.total || o.totalPrice)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge label={o.paymentStatus} variant={o.paymentStatus} />
                        <Badge label={o.status} variant={o.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── ORDER DETAIL ─── */}
        {tab === 'orders' && selectedOrder && (
          <div>
            <button onClick={() => setSelectedOrder(null)} className="mb-4 text-sm text-blue-600 hover:underline">← Back to Orders</button>
            <h1 className="text-2xl font-semibold tracking-wide mb-6">Order #{selectedOrder._id.slice(-8).toUpperCase()}</h1>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Order Info */}
              <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold mb-3">Order Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Customer</span><span>{selectedOrder.user?.name || selectedOrder.userId?.name || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{selectedOrder.user?.email || selectedOrder.userId?.email || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{new Date(selectedOrder.createdAt).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Payment Method</span><span className="capitalize">{selectedOrder.paymentMethod || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Payment Status</span><Badge label={selectedOrder.paymentStatus} variant={selectedOrder.paymentStatus} /></div>
                  <div className="flex justify-between"><span className="text-gray-500">Order Status</span><Badge label={selectedOrder.status} variant={selectedOrder.status} /></div>
                  <div className="flex justify-between font-semibold border-t pt-2 mt-2"><span>Total</span><span>{fmt(selectedOrder.total || selectedOrder.totalPrice)}</span></div>
                  {selectedOrder.discountCode && <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="text-green-600">-{fmt(selectedOrder.discountAmount)} ({selectedOrder.discountCode})</span></div>}
                </div>
                {/* Update status */}
                <div className="mt-4 pt-4 border-t">
                  <label className="text-xs font-medium text-gray-600 block mb-1">Update Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={e => { handleOrderStatus(selectedOrder._id, e.target.value); setSelectedOrder(s => ({ ...s, status: e.target.value })); }}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                {selectedOrder.shippingAddress ? (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                    <p>{selectedOrder.shippingAddress.addressLine1}</p>
                    {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}</p>
                    <p>{selectedOrder.shippingAddress.phone}</p>
                  </div>
                ) : <p className="text-sm text-gray-400">No address provided</p>}
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
              <h3 className="font-semibold mb-3">Items ({(selectedOrder.items || selectedOrder.orderItems || []).length})</h3>
              <div className="space-y-3">
                {(selectedOrder.items || selectedOrder.orderItems || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name || item.product?.name || 'Product'}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity || item.qty}</p>
                    </div>
                    <span className="text-sm font-medium">{fmt(item.price * (item.quantity || item.qty || 1))}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── CATEGORIES ─── */}
        {tab === 'categories' && (
          <div>
            {loading ? <Skeleton count={3} /> : (
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
            {loading ? <Skeleton count={3} /> : (
              <>
                <div className="mt-6 hidden md:block overflow-x-auto rounded-2xl border border-rose-100 bg-white shadow-sm">
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
                          <td className="px-4 py-3"><Badge label={u.role} variant={u.role} /></td>
                          <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && <p className="p-6 text-center text-gray-400">No users found.</p>}
                </div>
                <div className="mt-6 md:hidden space-y-3">
                  {users.map(u => (
                    <div key={u._id} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{u.name}</span>
                        <Badge label={u.role} variant={u.role} />
                      </div>
                      <p className="text-xs text-gray-500">{u.email}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── BLOG ─── */}
        {tab === 'blog' && (
          <div>
            {loading ? <Skeleton count={2} /> : (
              <div className="mt-6 space-y-4">
                {blogs.map(b => (
                  <div key={b._id} className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                    {b.image && <img src={b.image} alt="" className="h-16 w-24 rounded-xl object-cover" />}
                    <div className="flex-1">
                      <p className="font-medium">{b.title}</p>
                      <p className="text-xs text-gray-400">{b.category} · {b.author} · {new Date(b.publishedAt || b.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {blogs.length === 0 && <p className="text-gray-400">No blog posts yet.</p>}
              </div>
            )}
          </div>
        )}

        {/* ─── COUPONS ─── */}
        {tab === 'coupons' && (
          <div>
            {loading ? <Skeleton count={2} /> : (
              <>
                {/* Desktop table */}
                <div className="mt-6 hidden md:block overflow-x-auto rounded-2xl border border-rose-100 bg-white shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="border-b border-rose-100 bg-rose-50/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Code</th>
                        <th className="px-4 py-3 text-left font-medium">Discount</th>
                        <th className="px-4 py-3 text-left font-medium">Min Order</th>
                        <th className="px-4 py-3 text-left font-medium">Expires</th>
                        <th className="px-4 py-3 text-left font-medium">Usage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map(c => (
                        <tr key={c._id} className="border-b border-rose-50 hover:bg-rose-50/30">
                          <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                          <td className="px-4 py-3">{c.discountType === 'percentage' ? `${c.discountValue}%` : fmt(c.discountValue)}</td>
                          <td className="px-4 py-3">{fmt(c.minOrder)}</td>
                          <td className="px-4 py-3 text-gray-600">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                          <td className="px-4 py-3">{c.usageCount || 0} / {c.usageLimit || '∞'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {coupons.length === 0 && <p className="p-6 text-center text-gray-400">No coupons yet.</p>}
                </div>
                {/* Mobile cards */}
                <div className="mt-6 md:hidden space-y-3">
                  {coupons.map(c => (
                    <div key={c._id} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm font-semibold">{c.code}</span>
                        <span className="text-sm font-medium text-brand-rose">{c.discountType === 'percentage' ? `${c.discountValue}%` : fmt(c.discountValue)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Min: {fmt(c.minOrder)}</span>
                        <span>Usage: {c.usageCount || 0} / {c.usageLimit || '∞'}</span>
                      </div>
                      <p className="mt-1 text-[10px] text-gray-400">Expires: {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</p>
                    </div>
                  ))}
                  {coupons.length === 0 && <p className="text-center text-gray-400">No coupons yet.</p>}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── UPLOAD ─── */}
        {tab === 'upload' && (
          <div>
            <p className="mt-1 text-sm text-gray-500">JPG, PNG, WEBP · Max 5 files, 5 MB each.</p>
            <form onSubmit={handleUpload} className="mt-6 space-y-4">
              <div className="rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/50 p-6 text-center">
                <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={e => setFiles(Array.from(e.target.files || []))} className="block w-full text-sm" />
                {files.length > 0 && <p className="mt-2 text-xs text-gray-500">{files.length} file(s) selected</p>}
              </div>
              <button type="submit" disabled={uploading} className="rounded-full bg-brand-black px-6 py-3 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose disabled:opacity-60">{uploading ? 'Uploading…' : 'Upload'}</button>
            </form>
            {uploadMsg && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm">{uploadMsg}</p>}
            {uploadedUrls.length > 0 && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {uploadedUrls.map(url => (
                  <div key={url} className="overflow-hidden rounded-2xl border border-rose-100">
                    <img src={url} alt="" className="h-40 w-full object-cover" />
                    <div className="flex items-center justify-between px-3 py-2">
                      <p className="break-all text-xs text-gray-600 flex-1">{url}</p>
                      <button onClick={() => { navigator.clipboard.writeText(url); toast.success('URL copied!'); }} className="ml-2 text-xs text-blue-600 hover:underline shrink-0">Copy</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </main>

      {/* ─── Product Modal ─── */}
      <Modal open={showProductModal} onClose={() => setShowProductModal(false)} title={editingProduct ? 'Edit Product' : 'New Product'}>
          <form onSubmit={handleProductSave} className="space-y-4">
            <Input label="Product Name" value={productForm.name} onChange={v => setProductForm(f => ({ ...f, name: v }))} required />
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
              <textarea rows={3} required value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input label="Price (AED)" type="number" value={productForm.price} onChange={v => setProductForm(f => ({ ...f, price: v }))} required />
              <Input label="Sale Price" type="number" value={productForm.salePrice} onChange={v => setProductForm(f => ({ ...f, salePrice: v }))} />
              <Input label="Stock" type="number" value={productForm.stock} onChange={v => setProductForm(f => ({ ...f, stock: v }))} required />
            </div>
            {productForm.salePrice && Number(productForm.salePrice) >= Number(productForm.price) && (
              <p className="text-xs text-red-500">⚠ Sale price must be less than regular price</p>
            )}
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
              <div className="flex gap-2">
                <input type="text" placeholder="Or paste image URL" value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm" />
                <button type="button" onClick={handleAddImageUrl} className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-medium hover:bg-gray-200">Add</button>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="rounded-full bg-brand-black px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose disabled:opacity-60">{saving ? 'Saving...' : 'Save Product'}</button>
              <button type="button" onClick={() => setShowProductModal(false)} className="rounded-full border border-gray-300 px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
      </Modal>

      {/* ─── Category Modal ─── */}
      <Modal open={showCategoryModal} onClose={() => setShowCategoryModal(false)} title={editingCategory ? 'Edit Category' : 'New Category'}>
          <form onSubmit={handleCategorySave} className="space-y-4">
            <Input label="Category Name" value={categoryForm.name} onChange={v => setCategoryForm(f => ({ ...f, name: v }))} required />
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Category Image</label>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleCategoryImageUpload} className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm mb-2" />
              {categoryImageUploading && <p className="text-xs text-gray-500">Uploading...</p>}
              {categoryForm.image && (
                <div className="mt-2">
                  <img src={categoryForm.image} alt="" className="h-20 w-20 rounded-xl object-cover border" />
                </div>
              )}
              <input type="text" placeholder="Or paste image URL" value={categoryForm.image} onChange={e => setCategoryForm(f => ({ ...f, image: e.target.value }))} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="rounded-full bg-brand-black px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose">Save</button>
              <button type="button" onClick={() => setShowCategoryModal(false)} className="rounded-full border border-gray-300 px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
      </Modal>

      {/* ─── Blog Modal ─── */}
      <Modal open={showBlogModal} onClose={() => setShowBlogModal(false)} title="New Blog Post">
          <form onSubmit={handleBlogSave} className="space-y-4">
            <Input label="Title" value={blogForm.title} onChange={v => setBlogForm(f => ({ ...f, title: v }))} required />
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Content (HTML supported)</label>
              <textarea rows={5} required value={blogForm.content} onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <Input label="Image URL" value={blogForm.image} onChange={v => setBlogForm(f => ({ ...f, image: v }))} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Category" value={blogForm.category} onChange={v => setBlogForm(f => ({ ...f, category: v }))} />
              <Input label="Author" value={blogForm.author} onChange={v => setBlogForm(f => ({ ...f, author: v }))} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={savingBlog} className="rounded-full bg-brand-black px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose disabled:opacity-60">{savingBlog ? 'Saving...' : 'Publish'}</button>
              <button type="button" onClick={() => setShowBlogModal(false)} className="rounded-full border border-gray-300 px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
      </Modal>

      {/* ─── Coupon Modal ─── */}
      <Modal open={showCouponModal} onClose={() => setShowCouponModal(false)} title="New Coupon">
          <form onSubmit={handleCouponSave} className="space-y-4">
            <Input label="Coupon Code" value={couponForm.code} onChange={v => setCouponForm(f => ({ ...f, code: v.toUpperCase() }))} required />
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Discount Type</label>
              <select value={couponForm.discountType} onChange={e => setCouponForm(f => ({ ...f, discountType: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (AED)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label={couponForm.discountType === 'percentage' ? 'Discount (%)' : 'Discount (AED)'} type="number" value={couponForm.discountValue} onChange={v => setCouponForm(f => ({ ...f, discountValue: v }))} required />
              <Input label="Min Order (AED)" type="number" value={couponForm.minOrder} onChange={v => setCouponForm(f => ({ ...f, minOrder: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Expires At" type="date" value={couponForm.expiresAt} onChange={v => setCouponForm(f => ({ ...f, expiresAt: v }))} />
              <Input label="Usage Limit" type="number" value={couponForm.usageLimit} onChange={v => setCouponForm(f => ({ ...f, usageLimit: v }))} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={savingCoupon} className="rounded-full bg-brand-black px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose disabled:opacity-60">{savingCoupon ? 'Saving...' : 'Create Coupon'}</button>
              <button type="button" onClick={() => setShowCouponModal(false)} className="rounded-full border border-gray-300 px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel="Delete"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(d => ({ ...d, open: false }))}
        variant="danger"
      />
    </div>
  );
}

/* ─── Reusable Components ─── */
function Input({ label, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
    </div>
  );
}
