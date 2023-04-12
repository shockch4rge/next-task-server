import { Request as KoaRequest } from "koa";
import { tri } from "try-v2";
import { Body, Controller, Delete, Get, Path, Post, Put, Request, Route, Security } from "tsoa";
import * as yup from "yup";

import { Board } from "../board";
import { User } from "../user";
import { Folder, FolderCreate, FolderGet, FolderUpdate } from "./Folder";

@Security("jwt")
@Route("/folders")
export class FolderController extends Controller {
    @Get(`{id}`)
    public async get(@Path() id: FolderGet) {
        const board = Board.findOneBy({ id });

        if (!board) {
            this.setStatus(404);
            return `No board found with id ${id}`;
        }

        return board;
    }

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
            title: folder.title,
            description: folder.description,
            boardId: folder.boardId,
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
            return `No board found with id ${id}`;
        }

        return folder.remove();
    }
}