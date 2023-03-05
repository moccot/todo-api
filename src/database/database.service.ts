import {ConflictException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {DataSource} from "typeorm";
import {TodoEntity} from "./entities/todo.entity";
import {TodoDto} from "../todo/dtos/todo.dto";
import {dataSource} from "./datasource";

@Injectable()
export class DatabaseService {
    private readonly dataSource: DataSource = dataSource;

    // Create

    async createTodo(todoDto: TodoDto): Promise<TodoEntity> {
        let newTodo: TodoEntity;

        try {
            newTodo = new TodoEntity();

            newTodo.description = todoDto.description;

            await this.dataSource.manager.save(newTodo);
        }

        catch (error) {
            if (error.code === "SQLITE_CONSTRAINT") {
                throw new ConflictException({
                    message: "This todo already exists.",
                    data: error
                });
            }

            throw new InternalServerErrorException({
                message: "Error saving todo.",
                data: error
            });
        }

        return newTodo;
    }

    // Read

    async getAllTodos(): Promise<TodoEntity[]> {
        return await this.dataSource.manager.find(TodoEntity);
    }

    private async getTodosBy(whereOption: any): Promise<TodoEntity[]> {
        return await this.dataSource.manager.findBy(TodoEntity, whereOption);
    }

    private async getTodoBy(whereOption: any): Promise<TodoEntity> {
        let todo: TodoEntity | null = await this.dataSource.manager.findOneBy(TodoEntity, whereOption);

        if (todo === null) {
            throw new NotFoundException({
                message: "This todo does not exist."
            });
        }

        return todo;
    }

    async getTodoById(todoId: string): Promise<TodoEntity> {
        return await this.getTodoBy({id: todoId});
    }

    async getTodoByDescription(todoDescription: string): Promise<TodoEntity> {
        return await this.getTodoBy({description: todoDescription});
    }

    async getAllCheckedTodos(): Promise<TodoEntity[]> {
        return await this.getTodosBy({checked: true});
    }

    async getAllUncheckedTodos(): Promise<TodoEntity[]> {
        return await this.getTodosBy({checked: false});
    }

    // Update

    async redescribeTodo(todoId: string, newDescription: string): Promise<void> {
        let todo: TodoEntity = await this.getTodoById(todoId);

        if (todo.description !== newDescription) todo.description = newDescription;

        await this.dataSource.manager.save(todo);
    }

    async checkTodo(todoId: string): Promise<void> {
        let todo: TodoEntity = await this.getTodoById(todoId);

        todo.checked = true;

        await this.dataSource.manager.save(todo);
    }

    async uncheckTodo(todoId: string): Promise<void> {
        let todo: TodoEntity = await this.getTodoById(todoId);

        todo.checked = false;

        await  this.dataSource.manager.save(todo);
    }
}
