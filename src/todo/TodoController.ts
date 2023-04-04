import { Body, Controller, Delete, Get, Path, Post, Put, Route } from "tsoa";

import { TodoCreate, TodoDelete, TodoGet } from "./Todo";
import { TodoService } from "./TodoService";

import type { TodoUpdate } from "./Todo";

@Route("todos")
export class TodoController extends Controller {
    readonly todoService: TodoService;

    constructor() {
        super();
        this.todoService = new TodoService();
    }

    @Get(`{id}`)
    public async get(@Path() id: TodoGet) {
        return this.todoService.get(id);
    }

    @Post()
    public async create(@Body() todo: TodoCreate) {
        return this.todoService.create(todo);
    }

    @Put(`{id}`)
    public async update(@Path() id: TodoUpdate["id"], @Body() todo: Omit<TodoUpdate, "id">) {
        return this.todoService.update({
            id,
            ...todo,
        });
    }

    @Delete(`{id}`)
    public async delete(@Path() id: TodoDelete) {
        return this.todoService.delete(id);
    }
}