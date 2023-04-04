import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { User } from "../user";

@Entity()
export class Todo extends BaseEntity {
    @Column() id!: string;

    @Column() title!: string;

    @Column() description!: string;

    @Column() status!: "complete" | "open" | "pending";

    @ManyToOne(() => User)
    @JoinColumn() author!: User;
}

export type TodoGet = Todo["id"];
export type TodoCreate = Pick<Todo, "description" | "title"> & { authorId: User["id"] };
export type TodoUpdate = Partial<Pick<Todo, "description" | "status" | "title">> & Pick<Todo, "id">;
export type TodoDelete = Todo["id"];