import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import z from "zod/v4";
import { desc, eq } from "drizzle-orm";

const validationZod = {
    schema: {
        params: z.object({
            id: z.string(),
        })
    }
}
export const getRoomsQuestionsRoute: FastifyPluginCallbackZod = (app) => {
    app.get('/rooms/:id/questions', validationZod,
        async (request) => {
            const { id } = request.params;

            const results = await db.select({
                id: schema.questions.id,
                question: schema.questions.question,
                answer: schema.questions.answer,
                createdAt: schema.questions.createdAt,
            })
                .from(schema.questions)
                .where(
                    eq(schema.questions.roomId, id)
                )
                .orderBy(desc(schema.questions.createdAt));
                
            return results;
        }
    );
}