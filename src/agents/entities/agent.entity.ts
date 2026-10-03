import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Property } from "../../properties/entities/property.entity.js";

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
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
