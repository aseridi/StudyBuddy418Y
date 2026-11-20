const statusStyles: Record<string, { label: string; className: string }> = {
  not_started: { label: 'Not started', className: 'bg-gray-100 text-gray-700' },
  in_progress: { label: 'In progress', className: 'bg-amber-100 text-amber-800' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
}

export function getStatusStyle(status: string | null) {
  return statusStyles[status ?? 'not_started'] ?? statusStyles.not_started
}