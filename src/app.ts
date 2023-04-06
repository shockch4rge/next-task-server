import Koa from "koa";

import KoaRouter from "@koa/router";

import { RegisterRoutes } from "./routing/routes";
import { db } from "./db";
import bodyParser from "koa-bodyparser";

db.initialize()
    .then(() => {
        const app = new Koa();
        const router = new KoaRouter();
        
        app.use(bodyParser());
        	
        RegisterRoutes(router);
        app.use(router.routes());
        app.use(router.allowedMethods());

        app.listen(4000, () => console.log("Server/DB running"));
    })
    .catch((err: Error) => console.error(err));