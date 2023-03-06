import {Controller, Get, Body, UsePipes, Post, Param, Patch, Delete} from "@nestjs/common";
import {CustomResponseBodyInterface} from "../interfaces/custom-response-body.interface";
import {TodoService} from "../database/todo.service";
import {TodoDataSchema, TodoDto} from "./dtos/todo.dto";
import {JoiValidationPipe} from "./pipes/joi-validation.pipe";
import {TodoEntity} from "../database/entities/todo.entity";

@Controller("todo")
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    // Create

    @Post("add")
    @UsePipes(new JoiValidationPipe(TodoDataSchema))
    async create(@Body() data: TodoDto): Promise<CustomResponseBodyInterface> {
        let newTodo: TodoEntity = await this.todoService.create(data);

        return {
            message: "Todo added successfully.",
            data: newTodo
        };
    }

    // Read

    @Get()
    async getAll(): Promise<CustomResponseBodyInterface> {
        let todos: TodoEntity[] = await this.todoService.getAll();

        return {
            message: "Listing all todos.",
            data: todos
        };
    }

    @Get("id/:id")
    async getById(@Param("id") id: string): Promise<CustomResponseBodyInterface> {
        let todo: TodoEntity = await this.todoService.getById(id);

        return {
            message: `Listing todo of id: ${id}.`,
            data: todo
        };
    }

    @Get("description/:description")
    async  getByDescription(@Param("description") description: string): Promise<CustomResponseBodyInterface> {
        let todo: TodoEntity = await  this.todoService.getByDescription(description);

        return {
            message: `Listing todo of description: ${description}.`,
            data: todo
        };
    }

    @Get("checked")
    async getAllChecked(): Promise<CustomResponseBodyInterface> {
        let todos: TodoEntity[] = await this.todoService.getAllChecked();

        return {
            message: "Listing all checked todos.",
            data: todos
        };
    }

    @Get("unchecked")
    async getAllUnchecked(): Promise<CustomResponseBodyInterface> {
        let todos: TodoEntity[] = await this.todoService.getAllUnchecked();

        return {
            message: "Listing all unchecked todos.",
            data: todos
        };
    }

    // Update

    @Patch("redescribe/:id")
    @UsePipes(new JoiValidationPipe(TodoDataSchema))
    async redescribe(@Param("id") id: string, @Body() data: TodoDto): Promise<CustomResponseBodyInterface> {
        await this.todoService.redescribeById(id, data.description);

        return {
            message: "Todo description updated successfully."
        };
    }

    @Patch("check/:id")
    async check(@Param("id") id: string): Promise<CustomResponseBodyInterface> {
        await this.todoService.checkById(id);

        return {
            message: "Todo checked successfully."
        };
    }

    @Patch("uncheck/:id")
    async uncheck(@Param("id") id: string): Promise<CustomResponseBodyInterface> {
        await this.todoService.uncheckById(id);

        return {
            message: "Todo unchecked successfully."
        };
    }

    // Delete

    @Delete("delete/:id")
    async delete(@Param("id") id: string): Promise<CustomResponseBodyInterface> {
        await this.todoService.deleteById(id);

        return {
            message: "Todo removed successfully"
        };
    }
}
