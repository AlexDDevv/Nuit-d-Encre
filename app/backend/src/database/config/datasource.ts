import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ["./src/database/entities/**/*.ts"],
    synchronize: true,
    logging: true,
});
