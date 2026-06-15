import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Grid, List, SlidersHorizontal, ChevronRight, Search, Sparkles } from 'lucide-react';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFallbackImage, getProductImage } from '../utils/imageUtils';
import { DEMO_PRODUCTS } from '../utils/demoData';

export default function ProductsPage() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('products-view-mode') || 'grid');

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 3000 });
  const [stockStatus, setStockStatus] = useState(searchParams.get('stockStatus') || 'all'); // 'all', 'in-stock'
  const [onSale, setOnSale] = useState(searchParams.get('onSale') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'latest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { formatPrice } = useCurrency();

  // Load categories on boot
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data || []))
      .catch(err => console.error(err));
  }, []);

  // Sync route parameters with state
  useEffect(() => {
    setSelectedCategory(categorySlug || searchParams.get('category') || '');
    setSearchQuery(searchParams.get('search') || '');
    setOnSale(searchParams.get('onSale') === 'true' || location.pathname === '/sale');
  }, [categorySlug, searchParams]);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory) queryParams.append('category', selectedCategory);
        if (priceRange.min > 0) queryParams.append('priceMin', priceRange.min);
        if (priceRange.max < 3000) queryParams.append('priceMax', priceRange.max);
        if (stockStatus === 'in-stock') queryParams.append('stockStatus', 'in-stock');
        if (onSale || location.pathname === '/sale') queryParams.append('onSale', 'true');
        if (sortBy) queryParams.append('sort', sortBy);
        if (searchQuery) queryParams.append('search', searchQuery);
        queryParams.append('page', page);
        queryParams.append('limit', 12);

        const { data } = await api.get(`/products?${queryParams.toString()}`);
        if (data && data.products && data.products.length > 0) {
          setProducts(data.products);
          setTotalPages(data.pages || 1);
          setTotalProducts(data.total || data.products.length);
        } else {
          console.warn('Backend API returned empty products. Using fallback DEMO_PRODUCTS.');
          setProducts(DEMO_PRODUCTS);
          setTotalPages(1);
          setTotalProducts(DEMO_PRODUCTS.length);
        }
      } catch (err) {
        console.warn('Backend API failed to load products. Using fallback DEMO_PRODUCTS.', err);
        setProducts(DEMO_PRODUCTS);
        setTotalPages(1);
        setTotalProducts(DEMO_PRODUCTS.length);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, priceRange, stockStatus, onSale, sortBy, searchQuery, page, categorySlug]);

  const handlePriceChange = (e) => {
    setPriceRange({ ...priceRange, max: Number(e.target.value) });
    setPage(1);
  };

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    setPage(1);
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
  };

  const activeCategoryName = categories.find(c => c.slug === selectedCategory)?.name || '';

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen font-sans">
      
      {/* Header & Breadcrumbs */}
      <div className="bg-rose-100/50 py-10 border-b border-rose-200/30 mb-12">
        <div className="mx-auto max-w-7xl px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-brand-gray uppercase tracking-wider font-light mb-4">
            <Link to="/" className="hover:text-brand-rose transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-rose-300" />
            <Link to="/products" className="hover:text-brand-rose transition">Products</Link>
            {activeCategoryName && (
              <>
                <ChevronRight className="w-3 h-3 text-rose-300" />
                <span className="text-brand-black">{activeCategoryName}</span>
              </>
            )}
            {location.pathname === '/sale' && (
              <>
                <ChevronRight className="w-3 h-3 text-rose-300" />
                <span className="text-brand-black">Boutique Sale</span>
              </>
            )}
          </div>

          <h1 className="font-serif text-3xl md:text-5xl text-brand-black capitalize leading-none tracking-[0.04em]">
            {location.pathname === '/sale' ? 'Boutique Sale' : activeCategoryName || 'Shop All Creations'}
          </h1>
          <p className="text-sm text-brand-gray font-light mt-3 max-w-2xl leading-relaxed">
            Browse our curated preserved flower collections, from gift-ready boxes to statement interiors inspired by the calm elegance of IN BLOOM.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="lg:hidden flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-brand-black border border-rose-200 py-3 px-4 w-full justify-center"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-rose" />
          {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Left Sidebar: Filters */}
        <aside className={`lg:col-span-1 space-y-8 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <h3 className="font-sans text-xs uppercase tracking-widest font-medium text-brand-black flex items-center gap-2">
              <SlidersHorizontal className="w-4.5 h-4.5 text-brand-rose" /> Filter Collections
            </h3>
            {(selectedCategory || priceRange.max < 3000 || stockStatus !== 'all' || onSale || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setPriceRange({ min: 0, max: 3000 });
                  setStockStatus('all');
                  setOnSale(false);
                  setSearchQuery('');
                  setPage(1);
                  setSearchParams({});
                }}
                className="text-[10px] uppercase tracking-wider text-brand-rose hover:text-brand-black transition"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-brand-black">Category</h4>
            <div className="space-y-1.5 text-sm font-light text-brand-gray">
              <button
                onClick={() => handleCategorySelect('')}
                className={`block w-full text-left transition ${
                  selectedCategory === '' ? 'text-brand-rose font-medium pl-1' : 'hover:text-brand-black'
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`block w-full text-left transition ${
                    selectedCategory === cat.slug ? 'text-brand-rose font-medium pl-1' : 'hover:text-brand-black'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-brand-black">
              <span>Price Range</span>
              <span className="text-brand-rose font-light">{formatPrice(priceRange.max)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={priceRange.max}
              onChange={handlePriceChange}
              className="w-full accent-brand-rose bg-rose-100 cursor-pointer h-1.5 rounded-full"
            />
            <div className="flex items-center justify-between text-xs text-brand-gray font-light">
              <span>AED 0</span>
              <span>AED 3,000+</span>
            </div>
          </div>

          {/* Stock Status Filter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-brand-black">Availability</h4>
            <div className="space-y-2 text-sm font-light text-brand-gray">
              <label className="flex items-center gap-2.5 cursor-pointer hover:text-brand-black select-none">
                <input
                  type="checkbox"
                  checked={stockStatus === 'in-stock'}
                  onChange={(e) => {
                    setStockStatus(e.target.checked ? 'in-stock' : 'all');
                    setPage(1);
                  }}
                  className="rounded border-rose-300 text-brand-rose focus:ring-brand-rose"
                />
                <span>In Stock Only</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer hover:text-brand-black select-none">
                <input
                  type="checkbox"
                  checked={onSale}
                  onChange={(e) => {
                    setOnSale(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded border-rose-300 text-brand-rose focus:ring-brand-rose"
                />
                <span>On Sale / Special Offer</span>
              </label>
            </div>
          </div>

        </aside>

        {/* Right Side: Product Listing */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-rose-100 pb-4 text-sm font-light text-brand-gray">
            
            {/* Left: Product count */}
            <div>
              Showing <span className="font-medium text-brand-black">{totalProducts}</span> creations
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              
              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="border border-rose-200 py-1.5 px-3 bg-transparent outline-none focus:border-brand-black text-brand-black rounded"
                >
                  <option value="latest">Latest Arrivals</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="popularity">Popularity / Rating</option>
                </select>
              </div>

              {/* Grid/List layout switcher */}
              <div className="flex border border-rose-200 rounded overflow-hidden">
                <button
                  onClick={() => { setViewMode('grid'); localStorage.setItem('products-view-mode', 'grid'); }}
                  className={`p-2 transition ${viewMode === 'grid' ? 'bg-brand-rose text-white' : 'hover:bg-rose-50 text-brand-gray'}`}
                  aria-label="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setViewMode('list'); localStorage.setItem('products-view-mode', 'list'); }}
                  className={`p-2 transition ${viewMode === 'list' ? 'bg-brand-rose text-white' : 'hover:bg-rose-50 text-brand-gray'}`}
                  aria-label="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Search bar inside content for convenience */}
          <div className="relative font-light text-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search boutique collections..."
              className="w-full border border-rose-200 focus:border-brand-black py-2.5 pl-10 pr-4 outline-none rounded bg-rose-50/20"
            />
            <Search className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-300" />
          </div>

          {/* Product Feed */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col space-y-3 bg-rose-50/30 p-4 border border-rose-100 rounded-lg">
                  <div className="bg-rose-100 aspect-[4/5] w-full rounded"></div>
                  <div className="h-4 bg-rose-100 w-1/3 rounded"></div>
                  <div className="h-5 bg-rose-100 w-3/4 rounded"></div>
                  <div className="h-4 bg-rose-100 w-1/4 rounded"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product, idx) => (
                  <ProductCard key={product._id} product={product} index={idx} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => {
                  const hasSale = product.salePrice !== undefined && product.salePrice !== null;
                  const currentPrice = hasSale ? product.salePrice : product.price;
                  return (
                    <div
                      key={product._id}
                      className="border border-rose-100 p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center bg-white hover:bg-rose-50/10 hover-lift overflow-hidden"
                    >
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        loading="lazy"
                        className="w-full sm:w-40 aspect-[4/5] object-cover bg-rose-50 rounded"
                      />
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <span className="text-[10px] uppercase tracking-widest text-brand-rose block">{product.category?.name}</span>
                        <h3 className="font-serif text-xl text-brand-black">{product.name}</h3>
                        <p className="text-xs text-brand-gray font-light leading-relaxed max-w-xl">
                          {product.description?.slice(0, 150)}...
                        </p>
                        <div className="pt-2">
                          {hasSale ? (
                            <div className="flex items-center gap-2 justify-center sm:justify-start">
                              <span className="text-xs text-brand-gray line-through font-light">{formatPrice(product.price)}</span>
                              <span className="text-sm font-medium text-brand-red">{formatPrice(product.salePrice)}</span>
                            </div>
                          ) : (
                            <span className="text-sm font-medium text-brand-black">{formatPrice(product.price)}</span>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0 flex sm:flex-col gap-2">
                        <Link
                          to={`/product/${product.slug}`}
                          className="border border-rose-200 text-brand-black text-xs uppercase tracking-widest py-3 px-6 font-medium hover:bg-rose-50 transition w-full text-center"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="text-center py-20 border border-dashed border-rose-200 rounded bg-rose-50/10">
              <Sparkles className="w-10 h-10 text-brand-rose mx-auto mb-4 animate-bounce" />
              <h3 className="font-serif text-xl text-brand-black">No creations match filters</h3>
              <p className="text-sm text-brand-gray font-light mt-2 max-w-sm mx-auto">Try clearing search keyword or modifying price threshold slider.</p>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setPriceRange({ min: 0, max: 3000 });
                  setStockStatus('all');
                  setOnSale(false);
                  setSearchQuery('');
                  setPage(1);
                  setSearchParams({});
                }}
                className="mt-6 bg-brand-black text-white hover:bg-brand-rose text-xs uppercase tracking-widest py-3 px-8 font-medium transition"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-12 border-t border-rose-100 font-sans text-sm font-light">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="border border-rose-200 py-1.5 px-4 hover:bg-rose-50 disabled:opacity-50 disabled:pointer-events-none transition"
              >
                Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="border border-rose-200 py-1.5 px-4 hover:bg-rose-50 disabled:opacity-50 disabled:pointer-events-none transition"
              >
                Next
              </button>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
