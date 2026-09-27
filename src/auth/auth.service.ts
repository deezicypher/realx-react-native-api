import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthProvider, User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    private googleClient: OAuth2Client

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService:ConfigService
    ) {
        this.googleClient = new OAuth2Client(
            this.configService.get<string>('GOOGLE_WEB_CLIENT_ID')
        );
    }

    async googleLogin(idToken: string) {
    
        const ticket = await this.googleClient.verifyIdToken({
            idToken,
            audience:  this.configService.get<string>('GOOGLE_WEB_CLIENT_ID'),
        });

        const payload = ticket.getPayload();

        if (!payload) {
            throw new UnauthorizedException('Invalid Google token');
        }

        if (!payload.sub || !payload.email) {
            throw new UnauthorizedException(
            'Google token is missing required information',
            );
        }

 
        const user = await this.validateGoogleUser({
            googleId: payload.sub,
            name: payload.name ?? '',
            email: payload.email,
            photo: payload.picture ?? null,
        });

        
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });

        return {
            accessToken,
            user,
        };
        }
    
    async validateGoogleUser(googleProfile: {
        googleId:string;
        name:string;
        email:string;
        photo:string | null;
    }) : Promise<User>{
        // Already Linked?
        let user = await this.usersService.findByGoogleId(googleProfile.googleId);
        if(user) return user;

     
     // Email already belongs to another account
    const existingUser =
        await this.usersService.findOneByEmail(
        googleProfile.email,
        );

    if (existingUser) {
        throw new ConflictException(
        'An account with this email already exists. Please sign in using your original login method.',
        );
    }

    // New User
    user = new User();
    user.googleId = googleProfile.googleId;
    user.name = googleProfile.name;
    user.email = googleProfile.email;
    user.photo = googleProfile.photo;
    user.provider = AuthProvider.GOOGLE;
    user.isEmailVerified = true;
    user.password = null;
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
