import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../user";

// import { Board } from "../board";

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column()
    public title!: string;

    @Column()
    public description!: string;

    @Column()
    public status!: "complete" | "open" | "pending";

    @ManyToOne(() => User, user => user.tasks) 
    public author!: User;
    
    @Column("uuid") 
    public authorId!: User["id"];

    // @ManyToOne(() => Board, board => board.tasks) board!: Board;
    // @Column() boardId!: Board["id"];
}

export type TaskGet = Task["id"];
export type TaskCreate = Pick<Task, "description" | "title"> & { authorId: User["id"] } & { boardId: string };
export type TaskUpdate = Partial<Pick<Task, "description" | "status" | "title">>;
export type TaskDelete = Task["id"];