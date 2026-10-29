import Link from 'next/link';
import type { Metadata } from 'next';
import { BookOpen, ArrowLeft } from 'lucide-react';
export const metadata: Metadata = {
    title: 'Page not found',
    robots: { index: false, follow: false },
};
export default function NotFound() {
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex p-3 bg-blue-600 rounded-xl mb-6">
          <BookOpen className="w-8 h-8 text-white"/>
        </div>

        <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase">404</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-3 text-gray-600">
          The link may be out of date, or whatever it pointed to may have been
          deleted. Nothing has gone wrong with your account.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4"/>
            Back to dashboard
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>);
}
