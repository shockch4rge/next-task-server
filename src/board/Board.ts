import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Task } from "../task";
import { User } from "../user";

@Entity()
export class Board extends BaseEntity {
	@PrimaryColumn() id!: string;
	@Column() title!: string;
	@Column() description!: string;

	@OneToMany(()=> Task, task => task.board) tasks!: Task[];

	@ManyToMany(() => User)
	@JoinTable() users!: User[];
}

export type BoardGet = Board["id"];
export type BoardCreate = Pick<Board, "description" | "title"> & { userId: User["id"] };
export type BoardUpdate = Partial<Pick<Board, "description" | "title">> & Pick<Board, "id">;
export type BoardDelete = Board["id"];