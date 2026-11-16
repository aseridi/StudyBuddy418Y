export const DEEPSEEK_MODELS = {
  /** Fast, cheap, non-thinking. Correct for almost everything. */
  fast: 'deepseek-v4-flash',
  /** Flagship with thinking effort levels. Slower, dearer, better reasoning. */
  reasoning: 'deepseek-v4-pro',
} as const

export type DeepSeekModel = typeof DEEPSEEK_MODELS[keyof typeof DEEPSEEK_MODELS]