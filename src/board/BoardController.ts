import { Body, Controller, Delete, Get, Path, Post, Put, Request, Route } from "tsoa";
import { BoardService } from "./BoardService";
import type { BoardAddUsers, BoardUpdate } from "./Board";
import { BoardCreate, BoardGet, BoardDelete } from "./Board";
import * as koa from "koa";

@Route("boards")
export class BoardController extends Controller {
    readonly boardService: BoardService;

    constructor() {
        super();
        this.boardService = new BoardService();
    }

	@Get(`{id}`)
    public async get(@Path() id: BoardGet) {
        return this.boardService.get(id);
    }

	@Post()
	public async create(@Body() board: BoardCreate) {
	    return this.boardService.create(board);
	}

	@Put(`{id}/user`)
	public async addUsers(@Path() id: BoardAddUsers["id"], @Body() userIds: Omit<BoardAddUsers, "id">) {
	    return this.boardService.addUsers({ id, userIds: userIds.userIds });
	}



    // @Put(`{id}`)
    // public async update(@Path() id: BoardUpdate["id"], @Body() board: Omit<BoardUpdate, "id">) {
    //     return this.boardService.update({ id, ...board });
    // }

    // @Delete(`{id}`)
    // public async delete(@Path() id: BoardDelete) {
    //     return this.boardService.delete(id);
    // }
	
}