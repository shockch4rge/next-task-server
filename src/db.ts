import { DataSource } from "typeorm";

import { User } from "./user/User";

export const db = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "next-task",
    entities: [User],
    synchronize: true,
    logging: false,
});