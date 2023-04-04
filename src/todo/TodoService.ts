import { uuid } from "../util/uuid";
import { Todo } from "./Todo";

import type { TodoCreate, TodoDelete, TodoUpdate } from "./Todo";

export class TodoService {
    async get(id: Todo["id"]) {
        return Todo.findOneBy({ id });
    }

    async create(todo: TodoCreate) {
        return Todo.create({
            ...todo,
            id: uuid(),
            status: "open",
        });
    }

    async update(todo: TodoUpdate) {
        return Todo.update(todo.id, todo);
    }

    async delete(id: TodoDelete) {
        return Todo.delete(id);
    }
}