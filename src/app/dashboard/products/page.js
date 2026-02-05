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
  Trash,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; 
import { syncWebsiteDataClient } from '@/lib/websiteSync';
import Sparkline from '@/components/dashboard/products/Sparkline';
import AddProductDialog from '@/components/dashboard/products/AddProductDialog';
import ProductDrawer from '@/components/dashboard/products/ProductDrawer';
import CategoryManager from '@/components/dashboard/products/CategoryManager';
import WebsiteProductSettings from '@/components/dashboard/products/WebsiteProductSettings';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('products'); 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [websiteId, setWebsiteId] = useState(null); 
  
  // Pagination State 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilters, setStockFilters] = useState([]); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // For Drawer
  const [productToEdit, setProductToEdit] = useState(null); // For Dialog
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // For Website Settings

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

  // Responsive Items Per Page
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 768) {
            setItemsPerPage(7); 
        } else {
            setItemsPerPage(10);
        }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
            .eq('is_published', true)
            .order('created_at', { ascending: false })
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

        // We fetch all and filter client-side to support ID and Category Name search
        if (selectedCategory && selectedCategory !== 'all') {
            query = query.eq('category_id', selectedCategory);
        }

        const { data: productsData, error } = await query;
        if (error) throw error;

        // Fetch Sales Analytics (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const isoDate = sevenDaysAgo.toISOString();

        // Join order_items with orders to filter by date
        // Note: This requires a foreign key relationship setup in Supabase, assuming it exists based on schema.
        // If exact FK join syntax fails, we might need a two-step fetch.
        // Trying standard select with nested filter.
        const { data: salesData, error: salesError } = await supabase
            .from('order_items')
            .select(`
                product_id,
                quantity,
                orders!inner (
                    created_at,
                    website_id
                )
            `)
            .eq('orders.website_id', websiteId)
            .gte('orders.created_at', isoDate);

        const salesMap = {}; // { productId: { '2023-10-27': 5, ... } }
        
        if (!salesError && salesData) {
            salesData.forEach(item => {
                const date = item.orders.created_at.split('T')[0];
                const pid = item.product_id;
                if (!salesMap[pid]) salesMap[pid] = {};
                if (!salesMap[pid][date]) salesMap[pid][date] = 0;
                salesMap[pid][date] += item.quantity;
            });
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

            // Analytics (7 Days)
            const analyticsData = [];
            for(let i=6; i>=0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                // Get value from salesMap
                const val = salesMap[p.id]?.[dateStr] || 0;
                analyticsData.push({ date: dateStr, value: val });
            }

            return {
                ...p,
                stock: stockCount === -1 ? 'Unlimited' : stockCount,
                stockStatus: status,
                categoryName: (p.category_id && catMap[p.category_id]) || 'Uncategorized',
                analytics: analyticsData
            };
        });

        // Filter Stock Status in Memory & Search
        let final = processed;

        if (searchTerm) {
             const lowerTerm = searchTerm.toLowerCase();
             final = final.filter(p =>
                 p.name.toLowerCase().includes(lowerTerm) ||
                 String(p.id).includes(lowerTerm) ||
                 p.categoryName.toLowerCase().includes(lowerTerm)
             );
        }

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
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
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
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  // Reset page on search
  useEffect(() => {
      setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="h-full flex flex-col font-sans pb-20 md:pb-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-8 px-2 md:px-0 pt-4 md:pt-0 shrink-0">
        
        {/* Mobile Header Layout */}
        <div className="flex md:hidden flex-col w-full gap-3 -px-2 pt-4">
             <div className="flex items-center justify-between w-full">
                 <h1 className="text-xl not-italic font-bold text-gray-900 shrink-0">Products</h1>
                 <button 
                    onClick={() => { setProductToEdit(null); setIsAddOpen(true); }}
                    disabled={!websiteId}
                    className="h-9 px-4 flex items-center justify-center gap-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-all shadow-sm"
                 >
                    <Plus size={16} />
                    Add Product
                 </button>
             </div>

             <div className="flex items-center gap-2 w-full">
                 <div className="relative flex-1">
                    <Search className="absolute rounded-full left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search Name, ID, Category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-9 w-full rounded-full border border-gray-200 bg-white pl-8 pr-3 text-sm outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2] transition-all shadow-sm"
                    />
                 </div>

                 <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`h-[36px] w-[36px] shrink-0 flex items-center justify-center rounded-full transition-all shadow-sm ${
                        isFilterOpen || stockFilters.length > 0 || selectedCategory !== 'all'
                        ? 'bg-[#8A63D2] text-white' 
                        : 'bg-[#EEE5FF] text-[#8A63D2] hover:bg-[#dcd0f5]'
                    }`}
                 >
                    <Filter size={16} />
                 </button>

                 <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="h-[36px] w-[36px] shrink-0 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
                    title="Website Settings"
                 >
                    <Settings size={18} />
                 </button>
             </div>
             
             {/* Mobile Filter Dropdown */}
             {isFilterOpen && (
                <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 p-4 animate-in fade-in slide-in-from-top-2 duration-200 mb-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900 text-sm">Filters</h3>
                        <button onClick={() => { setStockFilters([]); setSelectedCategory('all'); setCurrentPage(1); setIsFilterOpen(false); }} className="text-xs text-purple-600 font-bold">Reset</button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Stock</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {['Overflow Stock', 'Low Stock', 'Out Of Stock', 'Unlimited'].map(status => (
                                    <label key={status} className={`flex items-center justify-center px-2 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${stockFilters.includes(status) ? 'bg-purple-50 border-purple-200 text-purple-700 font-medium' : 'border-gray-200 text-gray-600'}`}>
                                        <input type="checkbox" className="hidden" checked={stockFilters.includes(status)} onChange={() => handleStockFilterChange(status)} />
                                        {status}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Category</h4>
                            <select value={selectedCategory} onChange={handleCategoryChange} className="w-full text-sm p-2 border border-gray-200 rounded-lg outline-none focus:border-purple-500">
                                <option value="all">All Categories</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
             )}
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between w-full">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-500 mt-1 text-sm md:text-base">Manage your product catalog and inventory.</p>
            </div>
            
            <div className="flex items-center gap-3">
                 <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="h-10 px-4 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm flex items-center gap-2 transition-all shadow-sm"
                 >
                    <Settings size={16} />
                    Settings
                 </button>

                 {activeTab === 'products' && (
                    <button 
                    onClick={() => { setProductToEdit(null); setIsAddOpen(true); }}
                    disabled={!websiteId}
                    className="h-10 px-4 flex items-center justify-center gap-2 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-all shadow-sm"
                    >
                    <Plus size={18} />
                    Add Product
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* Tabs (Desktop Only - Mobile handles via specific views if needed, but for now we keep the list) */}
      <div className="hidden md:block border-b border-gray-200 mb-6">
        <nav className="-mb-px flex gap-6">
          <button onClick={() => setActiveTab('products')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'products' ? 'border-[#8A63D2] text-[#8A63D2]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>All Products</button>
          <button onClick={() => setActiveTab('categories')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'categories' ? 'border-[#8A63D2] text-[#8A63D2]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Categories</button>
        </nav>
      </div>
      
      {/* Mobile Tab Switcher (Simple) */}
      <div className="md:hidden flex p-1 bg-gray-100 rounded-xl mb-4 mx-2">
          <button onClick={() => setActiveTab('products')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'products' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Products</button>
          <button onClick={() => setActiveTab('categories')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'categories' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Categories</button>
      </div>

      {activeTab === 'categories' && (
        <CategoryManager categories={categories} onUpdate={fetchData} websiteId={websiteId} />
      )}

      {activeTab === 'products' && (
        <>
            {/* Desktop Filter Bar (Hidden on Mobile) */}
            <div className="hidden md:flex flex-wrap items-center justify-between gap-4 bg-purple p-2 rounded-full border border-gray-100 shadow-sm mb-6">
                <div className="relative w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm bg-purple-50 border-none rounded-full focus:ring-2 focus:ring-[#8A63D2]/20 focus:outline-none" />
                </div>
                {/* ... existing desktop filter buttons logic ... */}
                <div className="relative">
                    <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center bg-purple-50 gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${isFilterOpen || stockFilters.length > 0 || selectedCategory !== 'all' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-purple text-gray-600 border-purple-200 hover:bg-purple-50'}`}>
                        <Filter size={16} /> Filter
                        {(stockFilters.length > 0 || selectedCategory !== 'all') && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] text-white">{stockFilters.length + (selectedCategory !== 'all' ? 1 : 0)}</span>}
                    </button>
                    {isFilterOpen && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-4 animate-in fade-in zoom-in-95 duration-200">
                             {/* ... desktop filter content ... */}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-900 text-sm not-italic">Filters</h3>
                                <button onClick={() => { setStockFilters([]); setSelectedCategory('all'); setCurrentPage(1); setIsFilterOpen(false); }} className="text-xs not-italic text-gray-400 hover:text-gray-600">Reset</button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                <h4 className="text-xs not-italic font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Stock</h4>
                                <div className="space-y-2">
                                    {['Overflow Stock', 'Low Stock', 'Out Of Stock', 'Unlimited'].map(status => (
                                    <label key={status} className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${stockFilters.includes(status) ? 'bg-[#8A63D2] border-[#8A63D2]' : 'border-gray-300 bg-white group-hover:border-[#8A63D2]'}`}>
                                        {stockFilters.includes(status) && <Check size={12} className="text-white" />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={stockFilters.includes(status)} onChange={() => handleStockFilterChange(status)} />
                                        <span className="text-sm text-gray-700">{status}</span>
                                    </label>
                                    ))}
                                </div>
                                </div>
                                <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</h4>
                                <select value={selectedCategory} onChange={handleCategoryChange} className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A63D2]/20">
                                    <option value="all">All Categories</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                <button onClick={() => setIsFilterOpen(false)} className="px-4 py-2 bg-[#8A63D2] text-white text-xs font-medium rounded-lg hover:bg-[#7854bc]">Done</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white md:rounded-2xl shadow-sm md:border border-gray-200 overflow-hidden flex flex-col -mx-4 md:mx-0 border-y border-gray-100 md:border-0" ref={dropdownRef}>
                <div className="w-full">
                <table className="w-full text-left border-collapse table-auto">
                    <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                        <th className="hidden md:table-cell py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                        <th className="py-4 px-2 md:px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                        <th className="py-4 px-2 md:px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                        <th className="hidden md:table-cell py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Analytics (7 Days)</th>
                        <th className="py-4 pr-4 md:px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                            <td colSpan="6" className="p-4 md:px-6">
                                <div className="h-12 w-full bg-gray-100 rounded-xl"></div>
                            </td>
                        </tr>
                        ))
                    ) : products.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="p-12 text-center text-gray-500">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Search className="text-gray-300 h-8 w-8" />
                                    <p>No products found matching your filters.</p>
                                    {(searchTerm || stockFilters.length > 0 || selectedCategory !== 'all') && (
                                        <button onClick={() => { setSearchTerm(''); setStockFilters([]); setSelectedCategory('all'); }} className="text-sm text-purple-600 font-bold hover:underline">Clear Filters</button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ) : (
                        paginatedProducts.map((product) => (
                        <tr 
                            key={product.id} 
                            className="group hover:bg-gray-50/50 transition-colors cursor-pointer text-[11px] md:text-sm"
                            onClick={() => handleViewProduct(product)}
                        >
                            <td className="py-4 pl-4 md:px-6 align-middle">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                <img src={product.image_url || 'https://via.placeholder.com/40'} alt="" className="h-full w-full object-cover" />
                                </div>
                                <div>
                                <div className="font-medium text-gray-900 line-clamp-1">{product.name}</div>
                                <div className="hidden md:block text-xs text-gray-400">ID: {product.id}</div>
                                </div>
                            </div>
                            </td>
                            <td className="hidden md:table-cell py-4 px-6 align-middle">
                            <span className="text-gray-600">{product.categoryName}</span>
                            </td>
                            <td className="py-4 px-2 md:px-6 align-middle">
                                <div className="flex flex-col items-start gap-1">
                                    <span className="font-medium text-gray-900">{product.stock === -1 ? '∞' : product.stock}</span>
                                    {/* Mobile Badge - Simplified */}
                                    <span className={`block md:hidden h-1.5 w-1.5 rounded-full ${
                                        product.stockStatus === 'Out Of Stock' ? 'bg-red-500' :
                                        product.stockStatus === 'Low Stock' ? 'bg-orange-500' :
                                        'bg-green-500'
                                    }`}></span>
                                    {/* Desktop Badge */}
                                    <span className={`hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                        product.stockStatus === 'Out Of Stock' ? 'bg-red-50 text-red-600' :
                                        product.stockStatus === 'Low Stock' ? 'bg-orange-50 text-orange-600' :
                                        product.stockStatus === 'Unlimited' ? 'bg-purple-50 text-purple-600' :
                                        'bg-green-50 text-green-600'
                                    }`}>
                                        {product.stockStatus}
                                    </span>
                                </div>
                            </td>
                            <td className="py-4 px-2 md:px-6 align-middle">
                            <span className="font-medium text-gray-900">₹{Number(product.price).toFixed(2)}</span>
                            </td>
                            <td className="hidden md:table-cell py-4 px-6 align-middle">
                                <div className="w-24">
                                    <Sparkline data={product.analytics} />
                                </div>
                            </td>
                            <td className="py-4 pr-4 md:px-6 text-right align-middle relative">
                                <button 
                                    className="p-1.5 md:p-2 text-gray-400 hover:text-[#8A63D2] transition-colors rounded-full hover:bg-gray-100" 
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
            </div>

            {/* Pagination Footer - Fixed to match Orders style */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 bg-white/50 border-t border-gray-100 rounded-b-2xl md:rounded-b-2xl -mx-4 md:mx-0">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={16} />
                        Prev
                    </button>
                    
                    <span className="text-sm font-medium text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
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
      
      <WebsiteProductSettings 
         isOpen={isSettingsOpen} 
         onClose={() => setIsSettingsOpen(false)} 
         websiteId={websiteId}
      /> 

    </div>
  );
}
