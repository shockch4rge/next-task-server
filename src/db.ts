import { DataSource } from "typeorm";
import { User } from "./user/User";
import { Book } from "./book/Book";

export const AppDataSource= new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "libraryapp",
    entities: [User, Book],
    synchronize: true,
    logging: false,
});
