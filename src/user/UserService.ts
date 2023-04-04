import { User } from "./User";

export class UserService {
    public async getById(id: User["id"]) {
        return User.findOneBy({ id });
    }

    public async getAll() {
        return User.find();
    }
	
}
