import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { generateEmbeddings, transcriptionAudio } from "../services/gemini.ts";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
    app.post('/rooms/:id/audio',
        async (request, reply) => {
            const { id } = request.params as { id: string }
            const audio = await request.file()

            if (!audio) {
                throw new Error("Audio is required")
            }


            const audioBuffer = await audio.toBuffer()
            const audiobase64 = audioBuffer.toString('base64')
            const transcription = await transcriptionAudio(audiobase64, audio.mimetype)
            const embeddings = await generateEmbeddings(transcription)

            const result = db.insert(schema.audioChunks).values({
                roomId: id,
                transcription,
                embeddings
            }).returning()

            const chunk = await result;

            if (!chunk) {
                throw new Error("Failed to save audio chunk")
            }

            return reply.status(201).send({ chunkId: chunk[0].id });
        }
    );
}