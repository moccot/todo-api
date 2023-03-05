import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class TodoEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        length: 30,
        nullable: false,
        unique: true
    })
    description: string;

    @Column({
        type: "boolean",
        default: false
    })
    checked: boolean;
}
