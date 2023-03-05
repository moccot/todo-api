import {Controller, Get, Body, UsePipes, Post} from "@nestjs/common";
import {CustomResponseBodyInterface} from "../interfaces/custom-response-body.interface";
import {DatabaseService} from "../database/database.service";
import {TodoDataSchema, TodoDto} from "./dtos/todo.dto";
import {JoiValidationPipe} from "./pipes/joi-validation.pipe";
import {TodoEntity} from "../database/entities/todo.entity";

@Controller("todo")
export class TodoController {
    constructor(private readonly databaseService: DatabaseService) {}
    @Post("add")
    @UsePipes(new JoiValidationPipe(TodoDataSchema))
    async create(@Body() todoDto: TodoDto): Promise<CustomResponseBodyInterface> {
        let newTodo: TodoEntity = await this.databaseService.createTodo(todoDto);

        return {
            message: "Todo added successfully.",
            data: newTodo
        };
    }

    @Get()
    async getAll(): Promise<CustomResponseBodyInterface> {
        return {
            message: "OK"
        };
    }
}
