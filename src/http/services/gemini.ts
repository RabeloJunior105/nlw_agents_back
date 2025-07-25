import { GoogleGenAI } from '@google/genai'
import { ZodBase64 } from 'zod'

const genAi = new GoogleGenAI({
    apiKey: 'AIzaSyD_-3sax_b3bCD6UNDzfk887KfaT6vuPaQ'
})


const model = 'gemini-2.5-flash'

export async function transcriptionAudio(audioAsBase64: string, mimeType: string): Promise<string> {
    const response = await genAi.models.generateContent({
        model,
        contents: [
            {
                text: "Transcreva o áudio para português do Brasil (PT-BR). A transcrição deve ser precisa, natural e refletir fielmente a fala, incluindo gírias e regionalismos se presentes. Utilize pontuação adequada (vírgulas, pontos finais, interrogações, exclamações) e divida o texto em parágrafos lógicos para facilitar a leitura. Se houver pausas, hesitações ou interrupções, anote-as entre parênteses, por exemplo: (pausa), (risada), (interrupção)"
            },
            {
                inlineData: {
                    mimeType,
                    data: audioAsBase64
                }
            }
        ]
    })

    if (!response.text) {

        throw new Error("Ouve algum erro na conversão")
    }

    return response.text
}

export async function generateEmbeddings(text: string) {

    const response = await genAi.models.embedContent({
        model: 'text-embedding-004',
        contents: [
            {
                text
            }
        ],
        config: {
            taskType: 'RETRIEVAL_DOCUMENT'
        }
    })


    if (!response.embeddings?.[0]?.values) {
        throw new Error("Ouve algum erro na geração dos embeddings")
    }


    return response.embeddings[0].values as number[]
}


export async function generateAnswer(question: string, transcription: string[]) {
    const context = transcription.join('\n')
    const prompt2 = `
    Com base no contexto abaixo, responda a pergunta de forma direta e objetiva, em português do Brasil (PT-BR).

    Contexto: ${context}
    Pergunta: ${question}

    Instruções:
    - Ultilize apenas as informações do contexto para responder.
    - Se a resposta não estiver presente no contexto, informe que não foi possível encontrar a resposta.
    - Seja objetivo e claro, evitando rodeios.
    - Mantenha um tom educativo e profissional.
    - Cite trechos do contexto que foram utilizados para responder a pergunta, se possível.
    - Nao cite o contexto na resposta, apenas a resposta direta.
    `

    const response = await genAi.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                text: prompt2
            },
            {
                text: context
            }
        ]
    })


    if (!response.text) {
        throw new Error("Ouve algum erro na geração da resposta")
    }


    return response.text
}