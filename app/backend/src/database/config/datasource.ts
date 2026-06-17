import "reflect-metadata";
import "dotenv/config";
import { join } from "path";
import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: "postgres",
    uuidExtension: "pgcrypto",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [join(__dirname, "../entities/**/*.{ts,js}")],
    migrations: [join(__dirname, "../migrations/**/*.{ts,js}")],
    synchronize: false,
    // Auto-run pending migrations on boot in dev for convenience. In prod,
    // run them as an explicit deploy step (pnpm migration:run) so a failing
    // or slow migration can't block app startup or race across instances.
    migrationsRun: process.env.NODE_ENV !== "production",
    logging: true,
});
