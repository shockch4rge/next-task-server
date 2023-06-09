import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "../task";
import { User } from "../user";
import { Folder } from "../folder/Folder";

@Entity()
export class Board extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	public id!: string;

	@Column()
	public title!: string;

	@Column()
	public description!: string;

	@OneToMany(() => Folder, folder => folder.board)
	public folders!: Folder[];

	@OneToMany(() => Task, task => task.board)
	public tasks!: Task[];

	@ManyToMany(() => User, user => user.boards, {
		cascade: true,
	})
	@JoinTable({ name: "board_users" }) users!: User[];
}

export type BoardGet = Board["id"];
export type BoardCreate = Pick<Board, "description" | "title">;
export type BoardAddUsers = Pick<Board, "id"> & { userIds: Array<User["id"]> };
export type BoardUpdate = Partial<Pick<Board, "description" | "title">>;
export type BoardDelete = Board["id"];