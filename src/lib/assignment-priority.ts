export const assignmentPriorities = ['low', 'medium', 'high'] as const

export type Priority = (typeof assignmentPriorities)[number]

export function isPriority (value: unknown): value is Priority {
    return (typeof value ==='string' && (assignmentPriorities as readonly string[]).includes(value))
}

