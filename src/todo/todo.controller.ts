import {Controller, Get, Body, UsePipes, Post, Param, Patch} from "@nestjs/common";
import {CustomResponseBodyInterface} from "../interfaces/custom-response-body.interface";
import {DatabaseService} from "../database/database.service";
import {TodoDataSchema, TodoDto} from "./dtos/todo.dto";
import {JoiValidationPipe} from "./pipes/joi-validation.pipe";
import {TodoEntity} from "../database/entities/todo.entity";

@Controller("todo")
export class TodoController {
    constructor(private readonly databaseService: DatabaseService) {}

    // Create

    @Post("add")
    @UsePipes(new JoiValidationPipe(TodoDataSchema))
    async create(@Body() todoDto: TodoDto): Promise<CustomResponseBodyInterface> {
        let newTodo: TodoEntity = await this.databaseService.createTodo(todoDto);

        return {
            message: "Todo added successfully.",
            data: newTodo
        };
    }

    // Read

    @Get()
    async getAll(): Promise<CustomResponseBodyInterface> {
        let todos: TodoEntity[] = await this.databaseService.getAllTodos();

        return {
            message: "Listing all todos.",
            data: todos
        };
    }

    @Get("id/:id")
    async getById(@Param("id") todoId: string): Promise<CustomResponseBodyInterface> {
        let todo: TodoEntity = await this.databaseService.getTodoById(todoId);

        return {
            message: `Listing todo of id: ${todoId}.`,
            data: todo
        };
    }

    @Get("description/:description")
    async  getByDescription(@Param("description") todoDescription: string): Promise<CustomResponseBodyInterface> {
        let todo: TodoEntity = await  this.databaseService.getTodoByDescription(todoDescription);

        return {
            message: `Listing todo of description: ${todoDescription}.`,
            data: todo
        };
    }

    @Get("checked")
    async getAllChecked(): Promise<CustomResponseBodyInterface> {
        let todos: TodoEntity[] = await this.databaseService.getAllCheckedTodos();

        return {
            message: "Listing all checked todos.",
            data: todos
        };
    }

    @Get("unchecked")
    async getAllUnchecked(): Promise<CustomResponseBodyInterface> {
        let todos: TodoEntity[] = await this.databaseService.getAllUncheckedTodos();

        return {
            message: "Listing all unchecked todos.",
            data: todos
        };
    }

    // Update

    @Patch("redescribe/:id")
    @UsePipes(new JoiValidationPipe(TodoDataSchema))
    async redescribe(@Param("id") todoId: string, @Body() todoDto: TodoDto): Promise<CustomResponseBodyInterface> {
        await this.databaseService.redescribeTodo(todoId, todoDto.description);

        return {
            message: "Todo description updated successfully."
        };
    }

    @Patch("check/:id")
    async check(@Param("id") todoId: string): Promise<CustomResponseBodyInterface> {
        await this.databaseService.checkTodo(todoId);

        return {
            message: "Todo checked successfully."
        };
    }

    @Patch("uncheck/:id")
    async uncheck(@Param("id") todoId: string): Promise<CustomResponseBodyInterface> {
        await this.databaseService.uncheckTodo(todoId);

        return {
            message: "Todo unchecked successfully."
        };
    }
}
