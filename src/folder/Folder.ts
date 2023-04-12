import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Board } from "../board";
import { Task } from "../task";

@Entity()
export class Folder extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column()
    public title!: string;

    @Column()
    public description!: string;

    @OneToMany(() => Task, task => task.folder)
    public tasks!: Task[];

    @ManyToOne(() => Board, board => board.folders)
    public board!: Board;

    @Column("uuid")
    public boardId!: Board["id"];
}

export type FolderGet = Folder["id"];
export type FolderCreate = Pick<Folder, "description" | "title"> & { boardId: Board["id"] };
export type FolderUpdate = Partial<Pick<Folder, "description" | "title">>;