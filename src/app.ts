import { AppDataSource } from "./db";
import Koa from "koa";


AppDataSource.initialize()
    .then(async () => {
        console.log("Database connection established");
    })
    .catch((error: Error) => console.error(error));
