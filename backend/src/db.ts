import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: "sqlite",
    database: "tgc.sqlite",
    entities: ["./src/entities/*.ts"],
    synchronize: true,
    logging: true
  });
  