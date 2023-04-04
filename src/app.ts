import { AppDataSource } from "./db";
import { RegisterRoutes } from "../build/routes";
import Koa from "koa";
import KoaRouter from "@koa/router";

AppDataSource.initialize()
    .then(async () => {
        console.log("Database connection established");

        const app = new Koa();

        // Registering the auto-generated routes from tsoa
        const router = new KoaRouter();
        RegisterRoutes(router);
        app.use(router.routes());
        app.use(router.allowedMethods());

        app.listen(3000, () => {
            console.log("Server is running on http://localhost:3000");
        });
    })
    .catch((error: Error) => console.error(error));