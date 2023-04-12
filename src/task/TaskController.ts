import { Request as KoaRequest } from "koa";
import { tri } from "try-v2";
import {
    Body, Controller, Delete, Example, Get, Path, Post, Put, Request, Response, Route, Security,
    SuccessResponse
} from "tsoa";
import * as yup from "Yup";

import { Task, TaskCreate, TaskDelete, TaskGet, TaskUpdate } from "./Task";

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
        boardId: "board1",
    })
    @SuccessResponse(200, "OK")
    @Response<yup.ValidationError>(422)
    @Security("jwt")
    @Post()
    public async create(@Body() body: TaskCreate, @Request() req: KoaRequest) {
        const [validationError, task] = await tri(() => {
            const schema = yup.object()
                .shape({
                    title: yup.string().required(),
                    description: yup.string().required(),
                    boardId: yup.string().required(),
                });

            return schema.validate(body);
        });

        if (validationError) {
            this.setStatus(422);
            return validationError.message;
        }

        return Task.create({
            ...task,
            authorId: req.ctx.state.user.id,
            status: "open"
        }).save();
    }

    @Example<TaskUpdate>({
        title: "Task 2",
        description: "This is a new task description",
        status: "complete",
    })
    @SuccessResponse(200, "OK")
    @Response<yup.ValidationError>(422)
    @Response<string>(404, "Task not found")
    @Security("jwt")
    @Put(`/{id}`)
    public async update(@Path() id: Task["id"], @Body() body: TaskUpdate) {
        const task = await Task.findOneBy({ id });

        if (!task) {
            this.setStatus(404);
            return "Task not found";
        }

        const [validationError, newTaskData] = await tri(() => {
            const schema = yup
                .object<Omit<TaskUpdate, "id">>()
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
    @Response<string>(400, "Task not found")
    @Security("jwt")
    @Delete(`/{id}`)
    public async delete(@Path() id: TaskDelete) {
        const task = await Task.findOneBy({ id });

        if (!task) {
            this.setStatus(404);
            return "Task not found";
        }

        return task.remove();
    }
}