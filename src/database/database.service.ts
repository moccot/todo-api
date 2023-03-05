import {ConflictException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {DataSource} from "typeorm";
import {TodoEntity} from "./entities/todo.entity";
import {TodoDto} from "../todo/dtos/todo.dto";
import {dataSource} from "./datasource";

@Injectable()
export class DatabaseService {
    private readonly dataSource: DataSource = dataSource;

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
}
