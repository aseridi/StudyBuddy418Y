async function parsePDF(buffer: Buffer): Promise<string> {
    const { getDocumentProxy, extractText } = await import('unpdf')

    const pdf = await getDocumentProxy(new Uint8Array(buffer))
    const {text} = await extractText(pdf, {mergePages: true})

    return text
}

async function parseDOCX(buffer: Buffer): Promise<string> {
    const mammoth = await import('mammoth')

    const result = await mammoth.extractRawText({buffer})
    return result.value
}

export async function extractMaterialText(buffer: Buffer, materialType: string): Promise<string> {
    switch(materialType) {
        case 'pdf':
            return parsePDF(buffer)
        
        case 'docx':
            return  parseDOCX(buffer)
        
        case 'txt':
            return buffer.toString('utf-8')
        default:
            throw new Error(`unsupported file types`)
    }
}