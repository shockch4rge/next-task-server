import { In } from "typeorm";
import { User } from "../user";
import { uuid } from "../util/uuid";
import type { BoardGet, BoardCreate, BoardUpdate, BoardDelete, BoardAddUsers } from "./Board";
import { Board } from "./Board";

export class BoardService {
    public async get(id: BoardGet) {
        return Board.findOneBy({ id });
    }

    public async create(board: BoardCreate) {
        const user = await User.findOneBy({ id: board.userId });

        if (!user) {
            throw new Error("User not found");
        }

        const newBoard = new Board();
        newBoard.id = uuid();
        newBoard.title = board.title;
        newBoard.description = board.description;
        newBoard.users = [user];

        return newBoard.save();
    }

    // public async update(board: BoardUpdate) {
    //     return Board.update(board.id, board);
    // }

    // public async delete(id: BoardDelete) {
    //     return Board.delete(id);
    // }

}