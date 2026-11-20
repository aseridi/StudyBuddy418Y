const CHUNK_SIZE = 1500
const OVERLAP = 200
const MIN_CHUNK = 50
const MAX_CHUNKS = 300

export function chunkText(text: string): string[] {
    const chunks: string[] = []
    let start =0

    while(start < text.length && chunks.length < MAX_CHUNKS) {
        let end = Math.min(start + CHUNK_SIZE, text.length)

        if(end < text.length) {
            const window = text.slice(start, end)
            const paragraph = window.lastIndexOf('\n\n')
            const sentence = window.lastIndexOf('. ')
            const space = window.lastIndexOf(' ')

            if (paragraph>CHUNK_SIZE/2) {
                end = start + paragraph
            } else if (sentence > CHUNK_SIZE/2) {
                end = start + sentence + 1
            } else if (space > CHUNK_SIZE/2) {
                end = start + space
            }
        }

        const chunk = text.slice(start, end).trim()
        if(chunk.length >= MIN_CHUNK) chunks.push(chunk)
        
        if(end >= text.length) break
        start = end - OVERLAP
    }

    return chunks
}