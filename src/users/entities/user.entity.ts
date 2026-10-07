import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn, OneToOne, OneToMany, Relation } from "typeorm";
import { Agent } from "../../agents/entities/agent.entity.js";
import { Review } from "../../reviews/entities/review.entity.js";
import type { RefreshToken } from "../../auth/entities/refresh-token.entity.js";

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', nullable: true })
    googleId: string | null; 

    @Column({ unique: true })
    email: string;

    @Column({ default: false })
    isEmailVerified: boolean;

    @Column({
        type: 'enum',
        enum: AuthProvider,
        default: AuthProvider.LOCAL,
    })
    provider: AuthProvider;

    @Column()
    name: string;

    @Column({ type: 'varchar',nullable: true})
    password: string|null;

    @Column({ type: 'varchar',nullable: true})
    photo: string|null;

    @OneToMany('RefreshToken', (refreshToken: RefreshToken) => refreshToken.user)
    refreshTokens: Relation<RefreshToken>[];

    @OneToMany(() => Agent, agent => agent.user)
    agent: Agent[];

    @OneToMany(() => Review, review => review.user)
    reviews: Relation<Review>[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
