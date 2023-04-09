import type { Request } from "koa";

import jwt from "jsonwebtoken";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { tri } from "try-v2";
import { Security } from "tsoa";
import * as yup from "yup";

const jwtSecret = readFileSync(join(process.cwd(), "private.key"));

export async function koaAuthentication(request: Request, securityName: string, scopes?: string[]) {
    if (securityName !== "jwt") {
        throw new Error("this literally should not happen");
    }

    const [error, token] = await tri<yup.ValidationError, string>(() => {
        // no 'Bearer' prefix in the header
        const schema = yup
            .string()
            .trim()
            .required();

        return schema.validate(request.header.authorization);
    });

    if (error) {
        throw new Error("Token not defined");
    }

    const payload = jwt.verify(token, jwtSecret, {
        algorithms: ["RS256"]
    });
    
    request.ctx.state.user = payload;
}

export const Auth = (scopes?: string[]) => Security("jwt", scopes);