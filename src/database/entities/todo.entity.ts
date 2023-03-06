import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

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

    @CreateDateColumn()
    crated_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
