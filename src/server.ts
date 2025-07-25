import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { fastifyMultipart } from '@fastify/multipart'
import { fastifyCors } from '@fastify/cors';
import { env } from './env.ts';
import { getRoomsRoute } from './http/routes/get-rooms.ts';
import { createRoomRoutes } from './http/routes/create-rooms.ts';
import { getRoomsQuestionsRoute } from './http/routes/get-room-questions.ts';
import { createQuestionRoutes } from './http/routes/create-questions.ts';
import { uploadAudioRoute } from './http/routes/upload-audio.ts';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: '*',
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.register(fastifyMultipart)

app.get('/health', () => {
  return 'ok';
});

app.register(getRoomsRoute);
app.register(createRoomRoutes)
app.register(getRoomsQuestionsRoute)
app.register(createQuestionRoutes)
app.register(uploadAudioRoute)

app.listen({ port: env.PORT });
