import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}
    
    async validateGoogleUser(googleProfile: {
        googleId:string;
        name:string;
        email:string;
        photo:string;
    }) : Promise<User>{
        // Already Linked?
        let user = await this.usersService.findByGoogleId(googleProfile.googleId);
        if(user) return user;

        // Email exits from local signuo - link the acounts
        user = await this.usersService.findOneByEmail(googleProfile.email);
        if(user){
            user.googleId = googleProfile.googleId;
            user.photo = googleProfile.photo;
            return await this.usersService.saveUser(user);
        }

        // New User
        user = new User();
        user.googleId = googleProfile.googleId;
        user.name = googleProfile.name;
        user.email = googleProfile.email;
        user.photo = googleProfile.photo;
        return await this.usersService.saveUser(user);
        
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if(!user || !user.password) throw new UnauthorizedException('Invalid credentials');
        const passwordMatched = await bcrypt.compare(pass, user.password);
        if (!passwordMatched) throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    async login(user:any){
        const payload = {email:user.email, sub: user.id};
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    // async register(dto:CreateUserDto): Promise<User>{
        
    // }
}
