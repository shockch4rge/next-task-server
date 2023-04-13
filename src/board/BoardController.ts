import { Body, Controller, Delete, Get, Path, Post, Put, Request, Route, Security } from "tsoa";
import { In } from "typeorm";
import { User } from "../user";
import type { BoardAddUsers } from "./Board";
import { Board, BoardCreate, BoardDelete, BoardGet, BoardUpdate } from "./Board";
import { Request as KoaRequest } from "koa";
import { db } from "../db";

@Security("jwt")
@Route("boards")
export class BoardController extends Controller {
	@Get()
    public async getAll(@Request() req: KoaRequest) {
        return Board.find({ relations: { 
            users: true
        }, where: {
            users: {
                id: req.ctx.state.user.id
            }
        }
        });
    }


	@Get(`{id}`)
	public async get(@Path() id: BoardGet) {
	    return Board.findOneBy({ id });
	}

	@Post()
	public async create(@Body() board: BoardCreate, @Request() req: KoaRequest) {
	    const user = await User.findOneBy({ id: req.ctx.state.user.id });

	    if (!user) {
	        this.setStatus(404);
	        return `No user found with id ${req.ctx.state.user.id}`;
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
	        this.setStatus(404);
	        return `No board found with id ${id}`;
	    } 

	    const newUsers = await User.find({ where: { id: In(userIds) } });

	    if (!newUsers || newUsers.length !== userIds.length) {
	        this.setStatus(404);
	        return `Some users not found`;
	    }

	    return Board.merge(board, { users: newUsers }).save();

	}

  	@Delete(`{id}/user`)
	public async removeUsers(@Path() id: BoardAddUsers["id"], @Body() userIds: BoardAddUsers["userIds"]) {
	    const board = await Board.findOne({ where: { id }, relations: {
	        users: true,
	    } });

	    if (!board) {
	        this.setStatus(404);
	        return `No board found with id ${id}`;
	    } 

	    const removedUsers = await User.find({ where: { id: In(userIds) } });

	    if (!removedUsers || removedUsers.length !== userIds.length) {
	        this.setStatus(404);
	        return `Some users not found`;
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
