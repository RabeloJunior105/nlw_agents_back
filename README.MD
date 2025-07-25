# Agent IA - Backend (Server)

Este é o backend do Agent IA, responsável por gerenciar salas, perguntas, respostas e transcrição de áudio com IA.

## Tecnologias

- [Fastify](https://fastify.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL + pgvector](https://github.com/pgvector/pgvector)
- [Google Gemini API](https://ai.google.dev/)
- [Zod](https://zod.dev/)

## Requisitos

- Node.js 18+
- Docker (para banco de dados PostgreSQL com pgvector)

## Banco de Dados

Suba o banco de dados com Docker:

```sh
docker compose up -d
```

## Instalação

```sh
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` baseado no exemplo abaixo:

```
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5433/nlw-agent
```

## Migrações e seed

```sh
npm run db:migrate
npm run db:seed
```

## Desenvolvimento

```sh
npm run dev
```

A API estará disponível em [http://localhost:3000](http://localhost:3000).

## Endpoints principais

- `GET /rooms` — Lista salas
- `POST /rooms` — Cria sala
- `GET /rooms/:id/questions` — Lista perguntas de uma sala
- `POST /rooms/:id/questions` — Cria pergunta
- `POST /rooms/:id/audio` — Envia áudio para transcrição

---
