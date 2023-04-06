import Koa from "koa";

import KoaRouter from "@koa/router";

import { db } from "./db";
import { RegisterRoutes } from "./routing/routes";

db.initialize()
    .then(() => {
        const app = new Koa();
        const router = new KoaRouter();

        RegisterRoutes(router);

        app.use(router.routes());
        app.use(router.allowedMethods());

        app.listen(4000, () => console.log("Server/DB running"));
    })
    .catch(console.error);