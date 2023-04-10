import { Body, Controller, Delete, Get, Path, Post, Put, Request, Route } from "tsoa";
import type { BoardAddUsers } from "./Board";
import { Board, BoardUpdate } from "./Board";
import { BoardCreate, BoardGet, BoardDelete } from "./Board";
import * as koa from "koa";
import { User } from "../user";
import { In } from "typeorm";
import { tri } from "try-v2";

@Route("boards")
export class BoardController extends Controller {
	@Get(`{id}`)
    public async get(@Path() id: BoardGet) {
        return Board.findOneBy({ id });
    }

	@Post()
	public async create(@Body() board: BoardCreate) {
	    const user = await User.findOneBy({ id: board.userId });

	    if (!user) {
	        throw new Error("User not found");
	    }

	    return Board.create({
	        title: board.title,
	        description: board.description,
	        users: [user],
	    }).save();
	}

	@Put(`{id}/user`)
	public async addUsers(@Path() id: BoardAddUsers["id"], @Body() userIds: BoardAddUsers["userIds"]) {
	    const board = await Board.findOne({ where: { id }, relations: {
	        users: true,
	    } });

	    if (!board) {
	        throw new Error("Board not found");
	    } 

	    const newUsers = await User.find({ where: { id: In(userIds) } });

	    if (!newUsers || newUsers.length !== userIds.length) {
	        throw new Error("Some users not found");
	    }

	    return Board.merge(board, { users: newUsers }).save();

	}

  	@Delete(`{id}/user`)
	public async removeUsers(@Path() id: BoardAddUsers["id"], @Body() userIds: BoardAddUsers["userIds"]) {
	    const board = await Board.findOne({ where: { id }, relations: {
	        users: true,
	    } });

	    if (!board) {
	        throw new Error("Board not found");
	    } 

	    const removedUsers = await User.find({ where: { id: In(userIds) } });

	    if (!removedUsers || removedUsers.length !== userIds.length) {
	        throw new Error("Some users not found");
	    }

	    board.users = board.users.filter(user => !userIds.includes(user.id));

	    return board.save();
	}

    @Put(`{id}`)
  	public async update(@Path() id: Board["id"], @Body() board: BoardUpdate) {
	    return Board.save({ id, ...board });
  	}
	
    @Delete(`{id}`)
    public async delete(@Path() id: BoardDelete) {
        const board = await Board.findOneBy({ id });

        if (!board) {
            this.setStatus(404);
            return `No board found with id ${id} `;
        }

        return board.remove();
    }
	
}
