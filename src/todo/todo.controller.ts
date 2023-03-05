import {Controller, Get, Body, UsePipes, Post, Param} from "@nestjs/common";
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
}
