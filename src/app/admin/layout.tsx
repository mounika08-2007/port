'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  FolderKanban,
  Zap,
  Share2,
  LogOut,
  ChevronLeft,
  LayoutDashboard,
  Sliders,
  Tag,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const navItems = [
  { href: '/admin', label: 'Profile', icon: User },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/skills', label: 'Skills', icon: Zap },
  { href: '/admin/social', label: 'Social Links', icon: Share2 },
  { href: '/admin/vibe', label: 'Vibe & Experience', icon: Sliders },
  { href: '/admin/packs', label: 'Theme Packs & Pricing', icon: Tag },
  { href: '/admin/portfolios', label: 'User Portfolios', icon: Globe },
  { href: '/admin/entitlements', label: 'Entitlements & Plans', icon: ShieldCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (!user && pathname !== '/admin/login' && pathname !== '/admin/signup') {
        router.push('/admin/login');
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user && pathname !== '/admin/login' && pathname !== '/admin/signup') {
        router.push('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // For login/signup pages, render without the shell
  if (pathname === '/admin/login' || pathname === '/admin/signup') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-[#f7f8f8] text-[#0f1419]">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-20'
        } border-r border-[#e1e8ed] bg-[#ffffff] flex flex-col shadow-xs`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e1e8ed]">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <LayoutDashboard size={20} className="text-sky-400" />
              <span className="text-sm font-bold text-[#0f1419] tracking-wide">ADMIN</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#E3ECF6] text-[#536471] hover:text-[#0f1419] transition-all"
          >
            <ChevronLeft
              size={18}
              className={`transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#e1e8ed]">
          <Link href="/" className="sidebar-link mb-1" title="View Site">
            <ChevronLeft size={20} />
            {sidebarOpen && <span>View Site</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-400 hover:!text-red-300 hover:!bg-red-500/10"
            title="Logout"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        } p-6 md:p-10`}
      >
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
