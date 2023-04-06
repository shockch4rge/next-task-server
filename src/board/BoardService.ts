import { uuid } from "../util/uuid";
import type { BoardGet, BoardCreate, BoardUpdate, BoardDelete } from "./Board";
import { Board } from "./Board";

export class BoardService {
    public async get(id: BoardGet) {
        return Board.findOneBy({ id });
    }

    public async create(board: BoardCreate) {
        return Board.insert({
            ...board,
            id: uuid(),
        });
    }

    // public async update(board: BoardUpdate) {
    //     return Board.update(board.id, board);
    // }

    // public async delete(id: BoardDelete) {
    //     return Board.delete(id);
    // }

}