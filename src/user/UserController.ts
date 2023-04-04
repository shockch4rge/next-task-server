import { Controller, Get, Path, Route, SuccessResponse } from "tsoa";
import { UserService } from "./UserService";

@Route("users")
export class UserController extends Controller {
    readonly userService: UserService;

    constructor() {
        super();
        this.userService = new UserService();
    }

    @SuccessResponse(200, "Returning all users")
	@Get()
    public async getAll() {
        return this.userService.getAll();
    }

    @SuccessResponse(200, "Returning user")
    @Get(`{userId}`)    
    public async getById(@Path() userId: string) {
	    return this.userService.getById(userId);
    }
        
}