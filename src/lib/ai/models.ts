export const DEEPSEEK_MODELS = {
  /** Fast, cheap. Correct for almost everything. */
  fast: 'deepseek-flash',
  /** Flagship. Slower, dearer, better reasoning. */
  reasoning: 'deepseek-v4-pro',
} as const

export type DeepSeekModel = typeof DEEPSEEK_MODELS[keyof typeof DEEPSEEK_MODELS]
export const EMBEDDING_MODEL = 'gemini-embedding-001'