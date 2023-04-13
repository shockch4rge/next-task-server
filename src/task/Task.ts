import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../user";
import { Board } from "../board";
import { Folder } from "../folder/Folder";

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

    @ManyToOne(() => Board, board => board.tasks)
    public board!: Board;

    @Column("uuid")
    public boardId!: Board["id"];

    @ManyToOne(() => Folder, folder => folder.tasks)
    public folder!: Folder;

    @Column("uuid")
    public folderId!: Folder["id"];

    @Column()
    public folderIndex!: number;
}

export type TaskGet = Task["id"];
export type TaskCreate = Pick<Task, "description" | "title"> & {
    folderId: Folder["id"];
    boardId: Board["id"];
};
export type TaskUpdate = Partial<Pick<Task, "description" | "status" | "title">>;
export type TaskDelete = Task["id"];
export type TaskMove = {
    index: number;
    folderId: Folder["id"];
};