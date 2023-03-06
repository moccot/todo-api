import {ConflictException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {Repository} from "typeorm";
import {TodoEntity} from "./entities/todo.entity";
import {TodoDto} from "../todo/dtos/todo.dto";
import {dataSource} from "./datasource";

@Injectable()
export class TodoService {
    private readonly repository: Repository<TodoEntity> = dataSource.getRepository(TodoEntity);

    // Create

    async create(data: TodoDto): Promise<TodoEntity> {
        let newTodo: TodoEntity;

        try {
            newTodo = new TodoEntity();

            newTodo.description = data.description;

            await this.repository.save(newTodo);
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

    async getAll(): Promise<TodoEntity[]> {
        return await this.repository.find();
    }

    private async getAllBy(findWhereOptions: any): Promise<TodoEntity[]> {
        return await this.repository.findBy(findWhereOptions);
    }

    private async getBy(findWhereOptions: any): Promise<TodoEntity> {
        let todo: TodoEntity | null = await this.repository.findOneBy(findWhereOptions);

        if (todo === null) {
            throw new NotFoundException({
                message: "This todo does not exist."
            });
        }

        return todo;
    }

    async getById(id: string): Promise<TodoEntity> {
        return await this.getBy({id});
    }

    async getByDescription(description: string): Promise<TodoEntity> {
        return await this.getBy({description});
    }

    async getAllChecked(): Promise<TodoEntity[]> {
        return await this.getAllBy({checked: true});
    }

    async getAllUnchecked(): Promise<TodoEntity[]> {
        return await this.getAllBy({checked: false});
    }

    // Update

    async redescribeById(id: string, newDescription: string): Promise<void> {
        let todo: TodoEntity = await this.getById(id);

        if (todo.description === newDescription) throw new ConflictException({
            message: "Write a new description for this todo."
        });

        todo.description = newDescription;

        await this.repository.save(todo);
    }

    async checkById(id: string): Promise<void> {
        let todo: TodoEntity = await this.getById(id);

        todo.checked = true;

        await this.repository.save(todo);
    }

    async uncheckById(id: string): Promise<void> {
        let todo: TodoEntity = await this.getById(id);

        todo.checked = false;

        await  this.repository.save(todo);
    }

    // Delete

    async deleteById(id: string): Promise<void> {
        let todo: TodoEntity = await this.getById(id);

        await this.repository.remove(todo);
    }
}
