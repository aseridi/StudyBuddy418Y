import OpenAI from 'openai';
import { DEEPSEEK_MODELS as MODELS } from './models';

export function createDeepSeekClient() {
    const apiKey = process.env.DEEPSEEK_API_KEY
    if(!apiKey){
        throw new Error('DEEPSEEK_API_KEY is not set in environment variables')
    }

    return new OpenAI({
        apiKey,
        baseURL: 'https://api.deepseek.com',
    })
}


const MAX_CHARS = 40_000
const MAX_CHAT_CHARS = 100_000

export type SummaryInput = { title: string; materialType: string; text: string }
export type SummaryResult = { summary: string; topics: string[] }

export type ChatMaterial = { id: string; title: string; text: string }

export type ChatInput = {
  course: { name: string; code: string | null }
  materials: ChatMaterial[]
  upcomingAssignments: { title: string; dueDate: string; status: string | null}[]
  history: { role: 'user' | 'assistant'; content: string }[]
  question: string
}

export type ChatResult = { answer: string; materialIds: string[] }

export async function summarizeMaterial(input: SummaryInput): Promise<SummaryResult> {
  const client = createDeepSeekClient()
  const text = input.text.slice(0, MAX_CHARS)

  const completion = await client.chat.completions.create({
    model: MODELS.fast, 
    response_format: { type: 'json_object' },
    // @ts-expect-error DeepSeek-only param, not in the openai SDK types
    thinking: {type: 'disabled'},
    messages: [
      {
        role: 'system',
        content:
          'You summarize course materials for a student. ' +
          'Reply with JSON only: {"summary": string, "topics": string[]}. ' +
          'summary: 1-2 short paragraphs. topics: 3 to 8 key concepts, each a few words.',
      },
      {
        role: 'user',
        content: `Title: ${input.title}\nType: ${input.materialType}\n\n${text}`,
      },
    ],
  })

  const content = completion.choices[0]?.message.content
  if (!content) throw new Error('Empty response from DeepSeek')

  const parsed = JSON.parse(content)
  if (typeof parsed.summary !== 'string' || !Array.isArray(parsed.topics)) {
    throw new Error('Unexpected response shape from DeepSeek')
  }

  return { summary: parsed.summary, topics: parsed.topics.map(String) }
}

export async function answerStudyQuestion(input: ChatInput): Promise<ChatResult> {
  const client = createDeepSeekClient()
  const perMaterial = Math.floor(MAX_CHAT_CHARS / input.materials.length)

  const materialsText = input.materials
    .map((m) => `[id: ${m.id}] ${m.title}\n${m.text.slice(0, perMaterial)}`)
    .join('\n\n')

  const assignmentText = input.upcomingAssignments
    .map((a) => `- ${a.title} (due ${a.dueDate}, status: ${a.status})`)
    .join('\n')

  const system = `You are a study assistant for the course ${input.course.name} ${input.course.code ?? ''}.
      Rules:
      - Answer the student's question using the course materials below.
      - If the materials do not cover the question, say so, then give a general answer and label it clearly as general knowledge.
      - Reply with JSON only: {"answer": string, "materialIds": string[]}
      - materialIds are the ids of the materials your answer used, or [] if none.
      Upcoming assignments:
      ${assignmentText || '(none)'}
      Course materials:
      ${materialsText || '(no materials uploaded)'}`

  const completion = await client.chat.completions.create({
    model: MODELS.fast,
    response_format: { type: 'json_object' },
    max_tokens: 1000,
    // @ts-expect-error DeepSeek-only param, not in the openai SDK types
    thinking: { type: 'disabled' },
    messages: [
      { role: 'system', content: system },
      ...input.history,
      { role: 'user', content: input.question },
    ],
  })

  const content = completion.choices[0]?.message.content
  if (!content) throw new Error('Empty response from DeepSeek')

  const parsed = JSON.parse(content)
  if (typeof parsed.answer !== 'string' || !Array.isArray(parsed.materialIds)) {
    throw new Error('Unexpected response shape from DeepSeek')
  }

  const knownIds = input.materials.map((m) => m.id)
  const materialIds = parsed.materialIds
    .map(String)
    .filter((id: string) => knownIds.includes(id))

  return { answer: parsed.answer, materialIds }
}

