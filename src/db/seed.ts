import { reset, seed } from 'drizzle-seed';
import { schema } from './schema/index.ts';
import { db, sql } from './connection.ts';

await reset(db, schema);
await seed(db, schema).refine((f) => {
    return {
        rooms: {
            count: 5,
            columns: {
                name: f.companyName(),
                description: f.loremIpsum(),
                createdAt: f.date(),
                updatedAt: f.date(),
            },
        },
        questions: {
            count: 5
        }
    }
});

await sql.end();

// biome-ignore lint/suspicious/noConsole: This is a script for resetting and seeding the database.
console.log('Database reset and seeded successfully.');
