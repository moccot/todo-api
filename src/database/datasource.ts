import {DataSource} from "typeorm";
import path from "path";
import {TodoEntity} from "./entities/todo.entity";

export let dataSource = new DataSource({
    type: "sqlite",
    database: path.join(__dirname, "..", "..", "database.sqlite"),
    entities: [TodoEntity],
    synchronize: true,
    logging: false
});

dataSource.initialize()
    .then(() => console.log("Database initialized successfully."))
    .catch(error => console.log("Error initializing database:", error));
