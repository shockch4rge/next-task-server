import { Request as KoaRequest } from "koa";
import { tri } from "try-v2";
import {
    Body, Controller, Delete, Example, Get, Path, Post, Put, Request, Response, Route, Security,
    SuccessResponse
} from "tsoa";
import { MoreThan, MoreThanOrEqual } from "typeorm";
import * as yup from "Yup";

import { Folder } from "../folder";
import { Task, TaskCreate, TaskDelete, TaskGet, TaskMove, TaskUpdate } from "./Task";

@Security("jwt")
@Route("/tasks")
export class TaskController extends Controller {
    @SuccessResponse(200, "OK")
    @Response<string>(404, "Task not found")
    @Get(`/{id}`)
    public async get(@Path() id: TaskGet) {
        const task = await Task.findOneBy({ id });

        if (!task) {
            this.setStatus(404);
            return "Task not found";
        }

        return task;
    }

    @Example<TaskCreate>({
        title: "Task 1",
        description: "This is a task description",
        boardId: "board1",
        folderId: "folder1",
    })
    @SuccessResponse(200, "OK")
    @Response<yup.ValidationError>(422)
    @Response<string>(404, "Folder not found")
    @Post(`/folder/{folderId}`)
    public async create(@Path() folderId: string, @Body() body: TaskCreate, @Request() req: KoaRequest) {
        const [validationError, taskData] = await tri(() => {
            const schema = yup.object<TaskCreate>()
                .shape({
                    title: yup.string().required(),
                    description: yup.string().required(),
                    boardId: yup.string().required(),
                    folderId: yup.string().required(),
                });

            return schema.validate(body);
        });

        if (validationError) {
            this.setStatus(422);
            return validationError.message;
        }

        const folder = await Folder.findOneBy({ id: folderId });

        if (!folder) {
            this.setStatus(404);
            return "Folder not found";
        }

        const folderIndex = await Task.count({
            where: { folderId }
        });

        const task = await Task.create({
            ...taskData,
            folderIndex,
            status: "open",
            authorId: req.ctx.state.user.id,
        }).save();

        await Folder.merge(folder, { tasks: [task] }).save();
    }

    @Example<TaskUpdate>({
        title: "Task 2",
        description: "This is a new task description",
        status: "complete",
    })
    @SuccessResponse(200, "OK")
    @Response<yup.ValidationError>(422)
    @Response<string>(404, "Task not found")
    @Put(`/{id}`)
    public async update(@Path() id: Task["id"], @Body() body: TaskUpdate) {
        const task = await Task.findOneBy({ id });

        if (!task) {
            this.setStatus(404);
            return "Task not found";
        }

        const [validationError, newTaskData] = await tri(() => {
            const schema = yup
                .object<TaskUpdate>()
                .shape({
                    title: yup.string().optional(),
                    description: yup.string().optional(),
                    status: yup
                        .string<NonNullable<TaskUpdate["status"]>>()
                        .oneOf(["open", "complete", "pending"])
                        .optional(),
                });

            return schema.validate(body);
        });

        if (validationError) {
            this.setStatus(422);
            return validationError.message;
        }

        return Task.merge(task, { ...newTaskData }).save();
    }

    @SuccessResponse(200, "OK")
    @Response<string>(404, "Task not found")
    @Delete(`/folder/{folderId}/{taskId}`)
    public async delete(@Path() folderId: Folder["id"], @Path() taskId: TaskDelete) {
        const task = await Task.findOneBy({ id: taskId });

        if (!task) {
            this.setStatus(404);
            return "Task not found";
        }

        const count = await Task.countBy({ folderId });

        await task.remove();

        if (task.folderIndex === 0) {
            await Task
                .getRepository()
                .decrement(
                    { folderId },
                    "folderIndex",
                    1,
                );
        }
        else if (task.folderIndex > 0 && task.folderIndex < count) {
            await Task
                .getRepository()
                .decrement(
                    { folderId, folderIndex: MoreThan(task.folderIndex) },
                    "folderIndex",
                    1,
                );
        }
    }

