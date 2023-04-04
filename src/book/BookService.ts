import type { User } from "../user/User";
import { Book } from "./Book";

export class BookService {
    public async get(id: Book["id"]) {
        return Book.findOneBy({ id });
    }

    public async borrowedBy(userId: User["id"]) {
        return Book.find({
            where: {
                borrower: {
                    id: userId,
                }
            }
        });
    }
}