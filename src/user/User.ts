import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

import { Task } from "../todo";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn() id!: string;

    @Column() name!: string;

    @Column() email!: string;
    
    @OneToMany(() => Task, task => task.author) tasks!: Task[];
}