import "reflect-metadata";
import "dotenv/config";
import { join } from "path";
import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [join(__dirname, "../entities/**/*.{ts,js}")],
    migrations: [join(__dirname, "../migrations/**/*.{ts,js}")],
    synchronize: false,
    migrationsRun: true,
    logging: true,
});
