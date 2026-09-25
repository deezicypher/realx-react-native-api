import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService
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
}
