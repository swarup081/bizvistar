'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOG_CATEGORIES, searchPosts, getSearchSuggestions } from '@/data/blogData';

export default function BlogSecondaryNav({ posts = [], onCategoryChange }) {
  const [isSticky, setIsSticky] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navRef = useRef(null);
  const searchInputRef = useRef(null);

  // Sticky Logic
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const isDesktop = window.innerWidth >= 1024;
        const stickyThreshold = isDesktop ? 128 : 64;
        setIsSticky(navRef.current.getBoundingClientRect().top <= stickyThreshold + 1);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Search open/close focus
  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus();
    } else if (!isSearching) {
      setSearchQuery('');
    }
  }, [isSearching]);

  // Category change handler
  const handleCategoryChange = (category) => {
    setActiveTab(category);
    if (onCategoryChange) onCategoryChange(category);
  };

  // Enhanced search using centralized engine
  const filteredPosts = searchQuery.trim() 
    ? searchPosts(searchQuery).slice(0, 3)
    : posts.slice(0, 3);

  // Smart suggestions
  const suggestions = searchQuery.trim() 
    ? getSearchSuggestions(searchQuery)
    : [];

  // Handle search submit
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      window.location.href = `/blogs/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Suggestion click handler
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    window.location.href = `/blogs/search?q=${encodeURIComponent(suggestion)}`;
  };

  // Total results for display
  const totalResults = searchQuery.trim() ? searchPosts(searchQuery).length : posts.length;

  // Horizontal Card Component for Dropdown
  const DropdownPostCard = ({ post }) => (
    <Link href={post.href || "#"} className="flex gap-4 group cursor-pointer">
      <div className="w-[100px] h-[100px] bg-gray-100 flex-shrink-0">
        {post.image ? (
          <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
        ) : (
          <div className="w-full h-full bg-gray-200"></div>
        )}
      </div>
      <div className="flex flex-col pt-1">
        <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:underline">{post.title}</h4>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {post.description || "Turn your ideas into sales and start building with BizVistar..."}
        </p>
        {post.category && (
          <span className="text-[10px] text-[#8A63D2] font-bold mt-1 uppercase">{post.category}</span>
        )}
      </div>
    </Link>
  );

  return (
    <div
      ref={navRef}
      className={cn(
        "z-[100] block w-full max-w-[1300px] mx-auto pointer-events-none px-4 md:px-6",
        "sticky top-[64px] lg:top-[128px] lg:mb-4 inset-x-0 flex justify-start transition-transform"
      )}
    >
      <div 
        className={cn(
          "max-w-[100vw] lg:max-w-[1000px] w-full pointer-events-auto relative transition-all duration-300",
          isSticky ? "lg:scale-[1.02]" : "scale-100"
        )}
      >
        <div 
          className={cn(
            "flex flex-row items-center bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg transition-all duration-300 overflow-hidden",
            "rounded-full p-1.5 min-h-[52px]",
            isSearching ? "w-full ring-2 ring-black/10" : "w-auto"
          )}
          style={{ width: isSearching ? '100%' : 'fit-content', minWidth: isSearching ? '100%' : 'auto' }}
        >
          <AnimatePresence mode="wait">
            {!isSearching ? (
              <motion.div 
                key="nav-links"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0, display: 'none' }}
                className="flex items-center gap-1 overflow-x-auto no-scrollbar"
              >
                {BLOG_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className="flex-shrink-0 relative px-4 py-1.5 rounded-full text-[13px] hover:bg-[#b9a8e0] hover:text-white font-semibold tracking-wide outline-none group transition-all"
                  >
                    {activeTab === category && (
                      <motion.div
                        layoutId="activeBlogSubNavPill"
                        className="absolute inset-0 bg-[#8A63D2] rounded-full shadow-md z-0"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    <span className={cn(
                      "relative z-10 transition-colors duration-300",
                      activeTab === category
                        ? "text-white"
                        : "text-gray-500 group-hover:text-white"
                    )}>
                      {category}
                    </span>
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="search-input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, display: 'none' }}
                className="flex items-center w-full px-4 gap-3"
              >
                <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <input 
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search articles, topics, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-[15px]"
                />
                {searchQuery && (
                  <span className="text-[11px] text-gray-400 whitespace-nowrap mr-2">{totalResults} results</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setIsSearching(!isSearching)}
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-gray-600 hover:bg-[#b9a8e0] hover:text-white transition-all duration-300 ml-auto mr-1 z-10"
            title={isSearching ? "Close Search" : "Search"}
          >
            {isSearching ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
        </div>

        {/* Mega Search Dropdown */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-3 bg-white rounded-md shadow-2xl border border-gray-200 overflow-hidden z-50 text-black p-8 font-sans"
            >
              {searchQuery.trim() === '' ? (
                // --- DEFAULT EMPTY STATE ---
                <div className="flex flex-col gap-10">
                  <div>
                    <h3 className="text-[15px] font-bold mb-6">Trending Articles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {posts.slice(0, 3).map((post, idx) => (
                        <DropdownPostCard key={idx} post={post} />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-[15px] font-bold mb-4">Popular Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {['website builder', 'ecommerce', 'SEO', 'instagram', 'pricing', 'WhatsApp orders', 'templates', 'domain name'].map((topic, idx) => (
                        <button 
                          key={idx}
                          onClick={() => { setSearchQuery(topic); }}
                          className="px-3 py-1.5 rounded-full text-[12px] font-medium text-gray-700 bg-gray-100 hover:bg-[#8A63D2] hover:text-white transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2">
                    <Link href={`/blogs/search?q=`}>
                      <button className="bg-black text-white px-6 py-2.5 text-[13px] font-medium hover:bg-gray-800 transition-colors">
                        Browse All Articles
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                // --- TYPING SEARCH STATE ---
                <div className="flex flex-col md:flex-row gap-10">
                  {/* Left Sidebar: Smart Suggestions */}
                  <div className="w-full md:w-[220px] flex-shrink-0">
                    <h3 className="text-[15px] font-bold mb-6">Suggestions</h3>
                    <ul className="flex flex-col gap-3 text-[14px] text-gray-700">
                      <li 
                        className="hover:text-black cursor-pointer font-medium flex items-center gap-2"
                        onClick={() => handleSuggestionClick(searchQuery)}
                      >
                        <Search className="w-3 h-3 text-gray-400" />
                        {searchQuery.toLowerCase()}
                      </li>
                      {suggestions.slice(0, 5).map((suggestion, idx) => (
                        <li 
                          key={idx}
                          className="hover:text-black cursor-pointer flex items-center gap-2"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <Search className="w-3 h-3 text-gray-400" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                    
                    {/* Category shortcuts */}
                    <h3 className="text-[15px] font-bold mb-3 mt-8">Categories</h3>
                    <ul className="flex flex-col gap-2 text-[13px]">
                      {BLOG_CATEGORIES.filter(c => c !== 'All').map((cat, idx) => (
                        <li key={idx}>
                          <Link 
                            href={`/blogs/search?q=${encodeURIComponent(cat)}`}
                            className="text-gray-500 hover:text-[#8A63D2] transition-colors flex items-center gap-1"
                          >
                            <ChevronRight className="w-3 h-3" />
                            {cat}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Right Content: Results */}
                  <div className="flex-1">
                    <h3 className="text-[15px] font-bold mb-2">
                      Blog Posts 
                      <span className="text-gray-400 font-normal ml-2 text-[13px]">({totalResults} found)</span>
                    </h3>
                    
                    {filteredPosts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        {filteredPosts.map((post, idx) => (
                          <DropdownPostCard key={idx} post={post} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 py-8 text-sm">
                        No articles found matching &quot;{searchQuery}&quot;. Try a different search term.
                      </div>
                    )}
                    
                    <div className="mt-10">
                      <Link href={`/blogs/search?q=${encodeURIComponent(searchQuery)}`}>
                        <button className="bg-black text-white px-6 py-2.5 text-[13px] font-medium hover:bg-gray-800 transition-colors">
                          Show All Results ({totalResults})
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
