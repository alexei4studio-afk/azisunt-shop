'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setHasSession(!!session);

        // If there's no session and we're not on the login page, redirect to login
        if (!session && pathname !== '/admin/login') {
          router.replace('/admin/login');
          return;
        }
        
        // If there IS a session and we're on the login page, redirect to dashboard
        if (session && pathname === '/admin/login') {
          router.replace('/admin/products');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (pathname !== '/admin/login') {
          router.replace('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Also subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session);
      if (!session && pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Verificare autentificare...</p>
        </div>
      </div>
    );
  }

  // For the login page, we don't want to show the admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Only show admin layout if we have a session
  if (!hasSession && pathname !== '/admin/login') {
    return null;
  }

  // Otherwise, show the admin layout
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <a href="/admin/dashboard" className="px-3 py-2 rounded hover:bg-gray-100 block">Dashboard</a>
            <a href="/admin/products" className="px-3 py-2 rounded hover:bg-gray-100 block">Products</a>
            <a href="/manager" className="px-3 py-2 rounded hover:bg-gray-100 block">Control Panel</a>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
