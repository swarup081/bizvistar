'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, ChevronDown, ArrowRight, Filter } from 'lucide-react';
import NewHeader from '@/components/landing/NewHeader';
import Footer from '@/components/Footer';
import { ALL_BLOG_POSTS, searchPosts, getSearchSuggestions, BLOG_CATEGORIES } from '@/data/blogData';

function HighlightedText({ text, query }) {
  if (!query) return <span>{text}</span>;
  if (!text) return null;
  
  try {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="bg-blue-600 text-white px-[3px] rounded-[2px]">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  } catch {
    return <span>{text}</span>;
  }
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('blogs');
  const [sortBy, setSortBy] = useState('relevance');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Update query state when URL changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Handle Search
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      router.push(`/blogs/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Search with relevance scoring
  let filteredPosts = initialQuery.trim() 
    ? searchPosts(initialQuery)
    : ALL_BLOG_POSTS;

  // Category filter
  if (categoryFilter !== 'All') {
    filteredPosts = filteredPosts.filter(p => p.category === categoryFilter);
  }

  // Sort
  if (sortBy === 'newest') {
    // Sort by date (approximation: use array order since dates are already sorted)
    filteredPosts = [...filteredPosts];
  } else if (sortBy === 'oldest') {
    filteredPosts = [...filteredPosts].reverse();
  }
  // 'relevance' is default from searchPosts

  // Smart suggestions
  const suggestions = initialQuery.trim() ? getSearchSuggestions(initialQuery) : [];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      <NewHeader />

      <main className="flex-grow w-full max-w-[1000px] mx-auto px-4 md:px-8 py-16">
        <h1 className="text-center text-[36px] font-normal mb-10 text-gray-900">
          Search Results
        </h1>

        {/* Search Input */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-10 py-4 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-[16px]"
            placeholder="Search articles, topics, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          {query && (
            <div 
              className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
              onClick={() => { setQuery(''); router.push('/blogs/search'); }}
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </div>
          )}
        </div>

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-[12px] text-gray-400 font-medium">Try:</span>
            {suggestions.slice(0, 4).map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => router.push(`/blogs/search?q=${encodeURIComponent(suggestion)}`)}
                className="px-3 py-1 rounded-full text-[12px] font-medium text-gray-600 bg-gray-100 hover:bg-[#8A63D2] hover:text-white transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                categoryFilter === cat 
                  ? 'bg-[#8A63D2] text-white' 
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 flex">
          <button
            onClick={() => setActiveTab('blogs')}
            className={`pb-4 px-6 text-[15px] font-medium transition-colors relative ${
              activeTab === 'blogs' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Blog Posts ({filteredPosts.length})
            {activeTab === 'blogs' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`pb-4 px-6 text-[15px] font-medium transition-colors relative ${
              activeTab === 'pages' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Other Pages (0)
            {activeTab === 'pages' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600"></div>
            )}
          </button>
        </div>

        {/* Results Metadata */}
        <div className="flex justify-between items-center mb-10 text-[14px] text-gray-700">
          <div>
            {filteredPosts.length} results {initialQuery && <>found for &quot;{initialQuery}&quot;</>}
            {categoryFilter !== 'All' && <span className="text-[#8A63D2] ml-1">in {categoryFilter}</span>}
          </div>
          <div className="relative">
            <button 
              className="flex items-center gap-1 cursor-pointer hover:text-black"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              Sort By: {sortBy === 'relevance' ? 'Best Match' : sortBy === 'newest' ? 'Newest' : 'Oldest'} <ChevronDown className="w-4 h-4" />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
                {[
                  { key: 'relevance', label: 'Best Match' },
                  { key: 'newest', label: 'Newest First' },
                  { key: 'oldest', label: 'Oldest First' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => { setSortBy(opt.key); setShowSortDropdown(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-[14px] hover:bg-gray-50 transition-colors ${sortBy === opt.key ? 'text-[#8A63D2] font-bold' : 'text-gray-700'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="flex flex-col gap-12">
          {activeTab === 'blogs' ? (
            filteredPosts.length > 0 ? (
              filteredPosts.map((post, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-6 group">
                  <div className="w-full md:w-[280px] h-[160px] bg-gray-100 flex-shrink-0 rounded-lg overflow-hidden">
                    {post.image ? (
                      <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col pt-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.category && (
                        <span className="text-[10px] font-bold text-[#8A63D2] uppercase tracking-wide">{post.category}</span>
                      )}
                      {post.readTime && (
                        <>
                          <span className="text-gray-300 text-[10px]">•</span>
                          <span className="text-[10px] text-gray-400">{post.readTime}</span>
                        </>
                      )}
                    </div>
                    <Link href={post.href || "#"} className="inline-block w-fit">
                      <h3 className="text-[18px] text-gray-900 leading-snug group-hover:text-blue-600 mb-2 font-normal" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                        <HighlightedText text={post.title} query={initialQuery} />
                      </h3>
                    </Link>
                    <p className="text-[14px] text-gray-700 leading-relaxed max-w-[800px] line-clamp-2">
                      <HighlightedText text={post.description} query={initialQuery} />
                    </p>
                    <Link href={post.href || "#"} className="text-[13px] text-[#8A63D2] font-medium mt-2 flex items-center gap-1 hover:underline w-fit">
                      Read Article <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">No results found for &quot;{initialQuery}&quot;</p>
                <p className="text-gray-400 text-sm mb-6">Try searching for something else, or browse our popular topics:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['website', 'ecommerce', 'SEO', 'marketing', 'pricing', 'templates'].map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => router.push(`/blogs/search?q=${encodeURIComponent(topic)}`)}
                      className="px-4 py-2 rounded-full text-[13px] font-medium text-gray-600 bg-gray-100 hover:bg-[#8A63D2] hover:text-white transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="text-gray-500 py-12 text-center text-lg">
              No pages found for &quot;{initialQuery}&quot;.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"></div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
