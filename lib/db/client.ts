import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch as it's not needed for most serverless environments
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
