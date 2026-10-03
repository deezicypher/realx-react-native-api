import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Property } from "../../properties/entities/property.entity.js";
import { User } from "../../users/entities/user.entity.js";


@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    avatar: string;

    @Column()
    review: string;

    @Column()
    rating: number;

    @ManyToOne(() => Property, property => property.reviews,{onDelete:"CASCADE"})
    @JoinColumn()
    property: Property;

    @ManyToOne(() => User, user => user.reviews,{onDelete:"CASCADE"})
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
