import {Module} from "@nestjs/common";
import {TodoController} from "./todo.controller";
import {DatabaseService} from "../database/database.service";

@Module({
    controllers: [TodoController],
    providers: [DatabaseService]
})
export class TodoModule {}
