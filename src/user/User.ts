import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn() id!: string;
    @Column() name!: string;
    @Column() email!: string;
}