"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Download, Search, Layout, Type, Palette, Image as ImageIcon } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { searchProducts } from '../../../actions/posActions';

export default function OfferPosterPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [badgeText, setBadgeText] = useState('50% OFF');
  const [customBadge, setCustomBadge] = useState('');
  const [layout, setLayout] = useState('modern'); // modern, minimal, bold
  const [isGenerating, setIsGenerating] = useState(false);

  const posterRef = useRef(null);

  // Search Logic
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.length > 1) {
        const results = await searchProducts(searchTerm);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Left: Controls */}
      <div className="lg:col-span-1 flex flex-col gap-6">
         {/* 1. Select Product */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-sm font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                 <ImageIcon size={16} /> 1. Select Product
             </h2>
             <div className="relative">
                <input
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-purple-100"
                    placeholder="Search your inventory..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-lg mt-1 border border-gray-100 z-10 max-h-60 overflow-y-auto">
                        {searchResults.map(p => (
                            <div
                                key={p.id}
                                onClick={() => {
                                    setSelectedProduct(p);
                                    setSearchTerm('');
                                    setSearchResults([]);
                                }}
                                className="p-3 hover:bg-purple-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0"
                            >
                                <div className="w-10 h-10 bg-gray-100 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${p.image_url})` }}></div>
                                <div className="text-sm font-medium">{p.name}</div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
             {selectedProduct && (
                 <div className="mt-4 p-3 bg-purple-50 rounded-lg flex items-center gap-3 border border-purple-100">
                      <div className="w-12 h-12 bg-white rounded-md bg-cover bg-center shadow-sm" style={{ backgroundImage: `url(${selectedProduct.image_url})` }}></div>
                      <div>
                          <div className="font-bold text-gray-800 text-sm">{selectedProduct.name}</div>
                          <div className="text-xs text-purple-600 font-medium">Selected</div>
                      </div>
                 </div>
             )}
         </div>

         {/* 2. Choose Badge */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-sm font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                 <Type size={16} /> 2. Choose Badge
             </h2>
             <div className="flex flex-wrap gap-2 mb-4">
                 {badges.map(b => (
                     <button
                        key={b}
                        onClick={() => { setBadgeText(b); setCustomBadge(''); }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${badgeText === b ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                     >
                         {b}
                     </button>
                 ))}
             </div>
             <input
                className="w-full p-2 border rounded-lg text-sm"
                placeholder="Or type custom text..."
                value={customBadge}
                onChange={e => { setCustomBadge(e.target.value); setBadgeText(e.target.value); }}
             />
         </div>

          {/* 3. Style */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-sm font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                 <Layout size={16} /> 3. Layout Style
             </h2>
             <div className="grid grid-cols-3 gap-2">
                 {['modern', 'minimal', 'bold'].map(l => (
                     <button
                        key={l}
                        onClick={() => setLayout(l)}
                        className={`p-2 rounded-lg text-xs capitalize border ${layout === l ? 'bg-purple-100 border-purple-400 text-purple-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                     >
                         {l}
                     </button>
                 ))}
             </div>
         </div>

         <button
            onClick={handleDownload}
            disabled={!selectedProduct || isGenerating}
            className="w-full py-4 bg-[#8A63D2] hover:bg-[#7750bf] text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
         >
             {isGenerating ? 'Generating...' : <> <Download size={20} /> Download Image </>}
         </button>
      </div>

      {/* Right: Preview Canvas */}
      <div className="lg:col-span-2 flex items-center justify-center bg-gray-100 rounded-3xl p-8 border border-gray-200 overflow-hidden relative">
          {!selectedProduct ? (
              <div className="text-center text-gray-400">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <ImageIcon size={30} />
                  </div>
                  <p>Select a product to start designing</p>
              </div>
          ) : (
             <div
               ref={posterRef}
               className="w-[380px] h-[675px] bg-white shadow-2xl relative overflow-hidden flex flex-col"
               // Aspect Ratio 9:16 for Stories (approx 1080x1920 scaled down)
             >
                 {/* Modern Layout */}
                 {layout === 'modern' && (
                     <>
                        <div className="h-[60%] w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${selectedProduct.image_url})` }}>
                            <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full font-bold text-sm tracking-wide shadow-md uppercase">
                                {badgeText}
                            </div>
                        </div>
                        <div className="flex-1 bg-white p-8 flex flex-col justify-center relative">
                            <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-2">{selectedProduct.name}</h2>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-3">{selectedProduct.description || 'Special offer limited time only.'}</p>
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-bold text-[#8A63D2]">${selectedProduct.price}</span>
                                <span className="text-sm text-gray-400 line-through">${(selectedProduct.price * 1.2).toFixed(2)}</span>
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
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center text-white">
                            <div className="border border-white/50 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
                                {badgeText}
                            </div>
                            <h2 className="text-4xl font-serif mb-4">{selectedProduct.name}</h2>
                            <div className="text-3xl font-light mb-8">${selectedProduct.price}</div>

                            <div className="absolute bottom-10 left-0 right-0 text-center">
                                <div className="w-12 h-0.5 bg-white/50 mx-auto mb-4"></div>
                                <span className="text-[8px] font-medium text-white/60 uppercase tracking-widest">Link in Bio</span>
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-4 z-20">
                             <span className="text-[8px] font-bold text-white/40 uppercase">BizVistar</span>
                        </div>
                     </>
                 )}

                 {/* Bold Layout */}
                 {layout === 'bold' && (
                     <div className="h-full bg-[#FFD700] p-6 flex flex-col relative">
                        <div className="bg-white rounded-[2rem] h-full flex flex-col overflow-hidden shadow-inner border-4 border-black">
                            <div className="h-[55%] bg-cover bg-center border-b-4 border-black" style={{ backgroundImage: `url(${selectedProduct.image_url})` }}></div>
                            <div className="flex-1 p-6 flex flex-col items-start justify-center">
                                <div className="bg-black text-[#FFD700] px-3 py-1 text-sm font-black uppercase transform -rotate-2 mb-4">
                                    {badgeText}
                                </div>
                                <h2 className="text-4xl font-black text-black leading-[0.9] mb-2 uppercase italic">{selectedProduct.name}</h2>
                                <p className="text-xl font-bold text-gray-800">Only ${selectedProduct.price}</p>
                            </div>
                        </div>
                        <div className="absolute bottom-2 left-0 right-0 text-center">
                            <span className="text-[10px] font-black text-black/20 uppercase tracking-widest">Powered by BizVistar</span>
                        </div>
                     </div>
                 )}
             </div>
          )}
      </div>
    </div>
  );
}
