import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from 'zod/v4'
import { schema } from "../../db/schema/index.ts";
import { db } from "../../db/connection.ts";

const zodProvider = {
    schema: {
        body: z.object({
            name: z.string().min(1),
            description: z.string().optional()
        })
    }
}
export const createRoomRoutes: FastifyPluginCallbackZod = (app) => {
    app.post('/rooms', zodProvider,
        async (request, reply) => {
            const { name, description } = request.body

            const result = await db.insert(schema.rooms).values({
                name,
                description
            }).returning()

            const insertedRomo = result[0]
            if (!insertedRomo) {
                throw new Error("Failed to create new room")
            }

            return reply.status(201).send({ roomId: insertedRomo.id })
        }
    );
}