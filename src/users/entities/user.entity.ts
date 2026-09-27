import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
