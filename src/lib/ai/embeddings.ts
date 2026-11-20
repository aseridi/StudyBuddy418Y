// heavily relied on AI for this one.

import { EMBEDDING_MODEL } from './models'

export const EMBEDDING_DIMENSION = 1536
const BATCH_SIZE = 50

type TaskType = 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY'

function normalize(values: number[]): number[] {
  const length = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0))
  return values.map((v) => v / length)
}

export async function embedTexts(texts: string[], taskType: TaskType): Promise<number[][]> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  const results: number[][] = []

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE)

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:batchEmbedContents`,
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            requests: batch.map((text) => ({
            model: `models/${EMBEDDING_MODEL}`,
            content: { parts: [{ text }] },
            taskType,
            outputDimensionality: EMBEDDING_DIMENSION,
          })),
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini embedding failed (${response.status}): ${await response.text()}`)
    }

    const data: { embeddings?: { values?: number[] }[] } = await response.json()
    const embeddings = data.embeddings ?? []

    if (embeddings.length !== batch.length) {
      throw new Error(`Gemini returned ${embeddings.length} embeddings for ${batch.length} texts`)
    }

    for (const embedding of embeddings) {
      const values = embedding.values ?? []
      if (values.length !== EMBEDDING_DIMENSION) {
        throw new Error(`Expected ${EMBEDDING_DIMENSION} dimensions, got ${values.length}`)
      }
      results.push(normalize(values))
    }
  }

  return results
}