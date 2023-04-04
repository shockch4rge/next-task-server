import { Controller, Get, Path, Route, SuccessResponse } from "tsoa";

import { BookService } from "./BookService";

@Route("books")
export class BookController extends Controller {
    readonly bookService: BookService;

    constructor() {
        super();
        this.bookService = new BookService();
    }

    @SuccessResponse(200, "Returning book")
    @Get(`{id}`)
    public async get(@Path() id: string) {
        return this.bookService.get(id);
    }

    @SuccessResponse(200, "Returning user's borrowed books")
    @Get(`{userId}/borrowed`)
    public async borrowedBooks(@Path() userId: string) {
        return this.bookService.borrowedBy(userId);
    }
}