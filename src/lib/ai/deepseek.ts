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

type SummaryInput = { title: string; materialType: string; text: string }
type SummaryResult = { summary: string; topics: string[] }

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