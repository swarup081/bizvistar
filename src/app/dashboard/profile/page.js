'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, User, CreditCard, CheckCircle2, AlertCircle, Building2, Lock } from 'lucide-react';
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
    gstNumber: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [pwdMessage, setPwdMessage] = useState({ type: '', text: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPlan, setCurrentPlan] = useState(null);
  const [productCount, setProductCount] = useState(0);

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
        .single();

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
          .single();

        if (onboarding) {
            if (!businessName) businessName = onboarding.owner_name || '';
            if (!upiId) upiId = onboarding.upi_id || '';
            if (!logoUrl) logoUrl = onboarding.logo_url || '';
        }
      }

      const billing = profile?.billing_address || {};

      setFormData({
        fullName: profile?.full_name || '',
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

      // Fetch Active Subscription & Products
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .order('created_at', { ascending: false })
        .limit(1);

      const sub = subs && subs.length > 0 ? subs[0] : null;

      if (sub && sub.plans) {
          let cycle = 'monthly';
          if (sub.plans.name.toLowerCase().includes('yearly')) cycle = 'yearly';
          setCurrentPlan({
              id: sub.id,
              name: sub.plans.name.replace(/ yearly| monthly/gi, ''),
              price: sub.plans.price,
              status: sub.status,
              end: sub.current_period_end,
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

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Logo image must be smaller than 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
        const res = await updateProfileDataAction(formData);
        if (res.success) {
             setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } else {
             setMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
        }
    } catch (error) {
        setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
        setSaving(false);
    }
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#8A63D2]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile <span className="text-gray-400 font-light italic">Management</span></h1>
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

        </div>
      </div>
    </div>
  );
}
