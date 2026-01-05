"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Download, Search, Layout, Type, Palette, Image as ImageIcon, Package } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { searchProducts } from '../../../actions/posActions';

export default function OfferPosterPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [badgeText, setBadgeText] = useState('50% OFF');
  const [customBadge, setCustomBadge] = useState('');
  const [layout, setLayout] = useState('modern'); // modern, minimal, bold
  const [isGenerating, setIsGenerating] = useState(false);

  const posterRef = useRef(null);

  // Load products on mount
  useEffect(() => {
    async function loadData() {
        const products = await searchProducts('');
        setAvailableProducts(products);
        setFilteredProducts(products);
    }
    loadData();
  }, []);

  // Filter Logic
  useEffect(() => {
    if (searchTerm.trim() === '') {
        setFilteredProducts(availableProducts);
    } else {
        setFilteredProducts(availableProducts.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }
  }, [searchTerm, availableProducts]);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsGenerating(true);
    try {
        const dataUrl = await htmlToImage.toPng(posterRef.current, { quality: 1.0, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `offer-${selectedProduct?.name || 'promo'}.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error("Failed to generate image", err);
        alert("Could not generate image. Please try again.");
    }
    setIsGenerating(false);
  };

  const badges = ["50% OFF", "SALE", "NEW ARRIVAL", "BEST SELLER", "RESTOCKED", "LIMITED"];

  return (
    <div className="flex h-full gap-8 overflow-hidden">

      {/* Left Sidebar: Product Selection */}
      <div className="w-[320px] flex flex-col gap-4 bg-white/80 backdrop-blur-md border border-white/20 p-4 rounded-3xl shadow-xl h-full overflow-hidden">
         <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-lg">1. Select Product</h2>
            <div className="text-xs text-gray-400">{filteredProducts.length} items</div>
         </div>

         <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input
                 className="w-full pl-9 p-2 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white text-sm outline-none focus:ring-2 focus:ring-purple-100"
                 placeholder="Search products..."
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
             />
         </div>

         <div className="flex-1 overflow-y-auto space-y-2 pr-1">
             {filteredProducts.map(p => (
                 <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-all ${
                        selectedProduct?.id === p.id
                        ? 'bg-purple-50 border-purple-200 shadow-sm'
                        : 'bg-white border-transparent hover:bg-gray-50'
                    }`}
                 >
                     <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                         {p.image_url ? (
                             <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${p.image_url})` }}></div>
                         ) : (
                             <div className="flex items-center justify-center w-full h-full text-gray-300"><Package size={16}/></div>
                         )}
                     </div>
                     <div className="min-w-0">
                         <div className="text-sm font-bold text-gray-800 truncate">{p.name}</div>
                         <div className="text-xs text-gray-500">${p.price}</div>
                     </div>
                     {selectedProduct?.id === p.id && <div className="ml-auto w-2 h-2 rounded-full bg-purple-500"></div>}
                 </div>
             ))}
         </div>
      </div>

      {/* Middle: Controls */}
      <div className="w-[280px] flex flex-col gap-6 py-4">
         {/* Badge Selection */}
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-xs font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                 <Type size={14} /> 2. Choose Badge
             </h2>
             <div className="flex flex-wrap gap-2 mb-3">
                 {badges.map(b => (
                     <button
                        key={b}
                        onClick={() => { setBadgeText(b); setCustomBadge(''); }}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-all ${badgeText === b ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-600 border-transparent hover:border-gray-200'}`}
                     >
                         {b}
                     </button>
                 ))}
             </div>
             <input
                className="w-full p-2 border rounded-lg text-xs bg-gray-50 focus:bg-white transition-colors"
                placeholder="Custom text..."
                value={customBadge}
                onChange={e => { setCustomBadge(e.target.value); setBadgeText(e.target.value); }}
             />
         </div>

          {/* Style Selection */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-xs font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                 <Layout size={14} /> 3. Layout Style
             </h2>
             <div className="grid grid-cols-1 gap-2">
                 {['modern', 'minimal', 'bold'].map(l => (
                     <button
                        key={l}
                        onClick={() => setLayout(l)}
                        className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold capitalize border transition-all ${
                            layout === l
                            ? 'bg-purple-50 border-purple-200 text-purple-700'
                            : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                        }`}
                     >
                         {l}
                         {layout === l && <div className="w-2 h-2 bg-purple-500 rounded-full"></div>}
                     </button>
                 ))}
             </div>
         </div>

         <div className="mt-auto">
            <button
                onClick={handleDownload}
                disabled={!selectedProduct || isGenerating}
                className="w-full py-3 bg-[#8A63D2] hover:bg-[#7750bf] text-white rounded-xl font-bold shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
                {isGenerating ? 'Generating...' : <> <Download size={18} /> Download Poster </>}
            </button>
         </div>
      </div>

      {/* Right: Preview Canvas (Centered) */}
      <div className="flex-1 bg-gray-100/50 rounded-3xl p-8 border border-gray-200 overflow-hidden flex items-center justify-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

          {!selectedProduct ? (
              <div className="text-center text-gray-400 relative z-10">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm animate-pulse">
                      <ImageIcon size={30} />
                  </div>
                  <p className="font-medium">Select a product to preview</p>
              </div>
          ) : (
             <div
               ref={posterRef}
               className="h-[90%] aspect-[9/16] bg-white shadow-2xl relative overflow-hidden flex flex-col transform transition-all duration-500"
             >
                 {/* Modern Layout */}
                 {layout === 'modern' && (
                     <>
                        <div className="h-[65%] w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${selectedProduct.image_url})` }}>
                            <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full font-bold text-sm tracking-wide shadow-md uppercase">
                                {badgeText}
                            </div>
                        </div>
                        <div className="flex-1 bg-white p-8 flex flex-col justify-center relative">
                            <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-2">{selectedProduct.name}</h2>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-3">{selectedProduct.description || 'Special offer available for a limited time.'}</p>
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-[#8A63D2]">${selectedProduct.price}</span>
                                <span className="text-lg text-gray-400 line-through">${(selectedProduct.price * 1.2).toFixed(2)}</span>
                            </div>

                            <div className="absolute bottom-6 left-0 right-0 text-center">
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Powered by BizVistar</span>
                            </div>
                        </div>
                     </>
                 )}

                 {/* Minimal Layout */}
                 {layout === 'minimal' && (
                     <>
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${selectedProduct.image_url})` }}></div>
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center text-white">
                            <div className="border border-white/60 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
                                {badgeText}
                            </div>
                            <h2 className="text-5xl font-serif mb-6 leading-tight">{selectedProduct.name}</h2>
                            <div className="text-4xl font-light mb-12">${selectedProduct.price}</div>

                            <div className="absolute bottom-12 left-0 right-0 text-center">
                                <div className="w-16 h-px bg-white/60 mx-auto mb-4"></div>
                                <span className="text-[10px] font-medium text-white/70 uppercase tracking-widest">Link in Bio</span>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-6 z-20">
                             <span className="text-[10px] font-bold text-white/30 uppercase">BizVistar</span>
                        </div>
                     </>
                 )}

                 {/* Bold Layout */}
                 {layout === 'bold' && (
                     <div className="h-full bg-[#FFD700] p-4 flex flex-col relative">
                        <div className="bg-white rounded-[2rem] h-full flex flex-col overflow-hidden shadow-inner border-4 border-black">
                            <div className="h-[60%] bg-cover bg-center border-b-4 border-black grayscale contrast-125" style={{ backgroundImage: `url(${selectedProduct.image_url})` }}></div>
                            <div className="flex-1 p-6 flex flex-col items-start justify-center bg-white relative">
                                <div className="absolute -top-5 right-6 bg-black text-[#FFD700] px-4 py-2 text-lg font-black uppercase transform rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                    {badgeText}
                                </div>
                                <h2 className="text-4xl font-black text-black leading-[0.9] mb-3 uppercase italic">{selectedProduct.name}</h2>
                                <p className="text-3xl font-bold text-gray-800 tracking-tighter">${selectedProduct.price}</p>
                            </div>
                        </div>
                        <div className="absolute bottom-1.5 left-0 right-0 text-center">
                            <span className="text-[9px] font-black text-black/20 uppercase tracking-widest">Powered by BizVistar</span>
                        </div>
                     </div>
                 )}
             </div>
          )}
      </div>
    </div>
  );
}
