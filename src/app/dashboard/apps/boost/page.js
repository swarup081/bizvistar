"use client";

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Settings, Power, Star, Trash2, Save, X, Activity } from 'lucide-react';
import { getOffers, createOffer, updateOffer, deleteOffer, updateWebsiteOffersConfig } from '@/app/actions/boostActions';
import { getWebsiteDetails } from '@/app/actions/dashboardActions';
import toast, { Toaster } from 'react-hot-toast';

export default function BoostAppPage() {
  const [offers, setOffers] = useState([]);
  const [websiteId, setWebsiteId] = useState(null);
  const [globalShowOffers, setGlobalShowOffers] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const { success: webSuccess, data: website } = await getWebsiteDetails();
        if (webSuccess && website) {
          setWebsiteId(website.id);
          const showOffers = website.website_data?.offersConfig?.showOffers ?? false;
          setGlobalShowOffers(showOffers);
          
          const { success: offersSuccess, data: offersData } = await getOffers(website.id);
          if (offersSuccess) {
            setOffers(offersData);
          }
        }
      } catch (e) {
        console.error("Failed to init Boost", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleGlobalToggle = async () => {
    if (!websiteId) return;
    const newValue = !globalShowOffers;
    setGlobalShowOffers(newValue);
    const result = await updateWebsiteOffersConfig(websiteId, { showOffers: newValue });
    if (result.success) {
      toast.success(`Offers globally ${newValue ? 'enabled' : 'disabled'}`);
    } else {
      toast.error('Failed to update config');
      setGlobalShowOffers(!newValue); // revert
    }
  };

  const handleOpenModal = (offer = null) => {
    if (offer) {
      setCurrentOffer({ ...offer });
    } else {
      setCurrentOffer({
        code: '',
        type: 'percentage',
        value: 10,
        min_order_value: 0,
        usage_limit: null,
        is_active: true,
        is_featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveOffer = async (e) => {
    e.preventDefault();
    if (!websiteId) return;
    
    // Convert string inputs to correct types
    const offerData = {
      ...currentOffer,
      value: parseFloat(currentOffer.value),
      min_order_value: parseFloat(currentOffer.min_order_value) || 0,
      max_discount: parseFloat(currentOffer.max_discount) || null,
      usage_limit: currentOffer.usage_limit ? parseInt(currentOffer.usage_limit) : null,
      expires_at: currentOffer.expires_at || null
    };

    let result;
    if (offerData.id) {
      result = await updateOffer(offerData.id, websiteId, offerData);
    } else {
      result = await createOffer(websiteId, offerData);
    }

    if (result.success) {
      toast.success(`Offer ${offerData.id ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
      // Refresh offers
      const { data } = await getOffers(websiteId);
      setOffers(data || []);
    } else {
      toast.error('Failed to save offer');
    }
  };

  const handleToggleActive = async (offer) => {
      const result = await updateOffer(offer.id, websiteId, { is_active: !offer.is_active });
      if (result.success) {
          setOffers(offers.map(o => o.id === offer.id ? { ...o, is_active: !offer.is_active } : o));
          toast.success(`Offer ${!offer.is_active ? 'activated' : 'deactivated'}`);
      }
  };

  const handleToggleFeatured = async (offer) => {
      const result = await updateOffer(offer.id, websiteId, { is_featured: true });
      if (result.success) {
          // Refresh all to reflect feature swap
          const { data } = await getOffers(websiteId);
          setOffers(data || []);
          toast.success('Offer set as featured popup');
      }
  };

  const handleDelete = async (id) => {
      if (confirm('Are you sure you want to delete this offer?')) {
          const result = await deleteOffer(id, websiteId);
          if (result.success) {
              setOffers(offers.filter(o => o.id !== id));
              toast.success('Offer deleted');
          }
      }
  };

  if (loading) return <div className="p-8 flex justify-center"><Activity className="animate-spin text-gray-400" /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <Toaster position="top-center" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Tag className="text-[#8A63D2]" /> Boost Offers
          </h1>
          <p className="text-gray-500 mt-2">Create and manage discount codes and website popups.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">Show Offers at Checkout</span>
            <span className="text-xs text-gray-500">Allow customers to pick coupons</span>
          </div>
          <button
            onClick={handleGlobalToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${globalShowOffers ? 'bg-[#8A63D2]' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${globalShowOffers ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Your Offers</h2>
            <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 bg-[#8A63D2] text-white px-4 py-2 rounded-lg hover:bg-[#7a55bd] transition-colors font-medium text-sm"
            >
                <Plus size={16} /> Create Offer
            </button>
        </div>
        
        {offers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <Tag size={48} className="text-gray-300 mb-4" />
                <p>No offers created yet.</p>
                <button onClick={() => handleOpenModal()} className="mt-4 text-[#8A63D2] font-medium hover:underline">
                    Create your first offer
                </button>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm">
                            <th className="p-4 font-medium">Code</th>
                            <th className="p-4 font-medium">Discount</th>
                            <th className="p-4 font-medium">Min. Order</th>
                            <th className="p-4 font-medium">Usage</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Popup Featured</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {offers.map(offer => (
                            <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-bold text-gray-900">{offer.code}</td>
                                <td className="p-4 text-gray-700">
                                    {offer.type === 'percentage' ? `${offer.value}% OFF` : `₹${offer.value} OFF`}
                                </td>
                                <td className="p-4 text-gray-500">
                                    {offer.min_order_value > 0 ? `₹${offer.min_order_value}` : 'None'}
                                </td>
                                <td className="p-4 text-gray-500">
                                    {offer.used_count} / {offer.usage_limit ? offer.usage_limit : '∞'}
                                </td>
                                <td className="p-4">
                                    <button 
                                        onClick={() => handleToggleActive(offer)}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${offer.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                                    >
                                        <Power size={12} /> {offer.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="p-4">
                                    <button 
                                        onClick={() => handleToggleFeatured(offer)}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${offer.is_featured ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}
                                    >
                                        <Star size={12} className={offer.is_featured ? 'fill-yellow-500' : ''} />
                                        {offer.is_featured ? 'Featured' : 'Set Featured'}
                                    </button>
                                </td>
                                <td className="p-4 flex justify-end gap-2">
                                    <button onClick={() => handleOpenModal(offer)} className="p-2 text-gray-500 hover:text-[#8A63D2] hover:bg-purple-50 rounded-lg transition-colors">
                                        <Settings size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(offer.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      {/* Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">
                        {currentOffer?.id ? 'Edit Offer' : 'Create Offer'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSaveOffer} className="p-5 space-y-4">
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 uppercase font-mono"
                            placeholder="e.g. SUMMER20"
                            value={currentOffer?.code || ''}
                            onChange={e => setCurrentOffer({...currentOffer, code: e.target.value.toUpperCase().replace(/\s/g, '')})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                            <select 
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900"
                                value={currentOffer?.type || 'percentage'}
                                onChange={e => setCurrentOffer({...currentOffer, type: e.target.value})}
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                            <input 
                                required
                                type="number"
                                min="1" 
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900"
                                placeholder={currentOffer?.type === 'percentage' ? 'e.g. 10' : 'e.g. 100'}
                                value={currentOffer?.value || ''}
                                onChange={e => setCurrentOffer({...currentOffer, value: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min. Order (₹)</label>
                            <input 
                                type="number"
                                min="0" 
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900"
                                placeholder="0 for none"
                                value={currentOffer?.min_order_value || ''}
                                onChange={e => setCurrentOffer({...currentOffer, min_order_value: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Usage Limit</label>
                            <input 
                                type="number"
                                min="1" 
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900"
                                placeholder="Leave blank for ∞"
                                value={currentOffer?.usage_limit || ''}
                                onChange={e => setCurrentOffer({...currentOffer, usage_limit: e.target.value})}
                            />
                        </div>
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (₹)</label>
                            <input 
                                type="number"
                                min="1" 
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 bg-gray-50 focus:bg-white transition-colors"
                                placeholder="Leave blank for none"
                                value={currentOffer?.max_discount || ''}
                                onChange={e => setCurrentOffer({...currentOffer, max_discount: e.target.value})}
                                disabled={currentOffer?.type !== 'percentage'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                            <input 
                                type="datetime-local"
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 bg-white"
                                value={currentOffer?.expires_at ? currentOffer.expires_at.slice(0, 16) : ''}
                                onChange={e => setCurrentOffer({...currentOffer, expires_at: e.target.value})}
                            />
                        </div>
                    </div>


                    <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-[#8A63D2] text-white font-medium rounded-lg hover:bg-[#7a55bd] transition-colors flex items-center gap-2"
                        >
                            <Save size={18} /> Save Offer
                        </button>
                    </div>

                </form>
            </div>
        </div>
      )}
    </div>
  );
}
