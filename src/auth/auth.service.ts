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
import { randomBytes, createHash, randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    private googleClient: OAuth2Client;
    

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService:ConfigService,
        private mailService:MailService,
        @InjectRepository(RefreshToken)
        private refreshTokenRepo: Repository<RefreshToken>
    ) {
        this.googleClient = new OAuth2Client(
            this.configService.get<string>('GOOGLE_WEB_CLIENT_ID')
        );
    }

    private generateRefreshToken(): string {
        return randomBytes(64).toString('base64url');
    }

    private hashRefreshToken(token: string): string {
        return createHash('sha256')
            .update(token)
            .digest('hex');
    }

    private async revokeFamily(familyId: string): Promise<void> {
        await this.refreshTokenRepo.update(
            { familyId },
            {
            revokedAt: new Date(),
            },
        );
    }

    private async revokeToken(tokenHash: string): Promise<void> {
        await this.refreshTokenRepo.update(
            { tokenHash },
            {
            revokedAt: new Date(),
            },
        );
    
    }
            
    async createTokenPair(user: User) {
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });
        const refreshToken = this.generateRefreshToken();
        const tokenHash = this.hashRefreshToken(refreshToken);

        const familyId = randomUUID();

        const expiresAt = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
        );

        const familyExpiresAt = new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000,
        );

        const refreshTokenEntity = this.refreshTokenRepo.create({
        tokenHash,
        userId: user.id,
        familyId,
        expiresAt,
        familyExpiresAt,
        });

        await this.refreshTokenRepo.save(refreshTokenEntity);


        return {
            accessToken,
            refreshToken,
            expiresIn: 900,
        };
    }

    private async createRotatedTokenPair(
        user: User,
        familyId: string,
        familyExpiresAt: Date,
        ) {
        // Create a new short-lived access token
        const accessToken = this.jwtService.sign(
            {
            sub: user.id,
            email: user.email,
            }
        );

        // Generate a completely new refresh token
        const refreshToken = this.generateRefreshToken();

        // Store only the hash
        const tokenHash = this.hashRefreshToken(refreshToken);

        // This particular refresh token gets a new 30-day expiration
        const expiresAt = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
        );

        // IMPORTANT:
        // Do NOT create a new familyId.
        // Do NOT create a new familyExpiresAt.
        //
        // We keep the values from the previous token.

        const refreshTokenEntity = this.refreshTokenRepo.create({
            tokenHash,
            userId: user.id,
            familyId,
            expiresAt,
            familyExpiresAt,
        });

        await this.refreshTokenRepo.save(refreshTokenEntity);

        return {
            accessToken,
            refreshToken,
            user,
        };
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

        const tokens = await this.createTokenPair(user)
       
        return {
            user,
            ...tokens
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
        const tokens = await this.createTokenPair(user)
        return {
            user,
            ...tokens
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

    async refresh(rawToken: string) {
        const tokenHash = this.hashRefreshToken(rawToken);

        const storedToken = await this.refreshTokenRepo.findOne({
            where: { tokenHash },
        });

        if (!storedToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        if (storedToken.revokedAt) {
            // token reuse detected
            await this.revokeFamily(storedToken.familyId);

            throw new UnauthorizedException('Refresh token reuse detected');
        }

        if (storedToken.usedAt) {
            // token reuse detected
            await this.revokeFamily(storedToken.familyId);

            throw new UnauthorizedException('Refresh token reuse detected');
        }

        if (storedToken.expiresAt < new Date()) {
            throw new UnauthorizedException('Refresh token expired');
        }

        if (storedToken.familyExpiresAt < new Date()) {
            await this.revokeFamily(storedToken.familyId);

            throw new UnauthorizedException('Session expired');
        }

        // mark old token used
        storedToken.usedAt = new Date();

        await this.refreshTokenRepo.save(storedToken);

        const user = await this.usersService.findOne(
            storedToken.userId,
        );

        if (!user) {
            throw new UnauthorizedException();
        }

        return this.createRotatedTokenPair(
            user,
            storedToken.familyId,
            storedToken.familyExpiresAt,
        );
    }

    async logout(refreshToken: string): Promise<void> {
        const tokenHash = this.hashRefreshToken(refreshToken);

        await this.revokeToken(tokenHash);
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
