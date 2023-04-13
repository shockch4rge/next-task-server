import "@total-typescript/ts-reset";

import Koa from "koa";
import bodyParser from "koa-bodyparser";

import KoaRouter from "@koa/router";

import { RegisterRoutes } from "./routing/routes";
import { db } from "./db";
import cors from "@koa/cors";

db.initialize()
    .then(() => {
        const app = new Koa();
        const router = new KoaRouter();

        app.use(bodyParser());
		
        app.use(cors({
            origin: "*",
        }));

        RegisterRoutes(router);
        app.use(router.routes());
        app.use(router.allowedMethods());


        app.use(async (ctx, next) => {
            ctx.status = 404;
            await next();
        });

        app.use(async (ctx, next) => {
            ctx.status = 500;
            await next();
        });

        app.listen(4000, () => console.log("Server/DB running"));
    })
    .catch((err: Error) => console.error(err));