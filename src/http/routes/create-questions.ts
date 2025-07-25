import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from 'zod/v4'
import { schema } from "../../db/schema/index.ts";
import { db } from "../../db/connection.ts";
import { generateAnswer, generateEmbeddings } from "../services/gemini.ts";
import { and, eq, sql } from "drizzle-orm";
import { id, tr } from "zod/locales";

const zodProvider = {
    schema: {
        params: z.object({
            id: z.string(),
        }),
        body: z.object({
            question: z.string().min(1),
        })
    }
}

export const createQuestionRoutes: FastifyPluginCallbackZod = (app) => {
    app.post('/rooms/:id/questions', zodProvider,
        async (request, reply) => {
            const { question } = request.body

            const embeddings = await generateEmbeddings(question)
            const embeddingsAsStrings = `[${embeddings.join(',')}]`

            const chunks = await db.select({
                id: schema.audioChunks.id,
                transcription: schema.audioChunks.transcription,
                similary: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsStrings}::vector)`
            })
                .from(schema.audioChunks)
                .where(
                    and(
                        eq(schema.audioChunks.roomId, request.params.id),
                        sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsStrings}::vector) > 0.7`
                    )
                )
                .orderBy(sql`${schema.audioChunks.embeddings} <=> ${embeddingsAsStrings}::vector`)
                .limit(3)


            let awnser: string | null = null
            if (chunks.length > 0) {
                const transcription = chunks.map(chunk => chunk.transcription)
                awnser = await generateAnswer(question, transcription)
            }

            if (!request.params.id) {
                throw new Error("Failed in not sended room id")
            }

            const result = await db.insert(schema.questions).values({
                question,
                roomId: request.params.id,
                answer: awnser,
            }).returning()

            const insertedArtfact = result[0]
            if (!insertedArtfact) {
                throw new Error("Failed to create new room")
            }

            return reply.status(201).send({
                questionId: insertedArtfact.id,
                awnser,
            })
        }
    );
}