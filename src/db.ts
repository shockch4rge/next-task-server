import { DataSource } from "typeorm";

import { User } from "./user";
import { Task } from "./task";
import { Board } from "./board";
import { Folder } from "./folder";

export const db = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "next-task",
    entities: [User, Task, Board, Folder],
    synchronize: true,
    logging: false,
});