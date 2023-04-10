import { tri } from "try-v2";
import {
    Body, Controller, Delete, Example, Get, Path, Post, Put, Response, Route, Security,
    SuccessResponse
} from "tsoa";
import * as yup from "Yup";

import { Task, TaskCreate, TaskDelete, TaskGet } from "./Task";

import type { TaskUpdate } from "./Task";
@Route("/tasks")
export class TaskController extends Controller {
    @SuccessResponse(200, "OK")
    @Response<string>(404, "Task not found")
    @Security("jwt")
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
        authorId: "user1",
        boardId: "board1",
    })
    @SuccessResponse(200, "OK")
    @Response<yup.ValidationError>(422)
    @Security("jwt")
    @Post()
    public async create(@Body() body: TaskCreate) {
        const [validationError, task] = await tri(() => {
            const schema = yup.object()
                .shape({
                    title: yup.string().required(),
                    description: yup.string().required(),
                    authorId: yup.string().required(),
                    boardId: yup.string().required(),
                });

            return schema.validate(body);
        });

        if (validationError) {
            this.setStatus(422);
            return validationError.message;
        }

        return Task.create({ ...task, status: "open" }).save();
    }

    @SuccessResponse(200, "OK")
    @Response<yup.ValidationError>(422)
    @Security("jwt")
    @Put(`/{id}`)
    public async update(@Path() id: TaskUpdate["id"], @Body() body: Omit<TaskUpdate, "id">) {
        const [validationError, task] = await tri(() => {
            const schema = yup
                .object<TaskUpdate>()
                .shape({
                    title: yup.string().optional(),
                    description: yup.string().optional(),
                    status: yup
                        .string<NonNullable<TaskUpdate["status"]>>()
                        .optional(),
                });

            return schema.validate(body);
        });

        if (validationError) {
            this.setStatus(422);
            return validationError.message;
        }

        return Task.update(id, task);
    }

    @SuccessResponse(200, "OK")
    @Response<string>(400, "Task not found")
    @Security("jwt")
    @Delete(`/{id}`)
    public async delete(@Path() id: TaskDelete) {
        const task = await Task.findOneBy({ id });

        if (!task) {
            this.setStatus(404);
            return "Task not found";
        }

        return Task.remove([task]);
    }
}