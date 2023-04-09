import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { instanceToPlain } from "class-transformer";

import { Task } from "../task";

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
    readonly tasks!: Task[];

    // TODO: ManyToMany => Boards
    // @ManyToMany(() => Board, board.owner)
    // readonly boards!: Board[];
}

export type UserLogin = Pick<User, "email" | "password">;
export type UserRegister = Pick<User, "email" | "name" | "password">;
export type UserDelete = Pick<User, "email" | "password">;