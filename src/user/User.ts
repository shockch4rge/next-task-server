import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { instanceToPlain } from "class-transformer";

import { Task } from "../task";
import { Board } from "../board";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    readonly id!: string;

    @Column()
    readonly name!: string;

    @Column()
    readonly email!: string;

    @Column()
    readonly password!: string;

    @OneToMany(() => Task, task => task.author)
    public tasks!: Task[];

    @ManyToMany(() => Board, board => board.users)
    public boards!: Board[];
}

export type UserLogin = Pick<User, "email" | "password">;
export type UserRegister = Pick<User, "email" | "name" | "password">;
export type UserDelete = Pick<User, "email" | "password">;