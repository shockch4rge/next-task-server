import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "../task";
import { User } from "../user";

@Entity()
export class Board extends BaseEntity {
	@PrimaryGeneratedColumn("uuid") id!: string;
	@Column() title!: string;
	@Column() description!: string;

	@OneToMany(()=> Task, task => task.board) tasks!: Task[];

	@ManyToMany(() => User, user => user.boards, {
	    cascade: true,
	})
	@JoinTable({ name: "board_users" }) users!: User[];
}

export type BoardGet = Board["id"];
export type BoardCreate = Pick<Board, "description" | "title"> & { userId: User["id"] } ;
export type BoardAddUsers = Pick<Board, "id"> & { userIds: Array<User["id"]> };
export type BoardUpdate = Partial<Pick<Board, "description" | "title">>;
export type BoardDelete = Board["id"];