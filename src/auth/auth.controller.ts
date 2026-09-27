import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
    constructor(
        private authService:AuthService
    ){}

    @Post('google')
    async googleLogin(@Body() body:{idToken: string}) {
    return this.authService.googleLogin(body.idToken);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any){
        return this.authService.login(req.user)
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    profile(){
        return "Omo"
    }
}
