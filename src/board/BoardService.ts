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

        return Board.create({
            id: uuid(),
            title: board.title,
            description: board.description,
            users: [user],
        }).save();
    }

    public async addUsers(request: BoardAddUsers) {
        const board = await Board.findOne({ where: { id: request.id }, relations: {
            users: true,
        } });

        console.log(board);

        if (!board) {
            throw new Error("Board not found");
        }

        const newUsers = await User.find({ where: { id: In(request.userIds) } });

        if (!newUsers || newUsers.length !== request.userIds.length) {
            throw new Error("Some users not found");
        }

        board.users = board.users.concat(newUsers);

        return board.save();
    }

    // public async update(board: BoardUpdate) {
    //     return Board.update(board.id, board);
    // }

    // public async delete(id: BoardDelete) {
    //     return Board.delete(id);
    // }

}