    @Example<TaskMove>({
        index: 0,
        folderId: "folder2",
    })
    @SuccessResponse(200, "OK")
    @Response<string>(404, "Task not found")
    @Response<yup.ValidationError>(422)
    @Put(`/folder/{folderId}/move/{taskId}`)
    public async move(@Path() folderId: string, @Path() taskId: string, @Body() body: TaskMove) {
        const [validationError, taskData] = await tri(() => {
            const schema = yup
                .object<TaskMove>()
                .shape({
                    index: yup.number().required(),
                    folderId: yup.string().required(),
                });

            return schema.validate(body);
        });

        if (validationError) {
            this.setStatus(422);
            return validationError;
        }

        const task = await Task.findOneBy({ id: taskId });

        if (!task) {
            this.setStatus(404);
            return "Task not found";
        }

        const folderLength = await Task.countBy({ folderId });

        const { index: newIndex, folderId: newFolderId } = taskData;

        // if folder has no items, reset task index to 0
        if (folderLength <= 0) {
            task.folderIndex = 0;
        }
        // if task is first in the list (top), increment all tasks' indexes after it
        else if (newIndex === 0) {
            task.folderIndex = 0;
            await Task.getRepository().increment({ folderId }, "folderIndex", 1);
        }
        // if new index is larger than new folder's length, cap the index to the length
        else if (newIndex > folderLength) {
            task.folderIndex = folderLength;
        }
        // if task is placed in the middle of the folder, increment all other tasks' indexes after the card's index
        else if (newIndex > 0 && newIndex < folderLength) {
            await Task.getRepository().increment(
                { folderId, folderIndex: MoreThanOrEqual(newIndex), },
                "folderIndex",
                1
            );
            // then save the index
            task.folderIndex = newIndex;
        }

        task.folderId = newFolderId;

        return task.save();
    }

    @Get(`/folder/{folderId}`)
    public async folderTasks(@Path() folderId: string) {
        return Task.find({
            where: { folderId },
            order: { folderIndex: "asc" },
        });
    }

    @Example<TaskMove>({
        index: 0,
        folderId: "folder2",
    })
    @SuccessResponse(200, "OK")
    @Response<string>(404, "Task not found")
    @Response<yup.ValidationError>(422)
    @Put(`/folder/{folderId}/move/{taskId}`)
    public async move(@Path() folderId: string, @Path() taskId: string, @Body() body: TaskMove) {
        const [validationError, taskData] = await tri(() => {
            const schema = yup
                .object<TaskMove>()
                .shape({
                    index: yup.number().required(),
                    folderId: yup.string().required(),
                });

            return schema.validate(body);
        });

        if (validationError) {
            this.setStatus(422);
            return validationError;
        }

        const task = await Task.findOneBy({ id: taskId });

        if (!task) {
            this.setStatus(404);
            return "Task not found";
        }

        const folderLength = await Task.countBy({ folderId });

        const { index: newIndex, folderId: newFolderId } = taskData;

        // if folder has no items, reset task index to 0
        if (folderLength <= 0) {
            task.folderIndex = 0;
        }
        // if task is first in the list (top), increment all tasks' indexes after it
        else if (newIndex === 0) {
            task.folderIndex = 0;
            await Task.getRepository().increment({ folderId }, "folderIndex", 1);
        }
        // if new index is larger than new folder's length, cap the index to the length
        else if (newIndex > folderLength) {
            task.folderIndex = folderLength;
        }
        // if task is placed in the middle of the folder, increment all other tasks' indexes after the card's index
        else if (newIndex > 0 && newIndex < folderLength) {
            await Task.getRepository().increment(
                { folderId, folderIndex: MoreThanOrEqual(newIndex), },
                "folderIndex",
                1
            );
            // then save the index
            task.folderIndex = newIndex;
        }

        task.folderId = newFolderId;

        return task.save();
    }

    @Get(`/folder/{folderId}`)
    public async folderTasks(@Path() folderId: string) {
        return Task.find({
            where: { folderId },
            order: { folderIndex: "asc" },
        });
    }
}