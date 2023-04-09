import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Request as KoaRequest } from "koa";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { tri } from "try-v2";
import {
    Body, Controller, Delete, Get, Path, Post, Request, Route, Security, SuccessResponse
} from "tsoa";
import * as yup from "yup";

import { User, UserDelete, UserLogin, UserRegister } from "./";

const jwtSecret = readFileSync(join(process.cwd(), "private.key"));

@Route("users")
export class UserController extends Controller {
    @SuccessResponse(200, "OK")
    @Get(`{id}`)
    public async get(@Path() id: string) {
        return User.findOneBy({ id });
    }

    @SuccessResponse(200, "OK")
    @Post(`/auth/register`)
    public async register(@Body() body: UserRegister) {
        const [validationError, credentials] = await tri(() => {
            const schema = yup.object()
                .shape({
                    email: yup
                        .string()
                        .email()
                        .required(),
                    name: yup.string().required(),
                    password: yup.string().required()
                });

            return schema.validate(body);
        });

        if (validationError) {
            throw new Error("Invalid credentials");
        }

        if (await User.findOneBy({ email: credentials.email })) {
            throw new Error("User with that email already exists");
        }

        const [hashError, hashedPassword] = await tri(argon2.hash(credentials.password));

        if (hashError) {
            this.setStatus(500);
            return "Internal error";
        }

        const user = await User.create({ ...credentials, password: hashedPassword }).save();
        const token = jwt.sign({ id: user.id }, jwtSecret, { algorithm: "RS256" });

        const partialUser = await User.findOne({
            where: {
                id: user.id
            },
            select: {
                password: false,
            },
            relations: {
                tasks: true,
            }
        });

        const { id, name, email } = partialUser!;

        return {
            id,
            name,
            email,
            token,
        };
    }

    @SuccessResponse(200, "OK")
    @Post(`/auth/login`)
    public async login(@Body() body: UserLogin) {
        const [error, user] = await tri(this.checkCredentials(body));

        if (error) {
            return error.message;
        }

        const token = jwt.sign({ id: user!.id }, jwtSecret, { algorithm: "RS256" });

        const { id, name, email, tasks } = user;

        return {
            id,
            name,
            email,
            tasks,
            token,
        };
    }

    @SuccessResponse(200, "OK")
    @Security("jwt")
    @Delete(`/auth/delete`)
    public async delete(@Body() body: UserDelete, @Request() req: KoaRequest) {
        const [error, user] = await tri(this.checkCredentials(body));

        if (error) {
            return error.message;
        }

        const [tokenError] = await tri(
            yup.object()
                .shape({
                    id: yup.string().required(),
                    iat: yup.number(),
                })
                .validate(req.ctx.state.user)
        );

        if (tokenError) {
            this.setStatus(500);
            return "Internal error";
        }

        await user.remove();
        return "User deleted";
    }

    private async checkCredentials(creds: { email: string; password: string }) {
        const [validationError, credentials] = await tri<yup.ValidationError, UserDelete>(() => {
            return yup.object()
                .shape({
                    email: yup
                        .string()
                        .email()
                        .required(),
                    password: yup.string().required()
                })
                .validate(creds);
        });

        if (validationError) {
            this.setStatus(422);
            throw new Error("Invalid credentials");
        }

        const user = await User.findOne({
            where: {
                email: credentials.email,
            },
            relations: {
                tasks: true
            }
        });

        if (!user) {
            this.setStatus(400);
            throw new Error("Incorrect email or password");
        }

        const [hashCheckError, hashVerified] = await tri(argon2.verify(user.password, credentials.password));

        if (hashCheckError) {
            this.setStatus(500);
            throw new Error("Internal error");
        }

        if (!hashVerified) {
            this.setStatus(400);
            throw new Error("Incorrect email or password");
        }

        return user;
    }
}