import { Request as KoaRequest } from "koa";
import { tri } from "try-v2";
import { Body, Controller, Delete, Example, Get, Path, Post, Put, Request, Response, Route, Security, SuccessResponse } from "tsoa";
import * as yup from "yup";

import { User } from "../user";
import { Folder, FolderCreate, FolderGet, FolderMove, FolderUpdate } from "./Folder";
import type { Board } from "../board";
import { MoreThan } from "typeorm";

@Security("jwt")
@Route("/folders")
export class FolderController extends Controller {
    @SuccessResponse(200, "OK")
    @Response<string>(404, "No folder found with id {id}")
    @Get(`{id}`)
    public async get(@Path() id: FolderGet) {
        const folder = Folder.findOneBy({ id });

        if (!folder) {
            this.setStatus(404);
            return `No folder found with id ${id}`;
        }

        return folder;
    }

    @SuccessResponse(200, "OK")
    @Response<yup.ValidationError>(400)
    @Response<string>(404, "No board found with id {id}")
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

    @SuccessResponse(200, "OK")
    @Response<yup.ValidationError>(400)
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

    @SuccessResponse(200, "OK")
    @Response<string>(404, "No board found with id <id>")
    @Delete(`/{id}`)
    public async delete(@Path() id: string) {
        const folder = await Folder.findOneBy({ id });

        if (!folder) {
            this.setStatus(404);
            return `No board found with id ${id}`;
        }

        const { boardId, boardIndex } = folder;
        const count = await Folder.countBy({ boardId });

        await folder.remove();

        if (boardIndex === 0) {
            await Folder
                .getRepository()
                .decrement(
                    { boardId },
                    "boardIndex",
                    1
                );
        }
        else if (boardIndex > 0 && boardIndex < count) {
            await Folder
                .getRepository()
                .decrement(
                    { boardId, boardIndex: MoreThan(boardIndex) },
                    "boardIndex",
                    1
                );
        }
    }

    @SuccessResponse(200, "OK")
    @Response<string>(404, "No folders found for board <id>")
    @Get(`/board/{boardId}`)
    public async boardFolders(@Path() boardId: Board["id"]) {
        const folders = Folder.find({
            where: { boardId },
            order: { boardIndex: "asc" }
        });

        if (!folders) {
            this.setStatus(404);
            return `No folders found for board ${boardId}`;
        }

        return folders;
    }

    @Example<FolderMove>({
        index: 0,
    })
    @SuccessResponse(200, "OK")
    @Response<yup.ValidationError>(400)
    @Response<string>(404, "No folder found with id {id}")
    @Put(`/board/{boardId}/move/{folderId}`)
    public async move(@Path() boardId: Board["id"], @Path() folderId: Folder["id"], @Body() body: FolderMove) {
        const [validationError, folderData] = await tri(() => {
            const schema = yup.object<FolderUpdate>().shape({
                index: yup.number().required(),
                boardId: yup.string().required(),
            });
            return schema.validate(body);
        });

        if (validationError) {
            this.setStatus(400);
            return validationError;
        }

        const folder = await Folder.findOneBy({ id: folderId });

        if (!folder) {
            this.setStatus(404);
            return `No folder found with id ${folderId}`;
        }

        const { index: newIndex } = folderData;
        const count = await Folder.countBy({ boardId });

        if (newIndex === 0) {
            folder.boardIndex = 0;
            await Folder
                .getRepository()
                .increment(
                    { boardId },
                    "boardIndex",
                    1
                );
        }
        else if (newIndex === count) {
            folder.boardIndex = count;
        }
        else {
            folder.boardIndex = newIndex;
            await Folder
                .getRepository()
                .increment(
                    { boardId, boardIndex: MoreThan(newIndex) },
                    "boardIndex",
                    1
                );
        }

        return folder.save();
    }
}