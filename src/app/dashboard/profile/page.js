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
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [pwdMessage, setPwdMessage] = useState({ type: '', text: '' });
  const [password, setPassword] = useState('');

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

      if (websites && websites.length > 0) {
        const websiteId = websites[0].id;
        const websiteData = websites[0].website_data || {};

        businessName = websiteData.businessName || '';
        upiId = websiteData.payment?.upiId || '';

        const { data: onboarding } = await supabase
          .from('onboarding_data')
          .select('*')
          .eq('website_id', websiteId)
          .single();

        if (onboarding) {
            if (!businessName) businessName = onboarding.owner_name || '';
            if (!upiId) upiId = onboarding.upi_id || '';
        }
      }

      setFormData({
        fullName: profile?.full_name || '',
        email: user.email || '',
        businessName: businessName,
        upiId: upiId,
      });

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
      if (!password || password.length < 6) {
          setPwdMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
          return;
      }

      try {
          const { error } = await supabase.auth.updateUser({ password: password });
          if (error) throw error;
          setPwdMessage({ type: 'success', text: 'Password updated successfully!' });
          setPassword('');
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
            <div className="w-24 h-24 rounded-full bg-[#8A63D2]/20 text-[#8A63D2] flex items-center justify-center text-4xl font-bold mb-4 uppercase">
              {formData.fullName ? formData.fullName.charAt(0) : formData.email.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{formData.fullName || 'User'}</h2>
            <p className="text-sm text-gray-500 mt-1">{formData.businessName || 'Business not set'}</p>

            <div className="w-full mt-6 pt-6 border-t border-gray-100 text-left space-y-4">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email (Verified)</span>
                <p className="text-gray-800 font-medium mt-1">{formData.email}</p>
              </div>
            </div>
          </div>
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

          <PlanManager />

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
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8A63D2]/20 focus:border-[#8A63D2] transition-colors outline-none"
                        placeholder="••••••••"
                        minLength={6}
                    />
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100">
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
