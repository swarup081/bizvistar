'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { verifyAdmin } from '@/app/actions/adminActions';

export default function AdminGuard({ children }) {
  const [status, setStatus] = useState('loading'); // loading | authorized | denied
  const [adminData, setAdminData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    verifyAdmin().then((result) => {
      if (result.isAdmin) {
        setAdminData(result);
        setStatus('authorized');
      } else {
        setStatus('denied');
        // Redirect non-admins after a short delay so they see the message
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    });
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-[#8A63D2] animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Verifying admin access...</p>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-sm text-gray-500">You don't have admin privileges. Redirecting...</p>
      </div>
    );
  }

  return children;
}
