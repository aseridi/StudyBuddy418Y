'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { BookOpen, LayoutDashboard, Menu, X, LogOut, Loader2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];
export default function DashboardLayout({ children, }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, profile, isLoading, signOut } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const handleSignOut = async () => {
        setIsSigningOut(true);
        await signOut();
    };
    const getInitials = () => {
        if (profile?.full_name) {
            const names = profile.full_name.split(' ');
            return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        if (user?.email) {
            return user.email[0].toUpperCase();
        }
        return '?';
    };
    if (isLoading || !user) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto"/>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {sidebarOpen && (<div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}/>)}

      <aside className={cn('fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform transition-transform lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex flex-col h-full">

          <div className="flex items-center gap-2 px-4 h-16 border-b dark:border-gray-700">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BookOpen className="w-5 h-5 text-white"/>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">StudyBuddy</span>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
              <X className="w-5 h-5 text-gray-500"/>
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (<Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors', isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700')}>
                  <item.icon className="w-5 h-5"/>
                  {item.name}
                </Link>);
        })}
          </nav>
        </div>
      </aside>

      <div className="lg:pl-64">

        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="flex items-center gap-4 px-4 h-16">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-6 h-6 text-gray-600"/>
            </button>

            <div className="flex-1"/>
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {getInitials()}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block"/>
              </button>

              {userMenuOpen && (<>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)}/>
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1 z-50">
                    <div className="px-4 py-3 border-b dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {profile?.full_name || 'Student'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button onClick={() => {
                setUserMenuOpen(false);
                handleSignOut();
            }} disabled={isSigningOut} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full disabled:opacity-50">
                      {isSigningOut ? (<Loader2 className="w-4 h-4 animate-spin"/>) : (<LogOut className="w-4 h-4"/>)}
                      Sign out
                    </button>
                  </div>
                </>)}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
            {children}
        </main>
      </div>
    </div>);
}
