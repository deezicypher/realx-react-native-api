import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthProvider, User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service.js';
import { ResendEmailDto } from './dto/resendEmail.dto.js';
import { ActivateDTO } from './dto/activate.dto.js';


@Injectable()
export class AuthService {
    private googleClient: OAuth2Client;
    

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService:ConfigService,
        private mailService:MailService
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
        if (!user.isEmailVerified) {
            throw new UnauthorizedException(
            'Please verify your email before signing in.',
            );
        }
        const passwordMatched = await bcrypt.compare(pass, user.password);
        if (!passwordMatched) throw new UnauthorizedException('Invalid credentials');
        
  
        return user;
    }

    async login(user:any){
        const payload = {email:user.email, sub: user.id};
        return {
            user,
            accessToken: this.jwtService.sign(payload)
        }
    }

    async register(dto:CreateUserDto): Promise<any>{
        const savedUser = await this.usersService.create(dto)
        const payload = {userId:savedUser.id}
        const activeToken = this.jwtService.sign(payload,{expiresIn:"1h"})
        const Client_Url = this.configService.get<string>('client_url')
        const url = `${Client_Url}/verify?token=${activeToken}`

        try {
            await this.mailService.sendActivationEmail(savedUser.email,url,savedUser.name)
            return {
                msg: `Confirmation Email sent to ${dto.email}`,
                email: savedUser.email,
            }
        } catch (error) {
            console.log(error)
            await this.usersService.remove(savedUser.id)
            throw new InternalServerErrorException("Unable to send activation email, at the moment")
        }
        
    }

    async resendActivation(dto:ResendEmailDto){
        const user  = await this.usersService.findOneByEmail(dto.email)
      
        if(!user){
            throw new NotFoundException('An activation email has been sent, if this account was registered')
        }

        if(user?.isEmailVerified){
        throw new ConflictException('Account has been activated')
        }

        const payload = {userId:user.id}
        const activeToken = this.jwtService.sign(payload)
        const CLIENT_URL = this.configService.get<string>('client_url')
        const url = `${CLIENT_URL}/verify?token=${activeToken}`
        try{
        await this.mailService.sendActivationEmail(user.email,url,user.name)
        return {
                msg: `Confirmation Email sent to ${user.email}`,
                email: user.email,
        }
        }catch(error){
            console.log(error)
            throw new InternalServerErrorException('Unable to send activation email. Please try again.')
        }
        
    }

    async activate(dto:ActivateDTO):Promise<any>{
        let payload:any;

        try {
            payload = this.jwtService.verify(dto.token);
        } catch (error) {
            throw new UnauthorizedException("Activation token is invalid or expired")
        }

        const user = await this.usersService.findOne(payload.userId)
        if(!user){
            throw new NotFoundException("This user account does not exist")
        }

        if (user.isEmailVerified) {
            return {
            msg: 'Email has already been verified',
            };
        }
        await this.usersService.activateUser(user)
        return { msg: 'Account activated successfully' };

    }
}
