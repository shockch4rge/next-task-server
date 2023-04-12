import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
}

export type FolderGet = Folder["id"];
export type FolderCreate = Pick<Folder, "description" | "title">;
export type FolderUpdate = Partial<Pick<Folder, "description" | "title">>;