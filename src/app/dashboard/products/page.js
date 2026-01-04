'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Filter,
  Check,
  Eye
} from 'lucide-react';
import { getProducts, getCategories } from '@/app/actions/productActions';
import Sparkline from '@/components/dashboard/products/Sparkline';
import AddProductDialog from '@/components/dashboard/products/AddProductDialog';
import ProductDrawer from '@/components/dashboard/products/ProductDrawer';
import CategoryManager from '@/components/dashboard/products/CategoryManager';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'categories'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilters, setStockFilters] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchCategories = useCallback(async () => {
     const cats = await getCategories();
     setCategories(cats || []);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const productsRes = await getProducts({
        page: currentPage,
        limit,
        search: searchTerm,
        categoryId: selectedCategory,
        stockStatus: stockFilters
      });

      setProducts(productsRes.products || []);
      setTotalCount(productsRes.totalCount || 0);

    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage, selectedCategory, stockFilters]);

  // Initial Data Load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Active Tab Logic
  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab, fetchProducts]);


  const handleStockFilterChange = (status) => {
    setCurrentPage(1);
    setStockFilters(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleCategoryChange = (e) => {
    setCurrentPage(1);
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setCurrentPage(1);
    setSearchTerm(e.target.value);
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalCount / limit)) {
      setCurrentPage(newPage);
    }
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product catalog, categories, and inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'products' && (
            <button
               onClick={() => setIsAddOpen(true)}
               className="flex items-center gap-2 px-4 py-2 bg-[#8A63D2] text-white rounded-full font-medium text-sm hover:bg-[#7854bc] transition-colors shadow-sm hover:shadow-md"
            >
              <Plus size={18} />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'products'
                ? 'border-[#8A63D2] text-[#8A63D2]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-[#8A63D2] text-[#8A63D2]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Categories
          </button>
        </nav>
      </div>

      {/* Content: Categories */}
      {activeTab === 'categories' && (
        <CategoryManager categories={categories} onUpdate={fetchCategories} />
      )}

      {/* Content: Products */}
      {activeTab === 'products' && (
        <>
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">

                {/* Search */}
                <div className="relative w-full md:w-96">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-[#8A63D2]/20 focus:outline-none"
                />
                </div>

                {/* Filters */}
                <div className="relative">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    isFilterOpen || stockFilters.length > 0 || selectedCategory !== 'all'
                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    <Filter size={16} />
                    Filters
                    {(stockFilters.length > 0 || selectedCategory !== 'all') && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                        {stockFilters.length + (selectedCategory !== 'all' ? 1 : 0)}
                    </span>
                    )}
                </button>

                {/* Filter Dropdown */}
                {isFilterOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900 text-sm">Filters</h3>
                        <button
                        onClick={() => { setStockFilters([]); setSelectedCategory('all'); setCurrentPage(1); setIsFilterOpen(false); }}
                        className="text-xs text-gray-400 hover:text-gray-600"
                        >
                        Reset
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Stock Status */}
                        <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Stock</h4>
                        <div className="space-y-2">
                            {['Overflow Stock', 'Low Stock', 'Out Of Stock'].map(status => (
                            <label key={status} className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                stockFilters.includes(status) ? 'bg-[#8A63D2] border-[#8A63D2]' : 'border-gray-300 bg-white group-hover:border-[#8A63D2]'
                                }`}>
                                {stockFilters.includes(status) && <Check size={12} className="text-white" />}
                                </div>
                                <input
                                type="checkbox"
                                className="hidden"
                                checked={stockFilters.includes(status)}
                                onChange={() => handleStockFilterChange(status)}
                                />
                                <span className="text-sm text-gray-700">{status}</span>
                            </label>
                            ))}
                        </div>
                        </div>

                        {/* Categories */}
                        <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</h4>
                        <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A63D2]/20"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="px-4 py-2 bg-[#8A63D2] text-white text-xs font-medium rounded-lg hover:bg-[#7854bc]"
                        >
                            Done
                        </button>
                    </div>
                    </div>
                )}
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        <th className="px-6 py-4 rounded-tl-2xl">Product</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Analytics (7 Days)</th>
                        <th className="px-6 py-4 rounded-tr-2xl text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        // Skeleton Loader
                        [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                            <td className="px-6 py-4"><div className="h-10 w-40 bg-gray-100 rounded-lg"></div></td>
                            <td className="px-6 py-4"><div className="h-6 w-24 bg-gray-100 rounded"></div></td>
                            <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-100 rounded"></div></td>
                            <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-100 rounded"></div></td>
                            <td className="px-6 py-4"><div className="h-8 w-24 bg-gray-100 rounded"></div></td>
                            <td className="px-6 py-4"></td>
                        </tr>
                        ))
                    ) : products.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                            No products found.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                        <tr
                            key={product.id}
                            className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedProduct(product)}
                        >
                            <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                <img src={product.image_url || 'https://via.placeholder.com/40'} alt="" className="h-full w-full object-cover" />
                                </div>
                                <div>
                                <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                                <div className="text-xs text-gray-400">ID: {product.id}</div>
                                </div>
                            </div>
                            </td>
                            <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{product.categoryName}</span>
                            </td>
                            <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-900">{product.stock}</span>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${
                                    product.stockStatus === 'Out Of Stock' ? 'bg-red-50 text-red-600' :
                                    product.stockStatus === 'Low Stock' ? 'bg-orange-50 text-orange-600' :
                                    'bg-green-50 text-green-600'
                                }`}>
                                    {product.stockStatus}
                                </span>
                            </div>
                            </td>
                            <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-900">${Number(product.price).toFixed(2)}</span>
                            </td>
                            <td className="px-6 py-4">
                            <Sparkline data={product.analytics} />
                            </td>
                            <td className="px-6 py-4 text-right">
                            <button className="p-2 text-gray-400 hover:text-[#8A63D2] transition-colors" onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(product);
                            }}>
                                <Eye size={18} />
                            </button>
                            </td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
                </div>

                {/* Pagination */}
                {!loading && totalCount > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} entries</span>
                    <div className="flex gap-2">
                        <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        Previous
                        </button>
                        <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                            .map((p, i, arr) => (
                                <div key={p} className="flex">
                                {i > 0 && arr[i-1] !== p - 1 && <span className="px-2">...</span>}
                                <button
                                    onClick={() => handlePageChange(p)}
                                    className={`px-3 py-1 rounded ${currentPage === p ? 'bg-[#8A63D2] text-white' : 'border hover:bg-gray-50'}`}
                                >
                                    {p}
                                </button>
                                </div>
                            ))
                        }
                        </div>
                        <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        Next
                        </button>
                    </div>
                </div>
                )}
            </div>
        </>
      )}

      <AddProductDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onProductAdded={fetchProducts}
        categories={categories}
      />

      <ProductDrawer
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

    </div>
  );
}
