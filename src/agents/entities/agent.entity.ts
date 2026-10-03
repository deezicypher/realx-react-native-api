import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Property } from "../../properties/entities/property.entity.js";
import { User } from "../../users/entities/user.entity.js";

@Entity('agents')
export class Agent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({unique:true})
    email: string;

    @Column({type:"varchar", nullable:true})
    avatar: string;

    @OneToMany(() => Property, property => property.agent)
    properties: Property[];

    @ManyToOne(() => User, user => user.agent, {onDelete:"CASCADE"})
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
