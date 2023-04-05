import { uuid } from "../util/uuid";
import { Task } from "./Task";

import type { TaskCreate, TaskDelete, TaskUpdate } from "./Task";

export class TodoService {
    async get(id: Task["id"]) {
        return Task.findOneBy({ id });
    }

    async create(todo: TaskCreate) {
        return Task.create({
            ...todo,
            id: uuid(),
            status: "open",
        });
    }

    async update(todo: TaskUpdate) {
        return Task.update(todo.id, todo);
    }

    async delete(id: TaskDelete) {
        return Task.delete(id);
    }
}