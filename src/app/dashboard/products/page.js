'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Check, 
  Eye,
  MoreVertical,
  Edit,
  Trash
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; 
import { syncWebsiteDataClient } from '@/lib/websiteSync';
import Sparkline from '@/components/dashboard/products/Sparkline';
import AddProductDialog from '@/components/dashboard/products/AddProductDialog';
import ProductDrawer from '@/components/dashboard/products/ProductDrawer';
import CategoryManager from '@/components/dashboard/products/CategoryManager';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('products'); 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [websiteId, setWebsiteId] = useState(null); 
  
  // Pagination State 
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilters, setStockFilters] = useState([]); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // For Drawer
  const [productToEdit, setProductToEdit] = useState(null); // For Dialog

  // Dropdown State (Simple implementation)
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Fetch Website ID once
  useEffect(() => {
    const init = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: website } = await supabase
            .from('websites')
            .select('id')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle();
            
        if (website) {
            setWebsiteId(website.id);
        }
    };
    init();
  }, []);

  // 2. Fetch Data when websiteId is ready
  const fetchData = useCallback(async () => {
    if (!websiteId) return; 
    setLoading(true);
    try {
        // Fetch Categories
        const { data: cats } = await supabase
            .from('categories')
            .select('*')
            .eq('website_id', websiteId)
            .order('name');
        setCategories(cats || []);

        // Fetch Products
        let query = supabase
            .from('products')
            .select('*')
            .eq('website_id', websiteId)
            .order('id', { ascending: false });

        if (searchTerm) {
            query = query.ilike('name', `%${searchTerm}%`);
        }
        if (selectedCategory && selectedCategory !== 'all') {
            query = query.eq('category_id', selectedCategory);
        }

        const { data: productsData, error } = await query;
        if (error) {
             console.error("Products Fetch Error:", JSON.stringify(error));
             throw error;
        }

        // Create Map for categories
        const catMap = (cats || []).reduce((acc, c) => {
            acc[c.id] = c.name;
            return acc;
        }, {});

        // Process Client-Side
        const processed = productsData.map(p => {
            const stockCount = p.stock !== undefined ? p.stock : 0; 
            let status = 'Active';
            if (stockCount === -1) {
                status = 'Unlimited'; 
            } else {
                if (stockCount === 0) status = 'Out Of Stock';
                else if (stockCount < 10) status = 'Low Stock';
                else if (stockCount > 100) status = 'Overflow Stock';
            }

            // Analytics (7 Days) - Initialized to 0 (No Noise)
            const analyticsData = [];
            for(let i=6; i>=0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                analyticsData.push({ date: d.toISOString().split('T')[0], value: 0 });
            }

            return {
                ...p,
                stock: stockCount === -1 ? 'Unlimited' : stockCount,
                stockStatus: status,
                categoryName: (p.category_id && catMap[p.category_id]) || 'Uncategorized',
                analytics: analyticsData
            };
        });

        // Filter Stock Status in Memory
        let final = processed;
        if (stockFilters.length > 0) {
            final = final.filter(p => stockFilters.includes(p.stockStatus));
        }

        setProducts(final);

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        setLoading(false);
    }
  }, [websiteId, searchTerm, selectedCategory, stockFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  }

  const handleDeleteProduct = async (product) => {
      if(!confirm("Are you sure you want to delete this product?")) return;
      try {
        const { error } = await supabase.from('products').delete().eq('id', product.id);
        if(error) throw error;
        
        await syncWebsiteDataClient(websiteId);
        fetchData();
        setOpenDropdownId(null);
      } catch (err) {
        alert("Failed to delete: " + err.message);
      }
  };

  const handleEditProduct = (product) => {
      setProductToEdit(product);
      setIsAddOpen(true);
      setOpenDropdownId(null);
  };

  const handleViewProduct = (product) => {
      setSelectedProduct(product);
      setOpenDropdownId(null);
  }

  // Client-Side Pagination
  const totalCount = products.length;
  const paginatedProducts = products.slice((currentPage - 1) * limit, currentPage * limit);
  const totalPages = Math.ceil(totalCount / limit);

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

  return (
    <div className="space-y-6 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product catalog, categories, and inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'products' && (
            <button 
               onClick={() => { setProductToEdit(null); setIsAddOpen(true); }}
               disabled={!websiteId}
               className="flex items-center gap-2 px-4 py-2 bg-[#8A63D2] text-white rounded-full font-medium text-sm hover:bg-[#7854bc] transition-colors shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <Plus size={18} />
              Add Product
            </button>
          )}
        </div>
      </div>

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

      {activeTab === 'categories' && (
        <CategoryManager categories={categories} onUpdate={fetchData} websiteId={websiteId} />
      )}

      {activeTab === 'products' && (
        <>
            <div className="flex flex-wrap  md:flex-row items-center  justify-between gap-4 bg-purple p-2 rounded-full border border-gray-100 shadow-sm">
                <div className="relative w-full md:w-96 ">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full  pl-10 pr-4 py-2 text-sm bg-purple-50 border-none rounded-full focus:ring-2 focus:ring-[#8A63D2]/20 focus:outline-none"
                />
                </div>

                <div className="relative ">
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center bg-purple-50 gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    isFilterOpen || stockFilters.length > 0 || selectedCategory !== 'all'
                        ? 'bg-purple-50 text-purple-600 border-purple-100' 
                        : 'bg-purple text-gray-600 border-purple-200 hover:bg-purple-50'
                    }`}
                >
                    <Filter size={16} /> Filter
                    
                    {(stockFilters.length > 0 || selectedCategory !== 'all') && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] text-white">
                        {stockFilters.length + (selectedCategory !== 'all' ? 1 : 0)}
                    </span>
                    )}
                </button>

                {isFilterOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900 text-sm not-italic">Filters</h3>
                        <button 
                        onClick={() => { setStockFilters([]); setSelectedCategory('all'); setCurrentPage(1); setIsFilterOpen(false); }}
                        className="text-xs not-italic text-gray-400 hover:text-gray-600"
                        >
                        Reset
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {/* Filters ... */}
                        <div>
                        <h4 className="text-xs not-italic font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Stock</h4>
                        <div className="space-y-2">
                            {['Overflow Stock', 'Low Stock', 'Out Of Stock', 'Unlimited'].map(status => (
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" ref={dropdownRef}>
                <div className="overflow-x-auto min-h-[400px]">
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
                        paginatedProducts.map((product) => (
                        <tr 
                            key={product.id} 
                            className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                            onClick={() => handleViewProduct(product)}
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
                            <div className="flex  flex-col gap-1">
                                <span className="text-sm pl-3 font-medium text-gray-900">{product.stock === -1 ? 'Unlimited' : product.stock}</span>
                                <span className={`text-[10px] -pl-3 font-semibold px-2 py-0.5 rounded-full w-fit ${
                                    product.stockStatus === 'Out Of Stock' ? 'bg-red-50 text-red-600' :
                                    product.stockStatus === 'Low Stock' ? 'bg-orange-50 text-orange-600' :
                                    product.stockStatus === 'Unlimited' ? 'bg-purple-50 text-purple-600' :
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
                            <td className="px-6 py-4 text-right relative">
                                <button 
                                    className="p-2 text-gray-400 hover:text-[#8A63D2] transition-colors rounded-full hover:bg-gray-100" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdownId(openDropdownId === product.id ? null : product.id);
                                    }}
                                >
                                    <MoreVertical size={18} />
                                </button>
                                
                                {openDropdownId === product.id && (
                                    <div className="absolute right-8 top-8 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleViewProduct(product); }}
                                            className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Eye size={14} /> View
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleEditProduct(product); }}
                                            className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Edit size={14} /> Edit
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product); }}
                                            className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50"
                                        >
                                            <Trash size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
                </div>
                
                {/* Pagination Controls */}
                {!loading && totalCount > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} entries</span>
                    <div className="flex gap-2">
                        <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        Previous
                        </button>
                        <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
        onClose={() => { setIsAddOpen(false); setProductToEdit(null); }} 
        onProductAdded={fetchData}
        categories={categories}
        websiteId={websiteId} 
        productToEdit={productToEdit}
      />

      <ProductDrawer 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

    </div>
  );
}
