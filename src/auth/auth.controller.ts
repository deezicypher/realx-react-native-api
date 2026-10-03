import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { ResendEmailDto } from './dto/resendEmail.dto.js';
import { ActivateDTO } from './dto/activate.dto.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('auth')
export class AuthController {
    constructor(
        private authService:AuthService
    ){}


    @Public()
    @Post('google')
    async googleLogin(@Body() body:{idToken: string}) {
    return this.authService.googleLogin(body.idToken);
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any){
        return this.authService.login(req.user)
    }

    @Public()
    @Post('register')
    register(@Body() dto:CreateUserDto){
        return this.authService.register(dto)
    }

    @Public()
    @Post('resend-email')
    resendActivation(@Body() dto:ResendEmailDto){
        return this.authService.resendActivation(dto)
    }

    @Public()
    @Post('activate')
    activateEmail(@Body() dto: ActivateDTO){
        return this.authService.activate(dto)
    }

    
    @Get('profile')
    profile(@Req() req: any){
        return req.user
    }
}
