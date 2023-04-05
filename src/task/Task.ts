import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { User } from "../user";

@Entity()
export class Task extends BaseEntity {
    @PrimaryColumn() id!: string;

    @Column() title!: string;

    @Column() description!: string;

    @Column() status!: "complete" | "open" | "pending";

    @ManyToOne(() => User, user => user.tasks) author!: User;
}

export type TaskGet = Task["id"];
export type TaskCreate = Pick<Task, "description" | "title"> & { authorId: User["id"] };
export type TaskUpdate = Partial<Pick<Task, "description" | "status" | "title">> & Pick<Task, "id">;
export type TaskDelete = Task["id"];