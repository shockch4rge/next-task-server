import { Body, Controller, Delete, Get, Path, Post, Put, Route } from "tsoa";

import { TaskCreate, TaskDelete, TaskGet } from "./Task";
import { TodoService as TaskService } from "./TaskService";

import type { TaskUpdate } from "./Task";

@Route("todos")
export class TaskController extends Controller {
    readonly taskService: TaskService;

    constructor() {
        super();
        this.taskService = new TaskService();
    }

    @Get(`{id}`)
    public async get(@Path() id: TaskGet) {
        return this.taskService.get(id);
    }

    @Post()
    public async create(@Body() todo: TaskCreate) {
        return this.taskService.create(todo);
    }

    @Put(`{id}`)
    public async update(@Path() id: TaskUpdate["id"], @Body() todo: Omit<TaskUpdate, "id">) {
        return this.taskService.update({
            id,
            ...todo,
        });
    }

    @Delete(`{id}`)
    public async delete(@Path() id: TaskDelete) {
        return this.taskService.delete(id);
    }
}