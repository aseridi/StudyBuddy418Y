import Link from 'next/link';
import type { Metadata } from 'next';
import { BookOpen } from 'lucide-react';
export const metadata: Metadata = {
    title: 'Sign in',
    description: 'Sign in to StudyBuddy.',
    robots: { index: false, follow: false },
};
export default function AuthLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">

      <header className="p-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <BookOpen className="w-5 h-5 text-white"/>
          </div>
          <span className="text-lg font-bold text-gray-900">StudyBuddy</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      <footer className="p-4 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-4">
          <span>© {new Date().getFullYear()} StudyBuddy</span>
        </div>
      </footer>
    </div>);
}
