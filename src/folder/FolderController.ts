import { Request as KoaRequest } from "koa";
import { tri } from "try-v2";
import { Body, Controller, Delete, Example, Get, Path, Post, Put, Request, Response, Route, Security } from "tsoa";
import * as yup from "yup";

import { User } from "../user";
import { Folder, FolderCreate, FolderGet, FolderUpdate } from "./Folder";
import { Board } from "../board";

@Security("jwt")
@Route("/folders")
export class FolderController extends Controller {
    @Get(`{id}`)
    public async get(@Path() id: FolderGet) {
        const folder = Folder.findOneBy({ id });

        if (!folder) {
            this.setStatus(404);
            return `No folder found with id ${id}`;
        }

        return folder;
    }

    @Example<FolderCreate>({
        title: "Folder title",
        description: "Folder description",
    })
    @Response<yup.ValidationError>(400)
    @Response<string>(404, "Folder not found")
    @Post()
    public async create(@Body() body: FolderCreate, @Request() req: KoaRequest) {
        const [validationError, folder] = await tri(() => {
            const schema = yup.object<FolderCreate>().shape({
                title: yup.string().required(),
                boardId: yup.string().required(),
                description: yup.string().required(),
            });
            return schema.validate(body);
        });

        if (validationError) {
            this.setStatus(400);
            return validationError;
        }

        const user = await User.findOneBy({ id: req.ctx.state.user.id });

        if (!user) {
            this.setStatus(404);
            return `No user found with id ${req.ctx.state.user.id}`;
        }

        return Folder.create({
            ...folder,
            tasks: [],
        }).save();
    }

    @Put(`/{id}`)
    public async update(@Path() id: string, @Body() body: FolderUpdate) {
        const [validationError, folder] = await tri(() => {
            const schema = yup.object<FolderUpdate>().shape({
                title: yup.string(),
                boardId: yup.string(),
                description: yup.string(),
            });
            return schema.validate(body);
        });

        if (validationError) {
            this.setStatus(400);
            return validationError;
        }

        return Folder.save({ id, ...folder });
    }

    @Delete(`/{id}`)
    public async delete(@Path() id: string) {
        const folder = await Folder.findOneBy({ id });

        if (!folder) {
            this.setStatus(404);
            return `No folder found with id ${id}`;
        }

        return folder.remove();
    }
}