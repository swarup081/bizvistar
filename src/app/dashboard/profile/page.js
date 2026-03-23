'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, User, CreditCard, CheckCircle2, AlertCircle, Building2, Lock, Truck } from 'lucide-react';
import { updateProfileDataAction } from '@/app/actions/profileActions';
import PlanManager from '@/components/dashboard/PlanManager';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Forms state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    businessName: '',
    upiId: '',
    logoUrl: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    companyName: '',
    gstNumber: '',
    deliveryType: 'fixed',
    deliveryCost: 0,
    deliveryThreshold: 0,
    deliveryType: 'fixed',
    deliveryCost: 0,
    deliveryThreshold: 0,
    deliveryType: 'fixed',
    deliveryCost: 100,
    deliveryThreshold: 0
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [pwdMessage, setPwdMessage] = useState({ type: '', text: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPlan, setCurrentPlan] = useState(null);
  const [productCount, setProductCount] = useState(0);
  
  // UPI Verification state
  const [initialUpiId, setInitialUpiId] = useState('');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [confirmUpiId, setConfirmUpiId] = useState('');
  const [upiModalError, setUpiModalError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) return;

      // Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      // Fetch Onboarding Data (for Business Name, UPI)
      const { data: websites } = await supabase
        .from('websites')
        .select('id, website_data')
        .eq('user_id', user.id)
        .limit(1);

      let businessName = '';
      let upiId = '';
      let logoUrl = '';

      if (websites && websites.length > 0) {
        const websiteId = websites[0].id;
        const websiteData = websites[0].website_data || {};
        
        businessName = websiteData.businessName || '';
        upiId = websiteData.payment?.upiId || '';
        logoUrl = websiteData.logo || '';

        const { data: onboarding } = await supabase
          .from('onboarding_data')
          .select('*')
          .eq('website_id', websiteId)
          .maybeSingle();

        if (onboarding) {
            if (!businessName) businessName = onboarding.owner_name || '';
            if (!upiId) upiId = onboarding.upi_id || '';
            if (!logoUrl) logoUrl = onboarding.logo_url || '';
        }
      }
      
      // If billing_address is stored as a JSON string, we should try to parse it
      let billing = {};
      try {
        if (typeof profile?.billing_address === 'string') {
          billing = JSON.parse(profile.billing_address);
        } else if (profile?.billing_address) {
          billing = profile.billing_address;
        }
      } catch (e) {
        console.error("Error parsing billing address", e);
      }

      setFormData({
        fullName: profile?.full_name || billing.fullName || '',
        email: user.email || '',
        businessName: businessName,
        upiId: upiId,
        logoUrl: logoUrl,
        phoneNumber: billing.phoneNumber || '',
        address: billing.address || '',
        city: billing.city || '',
        state: billing.state || '',
        zipCode: billing.zipCode || '',
        country: billing.country || 'India',
        companyName: billing.companyName || '',
        gstNumber: billing.gstNumber || ''
      });
      setInitialUpiId(upiId || '');

      // Fetch Active Subscription & Products
      // We order by 'id' descending to ensure we ALWAYS get the absolute most recently inserted subscription row 
      // in case `created_at` timestamps are identical or webhook canceled the old one slightly late.
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .order('id', { ascending: false })
        .limit(1);

      const sub = subs && subs.length > 0 ? subs[0] : null;

      if (sub && sub.plans) {
          let cycle = 'monthly';
          if (sub.plans.name.toLowerCase().includes('yearly')) cycle = 'yearly';
          // Check if current_period_end is a Unix timestamp (seconds)
          let endValue = sub.current_period_end;
          if (endValue && typeof endValue === 'number' && endValue < 10000000000) {
              // Convert seconds to milliseconds
              endValue = new Date(endValue * 1000).toISOString();
          } else if (endValue && !isNaN(Number(endValue)) && String(endValue).length === 10) {
              endValue = new Date(Number(endValue) * 1000).toISOString();
          }

          setCurrentPlan({
              id: sub.id,
              name: sub.plans.name.replace(/ yearly| monthly/gi, ''),
              price: sub.plans.price,
              status: sub.status,
              end: endValue,
              cycle: cycle
          });
      } else {
          setCurrentPlan({
              id: 'default',
              name: 'Starter',
              price: '299',
              status: 'active',
              end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
              cycle: 'monthly'
          });
      }

      if (websites && websites.length > 0) {
          const { count } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .eq('website_id', websites[0].id);
          setProductCount(count || 0);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Logo image must be smaller than 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Logo = reader.result;
        setFormData(prev => ({ ...prev, logoUrl: base64Logo }));
        
        // Immediately save logo to backend
        try {
            // We can just call updateProfileDataAction with a partial update if we adapt it, 
            // or call it with current formData + new logo. Since formData might have unsaved text changes,
            // we will pass the exact updated formData state.
            const dataToSave = { ...formData, logoUrl: base64Logo };
            const res = await updateProfileDataAction(dataToSave);
            if (res.success) {
                setMessage({ type: 'success', text: 'Logo updated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to save logo.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to upload logo.' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const proceedWithSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
        const res = await updateProfileDataAction(formData);
        if (res.success) {
             setMessage({ type: 'success', text: 'Profile updated successfully!' });
             setInitialUpiId(formData.upiId);
             setShowUpiModal(false);
             setConfirmUpiId('');
             setUpiModalError('');
        } else {
             setMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
        }
    } catch (error) {
        setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
        setSaving(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if UPI ID was added or changed
    if (formData.upiId !== initialUpiId && formData.upiId.trim() !== '') {
        setShowUpiModal(true);
    } else {
        proceedWithSave();
    }
  };

  const handleConfirmUpi = () => {
      if (confirmUpiId !== formData.upiId) {
          setUpiModalError('UPI IDs do not match.');
          return;
      }
      setUpiModalError('');
      proceedWithSave();
  };

  const handlePasswordChange = async (e) => {
      e.preventDefault();
      setPwdMessage({ type: '', text: '' });
      if (!currentPassword) {
          setPwdMessage({ type: 'error', text: 'Please enter your current password.' });
          return;
      }
      if (!newPassword || newPassword.length < 6) {
          setPwdMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
          return;
      }
      
      try {
          // 1. Re-authenticate to verify current password
          const { error: signInError } = await supabase.auth.signInWithPassword({
              email: formData.email,
              password: currentPassword
          });

          if (signInError) {
              throw new Error("Incorrect current password.");
          }

          // 2. Update to new password
          const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
          if (updateError) throw updateError;
          
          setPwdMessage({ type: 'success', text: 'Password updated successfully!' });
          setCurrentPassword('');
          setNewPassword('');
      } catch (error) {
          setPwdMessage({ type: 'error', text: error.message || 'Failed to update password.' });
      }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto pb-12 animate-pulse">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mb-4"></div>
          <div className="h-5 bg-gray-200 rounded-lg w-96"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-28 h-28 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-lg w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
              
              <div className="w-full mt-6 pt-6 border-t border-gray-100 text-left space-y-6">
                <div>
                  <div className="h-3 bg-gray-200 rounded-lg w-20 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded-lg w-40"></div>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-3 bg-gray-200 rounded-lg w-24"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-12"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-lg w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-24 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-48"></div>
                </div>
              </div>
            </div>
            {/* Plan Manager Skeleton */}
            <div className="h-64 bg-gray-200 rounded-[24px]"></div>
          </div>

          {/* Right Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                  <div className="h-6 bg-gray-200 rounded-lg w-48"></div>
              </div>
              <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                      <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                      <div className="md:col-span-2 h-5 bg-gray-200 rounded-lg w-32"></div>
                      <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                      <div className="md:col-span-2 h-12 bg-gray-200 rounded-xl w-full"></div>
                      <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                      <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                      <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                      <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                      <div className="md:col-span-2 h-5 bg-gray-200 rounded-lg w-48"></div>
                      <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                      <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                      <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
                  </div>
              </div>
            </div>

             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="h-6 bg-gray-200 rounded-lg w-32"></div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                    <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
                        <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 relative">
      {showUpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm UPI ID</h3>
                <p className="text-gray-500 text-sm mb-4">You are updating your UPI ID. Please re-enter it to confirm.</p>
                
                <div className="space-y-4">
                    <input 
                        type="text"
                        value={confirmUpiId}
                        onChange={(e) => {
                            setConfirmUpiId(e.target.value);
                            if (upiModalError) setUpiModalError('');
                        }}
                        className={`w-full px-4 py-3 rounded-xl border ${upiModalError ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-[#8A63D2]/20'} focus:ring-2 focus:border-[#8A63D2] outline-none font-mono`}
                        placeholder="Re-enter UPI ID"
                    />
                    {upiModalError && <p className="text-red-500 text-sm">{upiModalError}</p>}
                    <p className="text-xs font-semibold text-amber-600 bg-amber-50 p-2 rounded-lg">
                        ⚠️ Note: Incorrect UPI ID will lead to payment failure or wrong payment.
                    </p>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <button 
                        onClick={() => {
                            setShowUpiModal(false);
                            setConfirmUpiId('');
                            setUpiModalError('');
                        }}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirmUpi}
                        disabled={saving}
                        className="px-6 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-medium transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                        Confirm
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
        <p className="text-gray-500 mt-2">Manage your personal information, business settings, and subscription plan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            
            <div className="relative group cursor-pointer mb-4">
              <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleLogoUpload}
                  title="Upload new logo"
              />
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-md bg-[#8A63D2]/10 text-[#8A63D2] flex items-center justify-center text-4xl font-bold uppercase overflow-hidden relative">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Business Logo" className="w-full h-full object-cover" />
                ) : (
                  formData.businessName ? formData.businessName.charAt(0) : (formData.fullName ? formData.fullName.charAt(0) : formData.email.charAt(0))
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-semibold mt-1">Change Logo</span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900">{formData.businessName || formData.fullName || 'User'}</h2>
            <p className="text-sm text-gray-500 mt-1">{formData.businessName || 'Business not set'}</p>
            
            <div className="w-full mt-6 pt-6 border-t border-gray-100 text-left space-y-6">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email (Verified)</span>
                <p className="text-gray-800 font-medium mt-1">{formData.email}</p>
              </div>
              
              {currentPlan && (
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Plan</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                  <h4 className="text-2xl font-extrabold text-gray-900 mb-1">{currentPlan.name}</h4>
                  <p className="text-gray-600 text-sm">
                      Billed {currentPlan.cycle}.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                      Next billing date: <span className="font-semibold text-gray-900">{new Date(currentPlan.end).toLocaleDateString()}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <PlanManager currentPlan={currentPlan} productCount={productCount} />
        </div>

        {/* Right Content - Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-400" />
                    Business & Personal Details
                </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {message.text && (
                    <div className={`p-4 rounded-xl flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Business Name</label>
                        <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                            placeholder="e.g. My Awesome Store"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">UPI ID</label>
                    <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none font-mono"
                        placeholder="e.g. yourname@upi"
                    />
                    <p className="text-xs text-gray-500 mt-1">Used for receiving payments on your website.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <div className="space-y-2 md:col-span-2">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Billing Address</h4>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                            placeholder="e.g. 9876543210"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                            placeholder="Street address, building, etc."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Country</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none"
                            disabled
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <div className="space-y-2 md:col-span-2">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Company Details (Optional)</h4>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">GST Number</label>
                        <input
                            type="text"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none font-mono"
                        />
                    </div>
                </div>


          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#8A63D2]" />
                    Delivery Rules
                </h3>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Delivery Type</label>
                    <select
                        name="deliveryType"
                        value={formData.deliveryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none bg-white"
                    >
                        <option value="fixed">Fixed Cost (Always apply)</option>
                        <option value="free_over_threshold">Free over specific amount</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Base Cost (₹)</label>
                        <input
                            type="number"
                            name="deliveryCost"
                            value={formData.deliveryCost}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                            min="0"
                        />
                    </div>

                    {formData.deliveryType === 'free_over_threshold' && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Free Delivery Threshold (₹)</label>
                            <input
                                type="number"
                                name="deliveryThreshold"
                                value={formData.deliveryThreshold}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                                min="0"
                            />
                        </div>
                    )}
                </div>

                <div className="bg-[#8A63D2]/5 p-4 rounded-xl border border-[#8A63D2]/20 flex items-start gap-3">
                    <Truck className="text-[#8A63D2] shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-[#8A63D2]/80 font-medium">
                        {formData.deliveryType === 'free_over_threshold'
                            ? `Customers will be charged ₹${formData.deliveryCost} for shipping, unless their cart subtotal exceeds ₹${formData.deliveryThreshold}.`
                            : `Customers will always be charged a flat rate of ₹${formData.deliveryCost} for shipping.`}
                    </p>
                </div>
            </div>
          </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
          </div>


          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#8A63D2]" />
                    Delivery Rules
                </h3>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Delivery Type</label>
                    <select
                        name="deliveryType"
                        value={formData.deliveryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none bg-white"
                    >
                        <option value="fixed">Fixed Cost (Always apply)</option>
                        <option value="free_over_threshold">Free over specific amount</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Base Cost (₹)</label>
                        <input
                            type="number"
                            name="deliveryCost"
                            value={formData.deliveryCost}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                            min="0"
                        />
                    </div>

                    {formData.deliveryType === 'free_over_threshold' && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Free Delivery Threshold (₹)</label>
                            <input
                                type="number"
                                name="deliveryThreshold"
                                value={formData.deliveryThreshold}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                                min="0"
                            />
                        </div>
                    )}
                </div>

                <div className="bg-[#8A63D2]/5 p-4 rounded-xl border border-[#8A63D2]/20 flex items-start gap-3">
                    <Truck className="text-[#8A63D2] shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-[#8A63D2]/80 font-medium">
                        {formData.deliveryType === 'free_over_threshold'
                            ? `Customers will be charged ₹${formData.deliveryCost} for shipping, unless their cart subtotal exceeds ₹${formData.deliveryThreshold}.`
                            : `Customers will always be charged a flat rate of ₹${formData.deliveryCost} for shipping.`}
                    </p>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-6 py-3 bg-[#8A63D2] hover:bg-[#7b57be] text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {saving ? 'Saving...' : 'Save Delivery Rules'}
                    </button>
                </div>
            </div>
          </div>



          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#8A63D2]" />
                    Delivery Rules
                </h3>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Delivery Type</label>
                    <select
                        name="deliveryType"
                        value={formData.deliveryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none bg-white"
                    >
                        <option value="fixed">Fixed Cost (Always apply)</option>
                        <option value="free_over_threshold">Free over specific amount</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Base Cost (₹)</label>
                        <input
                            type="number"
                            name="deliveryCost"
                            value={formData.deliveryCost}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                            min="0"
                        />
                    </div>

                    {formData.deliveryType === 'free_over_threshold' && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Free Delivery Threshold (₹)</label>
                            <input
                                type="number"
                                name="deliveryThreshold"
                                value={formData.deliveryThreshold}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                                min="0"
                            />
                        </div>
                    )}
                </div>

                <div className="bg-[#8A63D2]/5 p-4 rounded-xl border border-[#8A63D2]/20 flex items-start gap-3">
                    <Truck className="text-[#8A63D2] shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-[#8A63D2]/80 font-medium">
                        {formData.deliveryType === 'free_over_threshold'
                            ? `Customers will be charged ₹${formData.deliveryCost} for shipping, unless their cart subtotal exceeds ₹${formData.deliveryThreshold}.`
                            : `Customers will always be charged a flat rate of ₹${formData.deliveryCost} for shipping.`}
                    </p>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-6 py-3 bg-[#8A63D2] hover:bg-[#7b57be] text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {saving ? 'Saving...' : 'Save Delivery Rules'}
                    </button>
                </div>
            </div>
          </div>



          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#8A63D2]" />
                    Delivery Rules
                </h3>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Delivery Type</label>
                    <select
                        name="deliveryType"
                        value={formData.deliveryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none bg-white"
                    >
                        <option value="fixed">Fixed Cost (Always apply)</option>
                        <option value="free_over_threshold">Free over specific amount</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Base Cost (₹)</label>
                        <input
                            type="number"
                            name="deliveryCost"
                            value={formData.deliveryCost}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                            min="0"
                        />
                    </div>

                    {formData.deliveryType === 'free_over_threshold' && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Free Delivery Threshold (₹)</label>
                            <input
                                type="number"
                                name="deliveryThreshold"
                                value={formData.deliveryThreshold}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                                min="0"
                            />
                        </div>
                    )}
                </div>

                <div className="bg-[#8A63D2]/5 p-4 rounded-xl border border-[#8A63D2]/20 flex items-start gap-3">
                    <Truck className="text-[#8A63D2] shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-[#8A63D2]/80 font-medium">
                        {formData.deliveryType === 'free_over_threshold'
                            ? `Customers will be charged ₹${formData.deliveryCost} for shipping, unless their cart subtotal exceeds ₹${formData.deliveryThreshold}.`
                            : `Customers will always be charged a flat rate of ₹${formData.deliveryCost} for shipping.`}
                    </p>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-6 py-3 bg-[#8A63D2] hover:bg-[#7b57be] text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {saving ? 'Saving...' : 'Save Delivery Rules'}
                    </button>
                </div>
            </div>
          </div>


          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-400" />
                    Security
                </h3>
            </div>
            <form onSubmit={handlePasswordChange} className="p-6 space-y-6">
                 {pwdMessage.text && (
                    <div className={`p-4 rounded-xl flex items-start gap-3 ${pwdMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {pwdMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                        <p className="text-sm font-medium">{pwdMessage.text}</p>
                    </div>
                )}
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                        placeholder="••••••••"
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                        placeholder="••••••••"
                        minLength={6}
                    />
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <a href="/forgot-password" className="text-sm text-[#8A63D2] hover:underline font-medium">Forgot Password?</a>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                    >
                        Update Password
                    </button>
                </div>
            </form>
          </div>


          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#8A63D2]" />
                    Delivery Rules
                </h3>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Delivery Type</label>
                    <select
                        name="deliveryType"
                        value={formData.deliveryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none bg-white"
                    >
                        <option value="fixed">Fixed Cost (Always apply)</option>
                        <option value="free_over_threshold">Free over specific amount</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Base Cost (₹)</label>
                        <input
                            type="number"
                            name="deliveryCost"
                            value={formData.deliveryCost}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                            min="0"
                        />
                    </div>

                    {formData.deliveryType === 'free_over_threshold' && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Free Delivery Threshold (₹)</label>
                            <input
                                type="number"
                                name="deliveryThreshold"
                                value={formData.deliveryThreshold}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                                min="0"
                            />
                        </div>
                    )}
                </div>

                <div className="bg-[#8A63D2]/5 p-4 rounded-xl border border-[#8A63D2]/20 flex items-start gap-3">
                    <Truck className="text-[#8A63D2] shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-[#8A63D2]/80 font-medium">
                        {formData.deliveryType === 'free_over_threshold'
                            ? `Customers will be charged ₹${formData.deliveryCost} for shipping, unless their cart subtotal exceeds ₹${formData.deliveryThreshold}.`
                            : `Customers will always be charged a flat rate of ₹${formData.deliveryCost} for shipping.`}
                    </p>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-6 py-3 bg-[#8A63D2] hover:bg-[#7b57be] text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {saving ? 'Saving...' : 'Save Delivery Rules'}
                    </button>
                </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}
