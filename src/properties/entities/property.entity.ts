import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Agent } from "../../agents/entities/agent.entity.js";
import { Review } from "../../reviews/entities/review.entity.js";

export enum PropertyType{
    HOUSE = "House",
    TOWN_HOUSE = "Town House",
    CONDO = "Condo",
    DUPLEX = "Duplex",
    STUDIO = "Studio",
    VILLA = "Villa",
    APARTMENT = "Apartment",
    OTHER = "Other"
}


export enum FacilitiesType {
    LAUNDRY = "Laundry",
    PARKING = "Parking",
    GYM = "Gym",
    WIFI = "Wifi",
    PET_FRIENDLY = "Pet Friendly"
}

@Entity('properties')
export class Property {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({
        type:"enum",
        enum: PropertyType
    })
    type: PropertyType

    @Column()
    description: string;

    @Column()
    address: string;

    @Column({type:"decimal"})
    price: number;

    @Column({type:"float"})
    area: number;

    @Column()
    bedrooms: number;

    @Column()
    bathrooms: number;

    @Column({type:"enum", enum: FacilitiesType, array:true, default: []})
    facilities: FacilitiesType[];

    @Column()
    image: string;

    @Column()
    galleries: string[];

    @Column()
    geolocation: string;

    @ManyToOne(() => Agent, agent => agent.properties,{onDelete:"CASCADE"})
    @JoinColumn()
    agent: Agent;

    @OneToMany(() => Review, review => review.property)
    reviews: Review[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
