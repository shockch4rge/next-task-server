import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { User } from "../user/User";

@Entity()
export class Book extends BaseEntity {
    @PrimaryColumn() id!: string;
    @Column() title!: string;
    @Column() isbn!: string;

    @OneToOne(() => User)
    @JoinColumn() borrower?: User;
}