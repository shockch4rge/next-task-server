import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";

import { Task } from "../task";
import { Board } from "../board";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn() id!: string;

    @Column() name!: string;

    @Column() email!: string;

    @OneToMany(() => Task, task => task.author) tasks!: Task[];

	@ManyToMany(() => Board, board => board.users) boards!: Board[];
}