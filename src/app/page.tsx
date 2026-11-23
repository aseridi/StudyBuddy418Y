import Link from 'next/link'
import { BookOpen, CalendarDays, FileText, MessageSquare } from 'lucide-react'

const features = [
  { icon: CalendarDays, title: 'Never miss a deadline', text: 'Track assignments by course, see what is due soon, and plan your week on the calendar.' },
  { icon: FileText, title: 'All your materials', text: 'Upload lecture notes and slides, and get a summary with the key concepts.' },
  { icon: MessageSquare, title: 'Study with AI', text: 'Ask questions and get answers based on your own course materials and deadlines.' },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="flex items-center justify-between p-4 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="rounded-lg bg-blue-600 p-2">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">StudyBuddy</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Log in
          </Link>
          <Link href="/signup" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Sign up
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-16 sm:px-8">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Your courses, deadlines and study help in one place.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-600">
          StudyBuddy keeps track of what is due, stores your course materials, and answers study questions using your own notes.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700">
            Get started
          </Link>
          <Link href="/login" className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
            I already have an account
          </Link>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <f.icon className="h-6 w-6 text-blue-600" />
              <h2 className="mt-3 font-semibold text-gray-900">{f.title}</h2>
              <p className="mt-1 text-sm text-gray-600">{f.text}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} StudyBuddy
      </footer>
    </div>
  )
}
