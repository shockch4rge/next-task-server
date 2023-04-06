import { Body, Controller, Delete, Get, Path, Post, Put, Route, SuccessResponse } from "tsoa";

import { TaskCreate, TaskDelete, TaskGet } from "./Task";
import { TaskService } from "./TaskService";

import type { TaskUpdate } from "./Task";

@Route("tasks")
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

	@SuccessResponse("201")
    @Post()
    public async create(@Body() request: TaskCreate): Promise<any> {
        console.log(request);
        return this.taskService.create(request);
    }

    @Put(`{id}`)
	public async update(@Path() id: TaskUpdate["id"], @Body() task: Omit<TaskUpdate, "id">) {
	    return this.taskService.update({
	        id,
	        ...task,
	    });
	}

    @Delete(`{id}`)
    public async delete(@Path() id: TaskDelete) {
        return this.taskService.delete(id);
    }
}