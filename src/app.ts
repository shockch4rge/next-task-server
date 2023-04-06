import Koa from "koa";

import KoaRouter from "@koa/router";

import { RegisterRoutes } from "../routing/routes";
import { db } from "./db";
import bodyParser from "koa-bodyparser";

db.initialize()
    .then(() => {
        console.log("Database connection established");

        const app = new Koa();
        const router = new KoaRouter();
        
        app.use(bodyParser());
        	
        RegisterRoutes(router);
        app.use(router.routes());
        app.use(router.allowedMethods());

        app.listen(3000, () => console.log("Server is running on http://localhost:3000"));
    })
    .catch((err: Error) => console.error(err));